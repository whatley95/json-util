# Cloudflare Pages Deployment Guide for JSON-Util

## Deploying to Cloudflare Pages

Follow these steps to deploy the JSON-Util application to Cloudflare Pages:

### Prerequisites
- A Cloudflare account
- Node.js installed locally

### Deployment Steps

1. **Build the project for Cloudflare Pages**
   ```bash
   npm run deploy:cf
   ```

2. **Deploy to Cloudflare Pages**
   - Log into your Cloudflare account
   - Go to Workers & Pages > Create application > Pages
   - Connect your GitHub account and select the json-util repository
   - Configure the build settings:
     - Production branch: `main` or `master`
     - Build command: `npm run deploy:cf`
     - Build output directory: `dist`
     - Root directory: `/` (leave blank)
   - Click "Save and Deploy"

3. **Environment Variables**
   - No additional environment variables are needed for basic deployment

### Important Configuration Files
- `_headers`: Controls HTTP headers for security and caching
- `_redirects`: Handles SPA routing redirects
- `_routes.json`: Configures Cloudflare Pages Functions (if used)
- `wrangler.toml`: Cloudflare Workers configuration

### Troubleshooting

If you encounter any issues with paths or routing:
1. Verify that the base URL in `vite.config.ts` is set correctly
2. Check the router configuration in `src/router/index.ts`
3. Ensure all assets are being properly referenced with the correct base path

### Local Testing
To test the production build locally before deploying:
```bash
npm run deploy:cf
npm run preview
```

### Custom Domain Setup
1. In Cloudflare Pages > Your project > Custom domains
2. Add your custom domain
3. Follow the DNS configuration instructions provided by Cloudflare
