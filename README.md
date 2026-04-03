# VS Insurance - Corporate Insurance Care Website

A modern, SEO-optimized Next.js website for corporate insurance solutions, featuring smooth animations and responsive design.

## Features

- ✨ **Modern Design**: Clean, professional UI with smooth animations
- 🎨 **Custom CSS**: Pure CSS styling without any CSS frameworks
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- 🚀 **SEO Optimized**: Comprehensive metadata and semantic HTML
- ⚡ **Fast Performance**: Optimized build with static page generation
- 🎯 **Multiple Pages**: Home, About, Products, Why Choose Us, Partners, Clients, Testimonials, Claims, Contact
- 📝 **Contact Form**: Interactive form with validation
- 🎭 **Smooth Animations**: CSS animations throughout the site

## Pages Included

1. **Home** - Hero section, products overview, why choose us, partners, clients, testimonials, claims process
2. **About Us** - Company vision, mission, and values
3. **Products** - Detailed information about all insurance products
   - Personal Accident Insurance
   - Group Health Insurance
   - Group Term Life Insurance
   - Workmen Compensation Insurance
   - OPD and Wellness Plans
   - Customized Corporate Solutions
4. **Why Choose Us** - 12 compelling reasons to choose VS Insurance
5. **Partners** - Insurance companies, TPAs, hospital networks, wellness partners
6. **Clients** - Client testimonials organized by industry
7. **Testimonials** - Detailed client testimonials
8. **Claims Assistance** - Complete claims process and support information
9. **Contact** - Contact form with company information

## Tech Stack

- **Framework**: Next.js 15.1.7
- **Language**: TypeScript
- **Styling**: CSS Modules (pure CSS)
- **React**: 19.0.0

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

Dependencies are already installed. If you need to reinstall:

\`\`\`bash
npm install
\`\`\`

### Running the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### Building for Production

\`\`\`bash
npm run build
\`\`\`

### Starting Production Server

\`\`\`bash
npm start
\`\`\`

## Project Structure

\`\`\`
vs-insurance/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Homepage
│   ├── page.module.css     # Homepage styles
│   ├── about/              # About Us page
│   ├── products/           # Products page
│   ├── why-choose-us/      # Why Choose Us page
│   ├── partners/           # Partners page
│   ├── clients/            # Clients page
│   ├── testimonials/       # Testimonials page
│   ├── claims/             # Claims Assistance page
│   └── contact/            # Contact page with form
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer with links
│   └── CTAButton.tsx       # Reusable CTA button
├── styles/
│   └── globals.css         # Global styles and animations
├── public/
│   └── images/             # Website images
└── package.json
\`\`\`

## Customization

### Colors

Edit the CSS variables in \`styles/globals.css\`:

\`\`\`css
:root {
  --primary-color: #0066cc;
  --secondary-color: #00a86b;
  --dark-color: #1a1a2e;
  --light-color: #f5f7fa;
  --text-dark: #2c3e50;
  --text-light: #6c757d;
}
\`\`\`

### Content

- Update company information in \`components/Footer.tsx`
- Modify contact details in \`app/contact/page.tsx`
- Customize hero text in \`app/page.tsx`

### Images

- Replace placeholder images in \`public/images/` with your own
- Update image references in the page components

## SEO Features

- Comprehensive metadata for all pages
- OpenGraph and Twitter Card support
- Semantic HTML structure
- Optimized images
- Fast page load times
- Mobile-friendly design

## Performance

Build output shows excellent performance:
- All pages are statically generated (Static)
- Optimized JavaScript bundle sizes
- First Load JS: ~105-110 KB per page

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for VS Insurance.

## Support

For questions or issues, contact the development team.

---

Built with ❤️ using Next.js and TypeScript
