# Éirelign — Static Site

Minimal static site for Éirelign (Dublin, IE).

## Run locally
Open `index.html` directly, or start a simple server:

```bash
python3 -m http.server 5173
# then visit http://localhost:5173
```

## Deploy (GitHub Pages)
1. Create repo `eirelign-site`, push the code to `main`.
2. GitHub Actions will publish automatically to Pages.
3. Your site will be available at `https://<your-github-username>.github.io/eirelign-site/`.

Update `robots.txt`, `sitemap.xml`, and the JSON-LD URL in `index.html` with your GitHub username after deploy.
