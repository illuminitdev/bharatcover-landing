// SEO Configuration for Bharat Cover
export const seoConfig = {
  // Google Analytics 4 Measurement ID
  // Get this from: https://analytics.google.com/
  // Format: G-XXXXXXXXXX
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX',

  // Google Search Console Verification Code
  // Get this from: https://search.google.com/search-console
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'your-google-verification-code',

  // Website Base URL (update with your actual domain)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bharatcover.net',

  // Business Information
  businessInfo: {
    name: 'Bharat Cover',
    legalName: 'Bharat Cover Insurance Solutions Private Limited',
    description: 'Comprehensive Personal Accident and Employee Insurance Solutions for Businesses',
    email: 'info@bharatcover.net',
    phone: '+91 7680064255',
    address: {
      streetAddress: '1st Floor, Phase II, Ratnam chambers, H.No. 1-62/172, Plot No.172, Kavuri Hills',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500033',
      addressCountry: 'IN',
    },
    socialMedia: {
      facebook: 'https://facebook.com/bharatcover',
      twitter: 'https://twitter.com/bharatcover',
      linkedin: 'https://linkedin.com/company/bharatcover',
      instagram: 'https://instagram.com/bharatcover',
    },
  },

  // Structured Data for Organization
  getOrganizationSchema: function () {
    return {
      '@context': 'https://schema.org',
      '@type': 'InsuranceAgency',
      name: this.businessInfo.name,
      legalName: this.businessInfo.legalName,
      description: this.businessInfo.description,
      url: this.siteUrl,
      logo: `${this.siteUrl}/images/logo.png`,
      image: `${this.siteUrl}/images/og-image.jpg`,
      email: this.businessInfo.email,
      telephone: this.businessInfo.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.businessInfo.address.streetAddress,
        addressLocality: this.businessInfo.address.addressLocality,
        addressRegion: this.businessInfo.address.addressRegion,
        postalCode: this.businessInfo.address.postalCode,
        addressCountry: this.businessInfo.address.addressCountry,
      },
      sameAs: Object.values(this.businessInfo.socialMedia),
    };
  },

  // Structured Data for Website
  getWebsiteSchema: function () {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.businessInfo.name,
      url: this.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  },
};
