# GitHub Pages Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

## Setup Instructions

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Under "Build and deployment":
     - Source: **GitHub Actions**

2. **Push to main branch**:
   ```bash
   git push origin main
   ```

3. **Monitor deployment**:
   - Go to Actions tab to see the deployment progress
   - Once complete, your site will be available at: `https://jorgecasar.github.io/legacys-end/`

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Workflow

The deployment happens automatically when you push to the `main` branch:

1. Checkout code
2. Install dependencies
3. Build the project (`npm run build`)
4. Upload build artifacts
5. Deploy to GitHub Pages

## Manual Deployment

You can also trigger a deployment manually:
- Go to Actions → Deploy to GitHub Pages → Run workflow

## Configuration

The base path is configured in `vite.config.js`:
- Development: `/` (root)
- Production: `/legacys-end/` (repository name)

This ensures assets load correctly on GitHub Pages.
