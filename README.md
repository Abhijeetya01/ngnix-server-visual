# NGINX Visual

An animated, beginner-friendly diagram that explains the **Nginx web server** step by step, in plain language. Nginx is told as the **front desk manager** of an online shop owned by Abhijeet Ranjan. No build step, no dependencies.

| Technical term | Plain-language analogy |
|---|---|
| Web server | Front desk handing out printed brochures |
| Reverse proxy | Manager passing orders to the kitchen |
| Load balancing | Sharing orders between several cooks |
| Cache | Shelf of ready-made copies |
| HTTPS / TLS | ID check and a locked box |
| Server blocks | One desk, many shops, chosen by signboard |
| Rate limiting | Bouncer |
| Gzip | Vacuum packing |
| Health check | "Is the cook awake?" plus a spare cook |

## Moving objects

| Emoji | Meaning |
|---|---|
| ✉️ | Visitor request |
| 📄 | Page sent back |
| ⚡ | Fast reply from the cache |
| 🔒 | HTTPS (encrypted) connection |
| 😈 | Bad bot |
| 📦 | Compressed (gzip) reply |
| 💓 | Health check |

## The 9 steps

Clicking a step shows it and everything before it.

1. **Web server** – browser, Nginx and static files
2. **Reverse proxy** – requests passed to an app server
3. **Load balancing** – work shared across app servers
4. **Caching** – repeat requests answered from Nginx
5. **HTTPS** – encrypted connection
6. **Server blocks** – a second site on the same Nginx
7. **Rate limiting** – a bad bot is blocked
8. **Gzip** – compressed replies
9. **Health checks** – a failed server and a backup

## Run locally

```bash
cd nginx-visual
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Host on GitHub Pages

1. Create a new repository and upload the contents of the `nginx-visual` folder (including the hidden `.nojekyll`) to `main`.
2. Open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/ (root)**, then click **Save**.
5. Open `https://<your-username>.github.io/<repository-name>/` after a minute.

## Project structure

```
nginx-visual/
  index.html
  css/style.css
  js/app.js
  .nojekyll
  LICENSE
  README.md
```

## Customise

- **Text:** edit the `STEPS` and `LEGEND` arrays in `js/app.js`.
- **Diagram colours:** edit the `C` object at the top of `js/app.js`.
- **Page colours:** edit the CSS variables at the top of `css/style.css`.
- **Positions:** each piece is one helper call (`box`, `label`, `wire`, `packet`); the first number is the step it appears in.
