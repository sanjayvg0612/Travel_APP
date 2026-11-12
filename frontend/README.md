# 🚀 Wanderlust React Frontend — Deployment Guide

This directory contains the complete **React 18 (Vite)** implementation of the Wanderlust Travel Platform. It is fully modular, decoupled from any specific host, and ready for deployment on any modern web server, cloud platform, or CDN.

---

## 📦 Project Structure

```
frontend/
├── index.html                   # HTML5 shell with Google Fonts
├── vite.config.js               # Fast Vite bundler configuration
├── package.json                 # React 18, Vite dependencies & build scripts
├── src/
│   ├── main.jsx                 # React DOM root entry
│   ├── App.jsx                  # Main page layout & provider composition
│   ├── context/
│   │   └── TravelContext.jsx    # Global state (Theme, Currency, Wishlist, Audio, Passport)
│   ├── components/
│   │   ├── Navbar.jsx           # Theme picker, audio visualizer, passport badge, wishlist
│   │   ├── HeroMasthead.jsx     # Editorial typography & issue stamp
│   │   ├── VibeMatrix.jsx       # 3-axis psychological travel dial matcher
│   │   ├── TwilightSlider.jsx   # Interactive day-to-night comparison slider
│   │   ├── DestinationsGrid.jsx # Sanctuaries with coordinates & stamp actions
│   │   ├── PackagesGrid.jsx     # Curated expeditions, pricing & wishlist
│   │   ├── ItineraryModal.jsx   # Day-by-day blueprint timeline
│   │   ├── BoardingPassModal.jsx# Vintage first-class perforated boarding pass
│   │   ├── PassportModal.jsx    # Royal Explorers Club digital visa book
│   │   └── WishlistDrawer.jsx   # Slide-over saved journeys drawer
│   ├── data/
│   │   └── travelData.js        # Seed destinations, packages, currencies & addons
│   ├── utils/
│   │   └── soundscapes.js       # Generative Web Audio API synthesizer
│   └── styles/
│       ├── main.css             # 4 haute themes tokens & typography
│       └── components.css       # Perforated tickets, passport, twilight slider styles
```

---

## 🛠️ Local Development (On Your Server with Node.js)

1. Open your terminal in this directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *Runs by default on `http://localhost:3000`.*

---

## 🌐 Deployment Options

### 1. Deploying to Vercel (Recommended — Free & Instant)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your repository and set the **Root Directory** to `frontend`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**. Vercel will build and assign an instant HTTPS domain!

### 2. Deploying to Netlify
1. Log into [Netlify](https://netlify.com) and click **"Add new site"** -> **"Import an existing project"**.
2. Select your repository.
3. Configure the build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy Site**.

### 3. Deploying to a Linux VPS (Nginx / Apache / Ubuntu)
1. Build the production static bundle:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. This generates the `dist/` directory containing optimized HTML, CSS, and JS chunks.
3. Copy the `dist/` files to your server (e.g. `/var/www/travel-website`).
4. Sample Nginx configuration (`/etc/nginx/sites-available/travel`):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/travel-website;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
5. Reload Nginx: `sudo systemctl reload nginx`.

### 4. Deploying via Docker
A sample `Dockerfile` for serving with Nginx:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
Build and run:
```bash
docker build -t wanderlust-react .
docker run -p 80:80 wanderlust-react
```

---

## 🔗 Dynamic AWS & Cloud URL Detection
The application features **zero-configuration dynamic API host discovery** (`src/utils/apiConfig.js`):
1. **AWS Application Load Balancer (ALB) / Nginx (Port 80/443)**: Automatically derives the API endpoint from `window.location.origin + '/api'`, seamlessly matching your ALB DNS name (e.g. `http://my-alb-1234.us-east-1.elb.amazonaws.com/api`) or your custom domain.
2. **Direct AWS EC2 Public IP (e.g. `http://54.x.x.x:3000`)**: Automatically reads the browser's current `window.location.hostname` and targets port 5000 on that same EC2 public IP (`http://54.x.x.x:5000/api`) without hardcoding `localhost`.
3. **Localhost Development**: Proxies `/api` automatically through Vite or falls back gracefully to `localhost:5000`.
4. **Offline / Standalone Fallback**: If the backend is not yet started, the UI seamlessly falls back to the client-side seed dataset.
5. **Optional Override**: You can also set `VITE_API_URL=http://<custom-backend-url>/api` in `.env` if desired.
