# Kiks — Software Engineer Portfolio

Okiki Oriola’s personal portfolio presenting software engineering projects, experience, and contact links. The site uses multiple HTML entry points with JavaScript-driven page transitions, text effects, and a custom cursor.

Custom domain: `kiks.run` (deployment pending).

![Portfolio homepage](docs/screenshots/homepage.png)

## Pages and interactions

- Home pages at `index.html` and `home.html`.
- About page at `about.html`.
- Project gallery at `projects.html`, with scroll-driven horizontal projects on desktop and mobile.
- Animated Kiks intro with asset-readiness handling and reduced-motion support.
- GSAP animations, Splitting text effects, Barba page transitions, and a custom cursor.
- Sass organized into base, shared, page, and utility styles.

## Stack

HTML, JavaScript, Sass, Vite, GSAP, Barba.js, and Splitting.

## Run locally

Use Node.js 24 and npm.

```bash
git clone https://github.com/okikioriola1/kiks-portfolio.git
cd kiks-portfolio
npm ci
npm run dev
```

Open the URL printed by Vite. No API or environment variables are required.

## Build and preview

```bash
npm run build
npm run preview
```

Vite builds all four HTML entry points configured in [vite.config.js](vite.config.js) into `dist/`. GitHub Actions runs the animation regression tests and production build on pushes and pull requests. Run `npm test` locally to check loader readiness, gallery positioning, and selected-work navigation behavior.

## Code map

- `index.html`, `home.html`, `about.html`, `projects.html`: page content.
- `main.js`: page interactions and transitions.
- `app/`: animation helpers, cursor, and math utilities.
- `styles/` and `style.scss`: Sass source.
- `public/assets/`: project images and icons.

## Credits

The existing site footer credits the design to Ebube. That attribution remains in the page source.

## Next improvements

Connect the GitHub repository to Vercel, configure `kiks.run`, and check navigation, image loading, and external project links on the production deployment.
