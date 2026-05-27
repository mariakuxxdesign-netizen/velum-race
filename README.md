# Velum Race

Next.js prototype for the Velum Race landing page with an editable Clinics section.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the landing page and `http://localhost:3000/admin` for the Clinics editor.

## Data storage recommendation

For this prototype, a full custom backend is not necessary.

Best fit: **Supabase free tier** with one `clinics` table. It is cheap, gives you a real Postgres database, and can later support image uploads through Supabase Storage if the idea validates.

Why not only local JSON: local JSON is fine while developing, but hosted serverless platforms such as Vercel do not persist file edits after deployment. The project currently falls back to `data/clinics.json` when Supabase env vars are missing, so local development stays simple.

Recommended hosting:

- **Vercel** for the Next.js site.
- **Supabase** for clinic data.
- Add image uploads later with Supabase Storage. For the first lead test, pasting an image URL is cheaper and faster.

## Supabase setup

Run `supabase.schema.sql` in the Supabase SQL editor, then add these environment variables to Vercel:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=choose-a-private-password
```

`ADMIN_PASSWORD` enables basic password protection for `/admin`. Without it, the admin page is open, which is only acceptable for local testing.

Clinic images are uploaded to a public Supabase Storage bucket named `clinic-images`. The admin saves the uploaded public image URL in the `clinics.image_url` field.

The `registrations` table stores submissions from individual clinic-date pages. Run the full `supabase.schema.sql` after schema changes so both `clinics` and `registrations` exist.
