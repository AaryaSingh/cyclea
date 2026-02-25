# Cyclea

A health tracking app for women's wellness with cycle tracking, check-ins, and community features.

## Running the app

1. Install dependencies: `npm i`
2. Start dev server: `npm run dev`

**Without Supabase**: The app works offline using localStorage. All features except real-time community sync will function normally.

## Supabase Backend (optional)

To enable real-time social features, secure cloud storage, and cross-device sync:

1. Create a [Supabase project](https://supabase.com)
2. In Supabase Dashboard → Project Settings → API, copy the **Project URL** and **anon public** key
3. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
5. Run migrations: In Supabase SQL Editor, run the SQL from `supabase/migrations/001_initial_schema.sql`, then `002_realtime.sql`
6. Enable Anonymous Auth: Authentication → Providers → Enable "Anonymous"

The app will automatically sign in anonymously when Supabase is configured, sync your data to the cloud, and enable real-time community posts and comments.
