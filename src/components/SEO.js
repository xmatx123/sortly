
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, type, schema }) => {
  const siteTitle = 'Sortly - Interactive Country Sorting Game';
  const metaDescription = description || "Challenge yourself with Sortly, the interactive sorting game. Sort countries by population or area and test your knowledge!";
  const metaKeywords = keywords || "sortly, sorting game, countries, population, area, game, interactive, geography";
  const metaImage = image || `${window.location.origin}/logo512.png`;
  const metaUrl = url || window.location.href;
  const metaType = type || 'website';

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title ? `${title} | Sortly` : siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={metaType} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
