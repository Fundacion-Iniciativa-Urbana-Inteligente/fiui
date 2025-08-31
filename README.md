# Fundación Iniciativa Urbana Inteligente (FIUI) --- Website

[fiui.org.ar](https://www.fiui.org.ar) --- Static landing page of FIUI
to showcase projects (e.g., Jinete.ar), donations, press, and contact.

> 👉 More details in [HOT_WALLET.md](docs/HOT_WALLET.md).\
> Recommended hosting: **Firebase Hosting** (this repo already includes
> `firebase.json`).

------------------------------------------------------------------------

## 🧩 Tech stack

-   HTML + CSS/SCSS + JS (static)
-   Theme: **HTML5 UP -- Paradigm Shift**
-   Deployment: **Firebase Hosting**

------------------------------------------------------------------------

## 📂 Structure

    .
    ├─ index.html          # Main page
    ├─ assets/             # CSS/JS from the theme
    ├─ images/             # Images and logos
    ├─ .firebaserc         # Firebase project alias
    ├─ firebase.json       # Hosting config
    └─ LICENSE.txt         # License/Credits for the theme

------------------------------------------------------------------------

## ▶️ Run locally

As it is static, you only need a simple server.

### Option A: with Node (http-server)

``` bash
npm i -g http-server
http-server -p 8080
# Open http://localhost:8080
```

### Option B: with Python (3.x)

``` bash
python -m http.server 8080
# Open http://localhost:8080
```

------------------------------------------------------------------------

## 🚀 Deploy to Firebase Hosting

> Requires a Firebase project already created and proper permissions.

1.  Install CLI:

    ``` bash
    npm i -g firebase-tools
    firebase login
    ```

2.  Select the project (if `.firebaserc` is already configured, skip
    this step):

    ``` bash
    firebase use --add
    ```

3.  Deploy:

    ``` bash
    firebase deploy
    ```

> This repo already includes `firebase.json`, so the deploy publishes
> the root folder as a static site. If you use Cloudflare as proxy for
> your domain, point the CNAME/AAAA/A records to the host provided by
> Firebase.

------------------------------------------------------------------------

## 🖼️ Content & editing

-   **Texts/Sections**: edit `index.html`.
-   **Styles & scripts**: inside `assets/`.
-   **Images/Logos**: put them in `images/` and reference them in
    `index.html`.

### Logo carousel (minimal example)

To show partners/sponsors, you can use a simple snippet without
dependencies:

``` html
<div class="logo-carousel">
  <div class="track">
    <img src="images/logo1.png" alt="Partner 1" />
    <img src="images/logo2.png" alt="Partner 2" />
    <img src="images/logo3.png" alt="Partner 3" />
    <img src="images/logo4.png" alt="Partner 4" />
    <!-- duplicate the set for infinite loop -->
    <img src="images/logo1.png" alt="Partner 1" />
    <img src="images/logo2.png" alt="Partner 2" />
    <img src="images/logo3.png" alt="Partner 3" />
    <img src="images/logo4.png" alt="Partner 4" />
  </div>
</div>

<style>
.logo-carousel { overflow: hidden; width: 100%; }
.logo-carousel .track {
  display: flex; gap: 2rem; align-items: center;
  width: max-content; animation: scroll 25s linear infinite;
}
.logo-carousel img { height: 48px; opacity: .9; }
@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
```

> Tip: duplicating the logos inside `.track` prevents a "cut" when the
> carousel restarts.

------------------------------------------------------------------------

## 🔒 Publishing best practices

-   Compress images before uploading (`.webp` recommended).
-   Use `<img loading="lazy">` for better performance.
-   Keep links and metadata (SEO/OpenGraph) updated in `index.html`.

------------------------------------------------------------------------

## 🧪 Deployment checklist

-   [ ] All links work (internal/external).
-   [ ] Images optimized.
-   [ ] Metadata: `<title>`, `<meta name="description">`,
    OpenGraph/Twitter.
-   [ ] Favicons and `manifest.json` (if PWA applies).
-   [ ] Mobile view tested.

------------------------------------------------------------------------

## 🤝 Contributing

1.  Fork → branch (`feat/my-change`)\
2.  Commit with clear messages\
3.  Pull Request with description and, if possible, screenshots

------------------------------------------------------------------------

## 📜 License & credits

-   Template **"Paradigm Shift"** by HTML5 UP --- License **Creative
    Commons Attribution 3.0**.\
    Credits of the author and theme dependencies inside `LICENSE.txt`.\
-   FIUI's own content (texts, images, logos) remains under the license
    defined by the Foundation.

------------------------------------------------------------------------

## 📬 Contact

-   Fundación Iniciativa Urbana Inteligente (FIUI) --- Argentina\
-   Website: https://www.fiui.org.ar\
-   Email: info@fiui.org.ar
