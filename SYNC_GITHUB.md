# 🔄 GitHub Synchronization Guide

## Current Repository
- **GitHub URL**: https://github.com/rachinha01/dtc8d
- **Branch**: main

## 📋 Steps to Sync with GitHub

### Method 1: Using StackBlitz Git Panel (Recommended)

1. **Open Git Panel**
   - Click on the Git icon in the left sidebar of StackBlitz
   - Or use `Ctrl+Shift+G` (Windows/Linux) or `Cmd+Shift+G` (Mac)

2. **Stage Changes**
   - You'll see all modified files listed
   - Click the `+` button next to each file to stage them
   - Or click "Stage All Changes" to stage everything

3. **Commit Changes**
   - Enter a commit message describing your changes:
     ```
     feat: Update Supabase configuration
     
     - Updated SUPABASE_URL to new instance
     - Updated SUPABASE_ANON_KEY with new JWT token
     - Maintained all existing functionality
     ```
   - Click "Commit" button

4. **Push to GitHub**
   - Click "Push" to send changes to GitHub
   - Changes will be automatically synced to the main branch

### Method 2: Manual Git Commands (Alternative)

If you prefer using terminal commands:

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "feat: Update Supabase configuration

- Updated SUPABASE_URL to new instance  
- Updated SUPABASE_ANON_KEY with new JWT token
- Maintained all existing functionality"

# Push to GitHub
git push origin main
```

### Method 3: Download and Upload (If Git sync fails)

1. **Download Project**
   - Click on "Project" in top menu
   - Select "Download as ZIP"
   - Extract the ZIP file

2. **Upload to GitHub**
   - Go to https://github.com/rachinha01/dtc8d
   - Click "Upload files" or use GitHub Desktop
   - Drag and drop the extracted files
   - Commit the changes

## 🔍 Verify Synchronization

After syncing, verify that your changes are reflected:

1. **Check GitHub Repository**
   - Visit: https://github.com/rachinha01/dtc8d
   - Look for your latest commit
   - Verify the `.env` file has been updated (if it's tracked)

2. **Check Deployment**
   - If you have auto-deployment set up, check your live site
   - Verify that the new Supabase connection is working

## ⚠️ Important Notes

### Environment Variables
- The `.env` file contains sensitive information
- Make sure it's in `.gitignore` if you don't want to expose credentials
- For production, set environment variables in your hosting platform

### Current Changes Made
- ✅ Updated `VITE_SUPABASE_URL`
- ✅ Updated `VITE_SUPABASE_ANON_KEY`
- ✅ Maintained all existing configuration

### Next Steps After Sync
1. **Database Migration**: Ensure your new Supabase project has the required tables
2. **Test Analytics**: Verify that analytics tracking works with new database
3. **Admin Dashboard**: Test admin login and dashboard functionality

## 🚨 Troubleshooting

### If Git sync fails:
1. Check if you're logged into GitHub in StackBlitz
2. Verify repository permissions
3. Try refreshing StackBlitz and attempting sync again

### If environment variables don't work:
1. Restart the development server: `npm run dev`
2. Clear browser cache
3. Check browser console for connection errors

## 📞 Support

If you encounter issues:
1. Check the StackBlitz console for error messages
2. Verify Supabase credentials are correct
3. Test database connection in Supabase dashboard

---

**✅ Ready to sync! Use Method 1 (StackBlitz Git Panel) for the easiest experience.**