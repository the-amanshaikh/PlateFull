
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('user', 'restaurant', 'ngo');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles readable by all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles table (one role per user for MVP; unique(user_id))
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users pick own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Restaurants
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  meals_rescued INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_id)
);
GRANT SELECT ON public.restaurants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.restaurants TO authenticated;
GRANT ALL ON public.restaurants TO service_role;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Restaurants public read" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Restaurant owner insert" ON public.restaurants FOR INSERT WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'restaurant'));
CREATE POLICY "Restaurant owner update" ON public.restaurants FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Restaurant owner delete" ON public.restaurants FOR DELETE USING (auth.uid() = owner_id);

-- NGOs
CREATE TABLE public.ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  meals_distributed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_id)
);
GRANT SELECT ON public.ngos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ngos TO authenticated;
GRANT ALL ON public.ngos TO service_role;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "NGOs public read" ON public.ngos FOR SELECT USING (true);
CREATE POLICY "NGO owner insert" ON public.ngos FOR INSERT WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'ngo'));
CREATE POLICY "NGO owner update" ON public.ngos FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "NGO owner delete" ON public.ngos FOR DELETE USING (auth.uid() = owner_id);

-- Donations / flash sales
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('donation', 'flash_sale')),
  meals INTEGER NOT NULL DEFAULT 1,
  price_cents INTEGER,
  original_price_cents INTEGER,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'expired', 'collected')),
  claimed_by_ngo_id UUID REFERENCES public.ngos(id) ON DELETE SET NULL,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX donations_status_idx ON public.donations(status, expires_at);
CREATE INDEX donations_restaurant_idx ON public.donations(restaurant_id);
GRANT SELECT ON public.donations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Donations public read" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Restaurant owner inserts donation" ON public.donations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid()));
CREATE POLICY "Restaurant owner updates own donation" ON public.donations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid()));
CREATE POLICY "Restaurant owner deletes own donation" ON public.donations FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid()));
CREATE POLICY "NGO owner can claim donations" ON public.donations FOR UPDATE
  USING (public.has_role(auth.uid(), 'ngo'))
  WITH CHECK (public.has_role(auth.uid(), 'ngo'));

-- Ratings
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID NOT NULL REFERENCES public.ngos(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ngo_id, restaurant_id)
);
GRANT SELECT ON public.ratings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ratings TO authenticated;
GRANT ALL ON public.ratings TO service_role;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings public read" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "NGO owner insert rating" ON public.ratings FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.ngos n WHERE n.id = ngo_id AND n.owner_id = auth.uid()));
CREATE POLICY "NGO owner update rating" ON public.ratings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.ngos n WHERE n.id = ngo_id AND n.owner_id = auth.uid()));

-- Trigger: update restaurant reputation on rating insert/update
CREATE OR REPLACE FUNCTION public.apply_rating() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.restaurants
      SET rating_sum = rating_sum + NEW.stars,
          rating_count = rating_count + 1
      WHERE id = NEW.restaurant_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.restaurants
      SET rating_sum = rating_sum - OLD.stars + NEW.stars
      WHERE id = NEW.restaurant_id;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER ratings_apply
  AFTER INSERT OR UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.apply_rating();

-- Trigger: when donation is claimed by NGO, bump counters
CREATE OR REPLACE FUNCTION public.on_donation_claimed() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'claimed' AND (OLD.status IS DISTINCT FROM 'claimed') AND NEW.claimed_by_ngo_id IS NOT NULL THEN
    UPDATE public.restaurants SET meals_rescued = meals_rescued + NEW.meals WHERE id = NEW.restaurant_id;
    UPDATE public.ngos SET meals_distributed = meals_distributed + NEW.meals WHERE id = NEW.claimed_by_ngo_id;
    NEW.claimed_at = now();
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER donations_claim
  BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.on_donation_claimed();

-- Realtime for donations
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
