# Southcoast Eats V5

A mobile-first restaurant discovery web app built with Next.js, TypeScript, and Supabase.

## What is included

- Responsive consumer-facing homepage with search and cuisine filters
- Featured restaurant cards and save-for-later interactions (demo state only)
- Supabase client setup, ready for environment variables
- Initial database schema migration with stable restaurant/location IDs, provider mappings, field provenance, and a review queue
- No ordering, checkout, or delivery functionality

**Important:** The restaurant cards and photos shown in the starter UI are sample/demo content. They are not verified business records. Favorites currently live only in browser memory and reset on refresh. Supabase is not connected until you configure environment variables and implement data loading/authentication.

## 1. Upload this project to GitHub using the website

1. Download and extract the ZIP file.
2. Open your `Southcoast-Eats-V5` repository on GitHub.
3. Choose **Add file → Upload files**.
4. Open the extracted `southcoast-eats-v5` folder on your computer and upload the *contents* of that folder, so `app`, `lib`, `supabase`, `package.json`, and the other files appear at the repository root.
5. Enter a commit message such as `Add Southcoast Eats V5 starter` and choose **Commit changes**.

Do not upload the ZIP itself as the only repository file.

## 2. Run it locally (when you're ready)

Install Node.js (LTS) from the official Node.js website, then in a terminal opened in the project folder run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

If you prefer not to use a terminal, we can use a hosted development/deployment workflow instead. The GitHub upload is the first step; it does not publish the website by itself.

## 3. Configure Supabase

1. Copy `.env.example` to a new file named `.env.local`.
2. In Supabase Dashboard → Project Settings → API, copy the project URL and publishable/anon key into `.env.local`.
3. Never put a `service_role` key in any `NEXT_PUBLIC_` variable or browser code.
4. Review `supabase/migrations/202610250001_initial_schema.sql` before applying it to the V5 database. It creates schema and access policies only; it does not add restaurant records.

The current app intentionally displays demo data until we wire up and test the Supabase queries.

## Project structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
lib/
  supabase/
    client.ts
supabase/
  migrations/
    202610250001_initial_schema.sql
.env.example
package.json
README.md
```

## Next steps

1. Upload the starter files to GitHub.
2. Confirm the files are visible in the repository.
3. Connect the project to Supabase and review/apply the database migration.
4. Replace demo listings with verified restaurant data.
5. Add authentication and persistent favorites only when we're ready to implement them.
