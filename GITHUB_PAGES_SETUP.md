# GitHub Pages Deployment Guide

## Quick Start (5 Minutes)

### Option 1: Using GitHub Web UI (Easiest)

#### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Enter Repository name: `medicine_app`
3. Choose "Public" (required for free GitHub Pages)
4. ✅ Check "Add a README file" (optional)
5. Click **"Create repository"**

#### Step 2: Upload Files

1. Click **"Add file"** → **"Upload files"**
2. Drag and drop all files:
   ```
   ├── index.html
   ├── assets/
   │   ├── app.js
   │   ├── style.css
   │   └── Logo.png
   ├── data/
   │   └── medicines.json
   ├── README.md
   └── ARCHITECTURE.md
   ```
3. Click **"Commit changes"**

#### Step 3: Enable GitHub Pages

1. Go to Repository **Settings**
2. Click **"Pages"** (left sidebar)
3. Under **"Build and deployment"**:
   - **Source:** Select `Deploy from a branch`
   - **Branch:** Select `main` and `/ (root)`
   - Click **"Save"**
4. Wait 1-2 minutes for deployment
5. Site URL will appear: `https://yourusername.github.io/medicine_app`

#### Step 4: Access Your Site

Visit: **`https://yourusername.github.io/medicine_app`**

✅ **Done!** Your medicine app is now live on GitHub Pages.

---

### Option 2: Using Git Command Line (For Developers)

#### Step 1: Initialize Git Repository

```bash
# Navigate to project folder
cd medicine_app

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MediCare v1.0"
```

#### Step 2: Create GitHub Repository (via Web)

1. Go to [github.com/new](https://github.com/new)
2. Name: `medicine_app`
3. Click **"Create repository"** (don't initialize with README)
4. Copy repository URL (looks like: `https://github.com/yourusername/medicine_app.git`)

#### Step 3: Connect Local to Remote

```bash
# Add remote origin
git remote add origin https://github.com/yourusername/medicine_app.git

# Rename branch if needed (if not main)
git branch -M main

# Push to GitHub
git push -u origin main
```

#### Step 4: Enable GitHub Pages

```bash
# Pages are automatically enabled for public repos
# Check status: Go to Settings > Pages
```

#### Step 5: Verify Deployment

Visit: `https://yourusername.github.io/medicine_app`

---

## Detailed Step-by-Step Guide

### For Windows Users

#### Prerequisites
- Git installed ([git-scm.com](https://git-scm.com))
- GitHub account ([github.com](https://github.com))

#### Step 1: Create GitHub Repo

1. Log in to GitHub
2. Click **"+"** icon (top right)
3. Select **"New repository"**
4. Fill form:
   ```
   Repository name: medicine_app
   Description: Online Medicine Store App
   Visibility: Public
   ```
5. Click **"Create repository"**

#### Step 2: Open PowerShell in Project Folder

```powershell
# Navigate to medicine_app folder
cd "C:\Users\YourName\OneDrive\Desktop\medicine_app"

# Check git status
git status
```

#### Step 3: Initialize & Commit

```powershell
# Initialize repo
git init

# Configure git (one time)
git config user.name "Your Name"
git config user.email "your@email.com"

# Stage all files
git add .

# Create commit
git commit -m "Initial commit: MediCare medicine app v1.0

- Shopping cart with medicines
- Guest checkout
- Order tracking
- Responsive design
- GitHub Pages ready"
```

#### Step 4: Push to GitHub

```powershell
# Add remote (replace with YOUR username)
git remote add origin https://github.com/YourUsername/medicine_app.git

# Rename to main (if current branch is master)
git branch -M main

# Push to GitHub
git push -u origin main

# Enter GitHub username and password (or PAT if 2FA enabled)
```

#### Step 5: Enable Pages in Settings

```powershell
# On web:
# 1. Go to https://github.com/YourUsername/medicine_app
# 2. Click Settings (gear icon)
# 3. Click Pages (left menu)
# 4. Source: Deploy from a branch
# 5. Branch: main / (root)
# 6. Save
```

#### Step 6: Verify Live Site

```
Your site will be live at:
https://yourusername.github.io/medicine_app

Check back in 1-2 minutes if not immediately available
```

---

### For Mac/Linux Users

Same steps as Windows, but use Terminal instead of PowerShell:

```bash
# Open Terminal and navigate to project
cd ~/Desktop/medicine_app

# Initialize git
git init
git config user.name "Your Name"
git config user.email "your@email.com"

# Add and commit
git add .
git commit -m "Initial commit: MediCare medicine app"

# Push to GitHub (replace with your username)
git remote add origin https://github.com/YourUsername/medicine_app.git
git branch -M main
git push -u origin main
```

Then enable Pages via GitHub web UI (same as above).

---

## Troubleshooting

### Issue: 404 Error on GitHub Pages

**Problem:** Site returns 404, files not found

**Solutions:**

1. **Check if Pages is enabled:**
   - Settings → Pages
   - Verify "Deploy from branch" is selected
   - Verify `main` branch and `/ (root)` folder are selected

2. **Check if files are pushed:**
   ```bash
   git log
   git remote -v
   git branch -a
   ```

3. **Clear browser cache:**
   ```
   Ctrl+Shift+Delete or Cmd+Shift+Delete
   ```

4. **Check index.html exists:**
   - GitHub Pages requires `index.html` in root
   - File must be named exactly `index.html` (case-sensitive)

### Issue: CSS/JS Not Loading

**Problem:** Page loads but styling is broken, scripts not running

**Cause:** Asset paths are incorrect

**Solution:** Check file paths in index.html:
```html
<!-- ✅ Correct (relative paths) -->
<link rel="stylesheet" href="assets/style.css">
<script src="assets/app.js"></script>
<img src="assets/Logo.png" alt="Logo">

<!-- ❌ Wrong (absolute paths) -->
<link rel="stylesheet" href="/assets/style.css">
<script src="/assets/app.js"></script>
```

### Issue: Images Not Showing

**Problem:** Logo.png not displaying

**Solutions:**

1. **Check file exists:**
   ```bash
   ls assets/Logo.png
   # Should show file size, not "not found"
   ```

2. **Check GitHub repo includes the file:**
   - Go to GitHub repo
   - Click "assets" folder
   - Verify Logo.png is there

3. **If missing, add it:**
   ```bash
   git add assets/Logo.png
   git commit -m "Add Logo.png"
   git push
   ```

### Issue: Data Not Persisting Between Refreshes

**Problem:** Cart empties when page is refreshed

**Cause:** localStorage is working correctly, but browser cache is interfering

**Solutions:**

1. **Hard refresh:**
   ```
   Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   ```

2. **Check browser settings:**
   - Settings → Privacy & Security
   - Ensure "Cookies and site data" is allowed for github.io

3. **Check localStorage quota:**
   ```javascript
   // Open browser DevTools (F12)
   // Go to Application → Local Storage
   // Check available storage
   ```

---

## Customization After Deployment

### Change Site Title

Edit `index.html`:
```html
<title>My Medicine Store – Online Pharmacy</title>
```

### Change Logo

1. Replace `assets/Logo.png` with your image
2. Push changes:
   ```bash
   git add assets/Logo.png
   git commit -m "Update logo"
   git push
   ```

### Change Colors

Edit `assets/style.css`:
```css
:root {
  --color-primary: #0F766E;  /* Change this */
  --color-success: #10B981;  /* Or this */
  /* ... etc ... */
}
```

### Add/Remove Medicines

Edit `data/medicines.json`:
```json
[
  {
    "id": 1,
    "name": "Your Medicine",
    "dosage": "500mg",
    // ... etc
  }
]
```

Then push:
```bash
git add data/medicines.json
git commit -m "Update medicines catalog"
git push
```

---

## Advanced: Custom Domain

### Add Custom Domain (Optional)

1. **Buy domain** from Namecheap, GoDaddy, or Google Domains

2. **Configure DNS:**
   - Add DNS records pointing to GitHub Pages:
     ```
     Type: A
     Name: @
     Value: 185.199.108.153
            185.199.109.153
            185.199.110.153
            185.199.111.153
     
     Type: CNAME
     Name: www
     Value: yourusername.github.io
     ```

3. **Configure GitHub:**
   - Settings → Pages → Custom domain
   - Enter: `yourdomain.com`
   - Check "Enforce HTTPS"

4. **Wait 24 hours** for DNS propagation

5. **Access via custom domain:** `https://yourdomain.com/medicine_app`

---

## Performance Optimization

### GitHub Pages Performance

GitHub Pages uses **Cloudflare CDN**, so:
- ✅ Files are served from nearest geographical location
- ✅ Automatic HTTPS via Cloudflare
- ✅ No cost for bandwidth
- ✅ ~200ms latency from USA, 500ms from Asia

### Optimize Your App

1. **Minify JavaScript/CSS** (optional):
   ```bash
   # Use minifier tool
   # google-closure-compiler
   # csso-cli
   ```

2. **Compress Logo.png:**
   ```bash
   # Use TinyPNG or ImageOptim
   # Reduces from 500KB to 50KB
   ```

3. **Lazy load medicines.json:**
   ```javascript
   // Only load when needed, not on page load
   ```

---

## Version Control & Updates

### Making Updates

1. **Make changes locally:**
   ```bash
   # Edit files
   vim index.html
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix: Update cart calculation"
   ```

3. **Push to GitHub:**
   ```bash
   git push
   ```

4. **Site auto-updates** in ~1 minute

### Rolling Back Changes

If you made a mistake:
```bash
# See previous versions
git log

# Revert to previous version
git revert <commit-hash>
git push
```

---

## Continuous Deployment

GitHub Pages automatically redeploys when you push to main branch:

```
Make changes locally
    ↓
git push
    ↓
GitHub receives push
    ↓
GitHub Pages rebuilds
    ↓
Site updates (1-2 minutes)
    ↓
Changes live at yoursit.github.io
```

**No manual build/deploy needed!**

---

## Hosting Python Files (Flask/Streamlit)

**Note:** GitHub Pages only hosts **static files** (HTML, CSS, JS, JSON, images).

To host Python files (dashboard.py, app.py), use:

### Option 1: Render (Recommended)

1. Sign up at [render.com](https://render.com)
2. Create "New Web Service"
3. Connect GitHub repo
4. Configure:
   ```
   Build Command: pip install -r requirements.txt
   Start Command: streamlit run dashboard/dashboard.py --server.port=8080
   ```
5. Deploy
6. Live at: `https://yourapp.onrender.com`

**Cost:** Free tier available (auto-sleeps after inactivity)

### Option 2: Railway

1. Sign up at [railway.app](https://railway.app)
2. Import from GitHub
3. Detect `requirements.txt` automatically
4. Deploy

### Option 3: Heroku (Legacy)

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create yourappname

# Deploy
git push heroku main
```

**Note:** Heroku free tier discontinued (Feb 2023)

---

## Summary

| Step | Time | Tool |
|------|------|------|
| Create GitHub repo | 2 min | Web UI |
| Upload files | 2 min | Web UI |
| Enable Pages | 1 min | GitHub Settings |
| Site deployment | 2 min | GitHub |
| **Total** | **~7 minutes** | **GitHub** |

**Result:** Your medicine app is live at `https://yourusername.github.io/medicine_app` 🎉

---

## Resources

- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **GitHub CLI Guide:** https://cli.github.com/
- **Markdown Guide:** https://www.markdownguide.org/
- **Custom Domains:** https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

---

**Questions?** Check the [README.md](README.md) or [ARCHITECTURE.md](ARCHITECTURE.md) for more details.

