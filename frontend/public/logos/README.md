# Logo Management

This directory contains SVG logos for partners and clients displayed on the VS Insurance website.

## Directory Structure

```
logos/
├── partners/     # Insurance company partner logos
└── clients/      # Client company logos
```

## Current Status

### Partners (12 logos created)
- ✅ ICICI Lombard
- ✅ Bajaj Allianz
- ✅ HDFC ERGO
- ✅ Tata AIG
- ✅ Future Generali
- ✅ Digit Insurance
- ✅ Star Health
- ✅ Max Life
- ✅ ICICI Prudential
- ✅ Kotak General
- ✅ Royal Sundaram
- ✅ Care Health

### Clients (12 logos created)
- ✅ HELM
- ✅ 420 SCIENCE
- ✅ TEXAS HUMOR
- ✅ BARTON
- ✅ STONE FOREST
- ✅ NOBULL
- ✅ SUNROOM
- ✅ MAHI GOLD
- ✅ donmiPy
- ✅ Industrial Partners
- ✅ Tech Solutions
- ✅ Consulting Firm

## How to Add New Logos

### 1. Obtain the Logo
- Get the official logo from the partner/client
- Preferred format: SVG (vector)
- Alternative: High-resolution PNG (will need to be converted to SVG)

### 2. Convert to SVG (if needed)
If you have a PNG/JPG logo:
- Use online tools like https://convertio.co/png-svg/
- Or use Adobe Illustrator / Inkscape to trace and export as SVG

### 3. Optimize the SVG
- Remove unnecessary metadata
- Ensure the viewBox is properly set
- Keep the dimensions around 120x60 for partners, 100x50 for clients

### 4. Save the File
- File naming convention: `company-name.svg` (lowercase, hyphen-separated)
- Example: `icici-lombard.svg`, `max-life.svg`
- Save in the appropriate directory:
  - `/public/logos/partners/` for insurance partners
  - `/public/logos/clients/` for clients

### 5. Update the Code

#### For Homepage (app/page.tsx)
Add the logo to the partners or clients array:
```typescript
{ name: 'Company Name', slug: 'company-name', hasLogo: true }
```

#### For Partners Page (app/partners/page.tsx)
Update the appropriate category array and set `hasLogo: true`

#### For Clients Page (app/clients/page.tsx)
Update the appropriate industry array and set `hasLogo: true`

## Example SVG Structure

```svg
<svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Logo content here -->
</svg>
```

## Tips

1. **Background**: Ensure logos have transparent backgrounds
2. **Colors**: Use the company's official brand colors
3. **Size**: Keep file sizes small (under 50KB) for faster loading
4. **Quality**: Use vector graphics when possible for scalability
5. **Consistency**: Maintain similar visual weight across all logos

## Need Help?

If you need assistance adding or optimizing logos, consult with your development team or use online SVG optimization tools like SVGOMG (https://jakearchibald.github.io/svgomg/).
