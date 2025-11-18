# Deployment Guide

This document explains how to deploy the Nutrient Document Loading Comparison demo to Vercel.

## Prerequisites

- Vercel account (https://vercel.com)
- Git repository for your project (GitHub, GitLab, or Bitbucket)
- Environment variables ready (see below)

## Required Environment Variables

You'll need to configure these environment variables in the Vercel dashboard:

### Web SDK Configuration
```
NEXT_PUBLIC_WEB_SDK_VERSION=1.8.0
NEXT_PUBLIC_WEB_SDK_LICENSE_KEY=your_license_key_here
```

### Document Engine (Nutrient DWS) Configuration
```
NEXT_PUBLIC_DOCUMENT_ENGINE_SERVER_URL=your_dws_server_url
NEXT_PUBLIC_DOCUMENT_ENGINE_DOCUMENT_ID=your_document_id
NEXT_PUBLIC_DOCUMENT_ENGINE_JWT=your_jwt_token
```

### Optional (Only if using Nutrient API directly)
```
NUTRIENT_API_BASE_URL=https://api.nutrient.io/viewer/documents
NUTRIENT_API_KEY=your_api_key_here
NEXT_PUBLIC_DEFAULT_DOCUMENT_URL=/documents/your-document.pdf
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project directory:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account/team
   - Link to existing project? **N** (first time) or **Y** (subsequent)
   - What's your project's name? `nutrient-loading-comparison`
   - In which directory is your code located? `./`

5. Set environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_WEB_SDK_VERSION
   vercel env add NEXT_PUBLIC_WEB_SDK_LICENSE_KEY
   vercel env add NEXT_PUBLIC_DOCUMENT_ENGINE_SERVER_URL
   vercel env add NEXT_PUBLIC_DOCUMENT_ENGINE_DOCUMENT_ID
   vercel env add NEXT_PUBLIC_DOCUMENT_ENGINE_JWT
   ```

6. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (or GitLab/Bitbucket)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your Git provider
   - Choose your repository

3. **Configure Project**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable from the list above
   - Set to "Production", "Preview", and "Development" environments

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)

## Post-Deployment

### Verify Deployment

1. **Check the deployed URL** provided by Vercel
2. **Test each loading method**:
   - Web SDK Viewer (standard)
   - Web SDK with Linearized Loading
   - Nutrient DWS Viewer

3. **Check browser console** for any errors
4. **Test dark mode** (toggle in browser dev tools)

### Update Environment Variables

If you need to update environment variables after deployment:

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Environment Variables"
3. Update the values
4. Redeploy the project (or wait for auto-deploy on next push)

### Custom Domain (Optional)

1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Failures

**TypeScript errors:**
```bash
# Run locally to check for errors
npm run build
```

**Missing dependencies:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Runtime Errors

**Environment variables not loading:**
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/updating environment variables

**Fonts not loading:**
- Check that font files are in `public/fonts/`
- Verify font paths in `app/globals.css`

**PDF files not loading:**
- Check S3 bucket CORS configuration
- Verify S3 file URLs are accessible
- Check browser console for network errors

**Document Engine errors:**
- Verify JWT token is valid and not expired
- Check serverUrl matches your DWS instance
- Ensure documentId exists in your DWS

### Performance Issues

**Slow loading times:**
- Enable CDN caching for static assets (configured in vercel.json)
- Consider using Vercel's Edge Network
- Optimize image and PDF file sizes

**High bandwidth usage:**
- Implement proper caching headers
- Use linearized PDFs for progressive loading
- Consider using smaller test documents

## Automatic Deployments

Vercel automatically deploys your project:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to any other branch or pull request

### Disable Auto-Deploy (if needed)

1. Go to project settings
2. Click "Git"
3. Uncheck "Production Branch" or "Preview Branches"

## Environment-Specific Configurations

### Development
```bash
vercel dev  # Run locally with Vercel environment
```

### Preview
- Automatically created for each PR
- Uses preview environment variables

### Production
- Deployed from main branch
- Uses production environment variables

## Monitoring

### Analytics

1. Go to your project dashboard
2. Click "Analytics"
3. View:
   - Page views
   - Load times
   - Error rates
   - Geographic distribution

### Logs

1. Go to your project dashboard
2. Click "Functions" or "Deployments"
3. Click on a specific deployment
4. View real-time logs

## Security Considerations

### Environment Variables
- Never commit `.env.local` to Git
- Use Vercel's environment variable management
- Rotate JWT tokens regularly

### CORS
- S3 bucket configured for public read access
- CORS headers set in S3 bucket policy
- Additional security headers set in vercel.json

### Content Security Policy
- Consider adding CSP headers in vercel.json
- Whitelist only necessary domains

## Cost Optimization

### Vercel Free Tier Includes:
- 100 GB bandwidth per month
- Unlimited deployments
- SSL certificates
- Preview deployments

### Exceeding Free Tier:
- Monitor usage in Vercel dashboard
- Consider upgrading to Pro plan if needed
- Optimize asset sizes to reduce bandwidth

## Support

### Vercel Support
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

### Nutrient Support
- Documentation: https://docs.nutrient.io
- Support: Contact your Nutrient account manager

## Rollback

If a deployment has issues:

1. Go to "Deployments"
2. Find a previous working deployment
3. Click the three dots (•••)
4. Click "Promote to Production"

## Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Platform](https://vercel.com/docs)
- [Nutrient Web SDK](https://docs.nutrient.io/web)
- [Nutrient DWS](https://docs.nutrient.io/document-engine)
