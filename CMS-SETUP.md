# Sveltia CMS Setup — Supreme Warrior

After deploying the site, configure GitHub authentication so editors can use `/admin/`.

## 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** Supreme Warrior CMS
   - **Homepage URL:** `https://www.supremewarrior.ph`
   - **Authorization callback URL:** `https://www.supremewarrior.ph/admin/`
4. For local development, create a second OAuth app (or add a second callback):
   - `http://localhost:8080/admin/`
5. Copy the **Client ID** and generate a **Client Secret**

## 2. Configure Sveltia CMS

Sveltia CMS uses the Decap/Netlify CMS config format. Add OAuth credentials to `admin/config.yml`:

```yaml
backend:
  name: github
  repo: leadmakerAgency/Supreme-Warrior
  branch: main
  # Optional — if using a custom OAuth proxy:
  # base_url: https://your-oauth-proxy.example.com
  # auth_endpoint: auth
```

For GitHub backend without a proxy, Sveltia handles OAuth via the GitHub API directly when you log in at `/admin/`.

## 3. Grant Repository Access

Editors need **write access** to `leadmakerAgency/Supreme-Warrior`:

- Add collaborators under GitHub repo → Settings → Collaborators
- Or use a GitHub App / OAuth app scoped to the organization

## 4. Editor Workflow

1. Open `https://www.supremewarrior.ph/admin/`
2. Click **Login with GitHub**
3. Create or edit a post
4. Set `draft: false` and `date` ≤ today to publish
5. Save → CMS commits `.md` to `content/posts/` and images to `content/media/`
6. Vercel rebuilds automatically on push to `main`

## 5. Draft & Scheduling

| Environment | `draft: true` | Future `date` |
|-------------|--------------|---------------|
| Local (`npm run dev`) | Visible | Visible |
| Production (Vercel) | Hidden | Hidden |
| `ELEVENTY_INCLUDE_FUTURE=true` | Hidden | Visible |

## 6. Reusing LeadMaker OAuth App

If Splice Property Solutions already uses a shared LeadMaker GitHub OAuth app, add `https://www.supremewarrior.ph/admin/` as an additional callback URL on that app instead of creating a new one.
