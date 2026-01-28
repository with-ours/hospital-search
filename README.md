# Hospital Search

A hospital search interface built with Next.js, Tailwind CSS, and MapLibre GL JS. Search for hospitals and healthcare facilities with an interactive map, filters, and result cards.

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your API key:
   ```
   NEXT_PUBLIC_LOCATION_SERVICES_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   yarn dev
   ```

## Environment Variables

- `NEXT_PUBLIC_LOCATION_SERVICES_API_KEY` (required): API key for location services (autocomplete, geocode, search, map styles)
- `NEXT_PUBLIC_LOCATION_SERVICES_BASE_URL` (optional): Base URL for location services API. Defaults to `http://localhost:3001/location-services` if not provided.
