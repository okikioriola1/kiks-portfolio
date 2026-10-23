# Okiki Oriola — Frontend Portfolio

A personal portfolio presenting frontend projects, background, and contact links. The site uses multiple HTML entry points with JavaScript-driven page transitions, text effects, and a custom cursor.

[View the live portfolio](https://kiks-portfolio.vercel.app)

![Portfolio homepage](docs/screenshots/homepage.png)

## Pages and interactions

- Home pages at `index.html` and `home.html`.
- About page at `about.html`.
- Project gallery at `projects.html`, with links to hosted projects.
- GSAP animations, Splitting text effects, Barba page transitions, and a custom cursor.
- Sass organized into base, shared, page, and utility styles.

## Stack

HTML, JavaScript, Sass, Vite, GSAP, Barba.js, and Splitting.

## Run locally

Use Node.js 24 and npm.

```bash
git clone https://github.com/okikioriola1/new-portfolio.git
cd new-portfolio
npm ci
npm run dev
```

Open the URL printed by Vite. No API or environment variables are required.

## Build and preview

```bash
npm run build
npm run preview
```

Vite builds all four HTML entry points configured in [vite.config.js](vite.config.js) into `dist/`. GitHub Actions checks the production build on pushes and pull requests. There are currently no automated tests or lint script.

## Code map

- `index.html`, `home.html`, `about.html`, `projects.html`: page content.
- `main.js`: page interactions and transitions.
- `app/`: animation helpers, cursor, and math utilities.
- `styles/` and `style.scss`: Sass source.
- `public/assets/`: project images and icons.

## Credits

The existing site footer credits the design to Ebube. That attribution remains in the page source.

## Next improvements

Review reduced-motion behavior and keyboard navigation, add navigation smoke tests, and check image sizes and external project links before each portfolio update.
