# Quick Start Guide - Publishing @tsichart/core

## 🎉 Good News!

Almost everything is done! The package is **97% ready** to publish.

## ✅ What's Already Complete

- ✅ Package name: `@tsichart/core`
- ✅ TSI rebranded as **"Time Series Interactive"**
- ✅ All documentation updated
- ✅ README.md with examples
- ✅ CHANGELOG.md created
- ✅ CONTRIBUTING.md created
- ✅ LICENSE with dual copyright
- ✅ .npmignore configured
- ✅ Build system ready
- ✅ All import examples use `@tsichart/core`

## ⚠️ What You Need to Do (3 Minutes)

### 1. Update Your Info in `package.json`

Open `package.json` and replace these 4 fields:

```json
{
  "author": "Your Name <your.email@example.com>",  // ← YOUR NAME & EMAIL
  "repository": {
    "url": "https://github.com/yourusername/tsichart-core"  // ← YOUR GITHUB USERNAME
  },
  "bugs": {
    "url": "https://github.com/yourusername/tsichart-core/issues"  // ← YOUR GITHUB USERNAME
  },
  "homepage": "https://github.com/yourusername/tsichart-core#readme"  // ← YOUR GITHUB USERNAME
}
```

### 2. Update LICENSE

Open `LICENSE` and replace:
```
Modified work Copyright (c) 2024 [Your Name/Organization]
```

With:
```
Modified work Copyright (c) 2024 Your Actual Name
```

### 3. Test the Build

```bash
npm install
npm run build
```

Verify that `dist/` folder is created with these files:
- `tsiclient.js`
- `tsiclient.d.ts`
- `tsiclient.css`
- Individual component files (LineChart.js, etc.)

### 4. Check Package Name Availability

```bash
npm view @tsichart/core
```

If you see **"npm ERR! 404 Not Found"** - Great! The name is available.

If the name is taken, choose an alternative:
- `@yourname/tsichart` (using your npm username)
- `chronos-charts` (good standalone name)

### 5. Create npm Account (if needed)

```bash
npm login
```

Or create account at: https://www.npmjs.com/signup

### 6. Publish!

```bash
npm publish --access public
```

That's it! 🚀

## After Publishing

Your package will be available at:
- **npm:** https://www.npmjs.com/package/@tsichart/core
- **unpkg CDN:** https://unpkg.com/@tsichart/core

Users can install with:
```bash
npm install @tsichart/core
```

And import with:
```js
import TsiClient from '@tsichart/core';
import '@tsichart/core/tsiclient.css';
```

## Next Steps (Optional)

1. **Create GitHub Release** - Tag v1.0.0 and create release notes
2. **Add Documentation Site** - Use GitHub Pages for live examples
3. **Set up CI/CD** - Automate testing and publishing
4. **Share on Social Media** - Twitter, Reddit, Dev.to
5. **Write a Blog Post** - Explain the rebrand and features

## Need Help?

- **CONVERSION_SUMMARY.md** - Complete overview
- **PUBLISHING.md** - Detailed publishing guide
- **CODE_CLEANUP.md** - Optional improvements
- **npm docs** - https://docs.npmjs.com/

## Summary

**What TSI means now:** Time Series Interactive (not Time Series Insights)

**What you're publishing:** A powerful, generic time series visualization library with 20+ interactive chart components.

**Time to publish:** About 5 minutes (mostly waiting for npm)

Good luck! 🎉
