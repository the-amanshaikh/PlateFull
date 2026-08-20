# PlateFull 🍽️

> Rescuing food, feeding the future. A real-time surplus rescue network connecting restaurants, NGOs, and everyday users to end food waste.

PlateFull is a premium platform built with **Vite, React, TanStack Start (SSR), and Supabase** that tackles food waste head-on. It provides a real-time marketplace where restaurants can post surplus food (either as donations or flash sales), and NGOs or users can claim them instantly.

## 🚀 Features

*   **Three distinct user roles:**
    *   **🧑 Everyday Users:** Discover heavily discounted meals from restaurants near you before they close.
    *   **🏪 Restaurants:** Turn surplus into impact. Push flash discounts or donate to verified NGOs. Track your impact on the leaderboard.
    *   **🤝 NGOs:** Get real-time alerts when partners have food to give. Claim, collect, and rate the quality.
*   **Real-time Network:** Built with Supabase Realtime to push new donations and claims instantly across the network without refreshing.
*   **Leaderboard & Reputation:** Restaurants build reputation through successful rescues and ratings, gamifying the food rescue process.
*   **3D Hero & Animations:** Immersive user experience with Framer Motion and `@react-three/fiber` 3D elements.
*   **Interactive Maps:** Powered by Leaflet to find donations geographically.

## 🏗️ Architecture

The application is built using a modern SSR (Server-Side Rendering) architecture:

```mermaid
graph TD
    %% Actors
    subgraph Users ["👥 Platform Actors"]
        R[🏪 Restaurant]
        N[🤝 NGO]
        U[🧑 Everyday User]
    end

    %% Frontend App
    subgraph Frontend ["💻 Frontend (React 19, Tailwind 4, Framer Motion)"]
        RD["Restaurant Dashboard<br/>- Post surplus food<br/>- Track impact"]
        ND["NGO Dashboard<br/>- Live map view<br/>- Claim donations"]
        UD["User Feed<br/>- Find nearby discounts<br/>- Countdown timers"]
        
        R -->|Posts Surplus| RD
        N -->|Claims Food| ND
        U -->|Buys Discounts| UD
    end

    %% Backend & Realtime
    subgraph Serverless ["⚡ Serverless & SSR (Vercel + TanStack Start)"]
        API["API & Server Components"]
    end

    %% Database
    subgraph Backend ["🗄️ Backend Infrastructure (Supabase)"]
        DB[("PostgreSQL Database<br/>- Profiles & Roles<br/>- Active Donations<br/>- Ratings & Impact")]
        Auth["🔒 Authentication & RLS"]
        WS["🔌 Realtime WebSockets"]
    end

    %% Flow connections
    RD -->|Secure API Call| API
    ND -.->|Secure API Call| API
    UD -.->|Secure API Call| API

    API -->|Validates via| Auth
    Auth -->|CRUD Operations| DB

    %% Realtime magic
    DB -->|DB Triggers Update| WS
    WS == "Live Websocket Push" ==> ND
    WS == "Live Websocket Push" ==> UD
    
    %% Styling
    classDef actor fill:#f3f4f6,stroke:#374151,stroke-width:2px,color:#000
    classDef front fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#000
    classDef back fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#000
    classDef db fill:#fef08a,stroke:#ca8a04,stroke-width:2px,color:#000
    
    class R,N,U actor
    class RD,ND,UD front
    class API,WS back
    class DB,Auth db
```

## 🛠️ Tech Stack

*   **Frontend Framework:** React 19, Vite
*   **Routing & SSR:** TanStack Router, TanStack Start (Nitro)
*   **Backend & Database:** Supabase (PostgreSQL), Supabase Auth, Supabase Realtime
*   **Styling:** Tailwind CSS 4, Radix UI (Headless UI components)
*   **Animations:** Framer Motion, Three.js (`@react-three/fiber`)
*   **Mapping:** React Leaflet

## 🗄️ Database Schema

Our PostgreSQL schema features strict Row Level Security (RLS) to ensure data privacy:

*   **`profiles`**: Auto-created on signup via trigger.
*   **`user_roles`**: Links a user to their specific app role (`user`, `restaurant`, `ngo`).
*   **`restaurants`**: Stores restaurant details and impact stats (`meals_rescued`, `rating_sum`).
*   **`ngos`**: Stores NGO details and `meals_distributed`.
*   **`donations`**: The core marketplace table. Includes `kind` ('donation' or 'flash_sale'), `status` ('active', 'claimed', 'expired', 'collected'), and expiration timestamps.
*   **`ratings`**: NGO-to-Restaurant ratings, automatically updating restaurant reputation via database triggers.

## 💻 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/the-amanshaikh/PlateFull.git
cd PlateFull
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL="your-supabase-project-url"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
VITE_SUPABASE_PROJECT_ID="your-supabase-project-id"
SUPABASE_URL="your-supabase-project-url"
SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
SUPABASE_PROJECT_ID="your-supabase-project-id"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🚢 Deployment

The project is optimized for deployment on Vercel. 
1. Connect your GitHub repository to Vercel.
2. Select the **Vite** preset (or let Vercel auto-detect).
3. Ensure you add all the Environment Variables listed above in the Vercel dashboard.
4. Set the Output Directory to `.output` (Vercel should auto-detect this for Nitro).
5. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the MIT License.
