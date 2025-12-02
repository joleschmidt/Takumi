// Content script to extract article data from the current page

(function() {
  'use strict';

  // Extract meta tag content
  function getMetaContent(name, attribute = 'name') {
    const meta = document.querySelector(`meta[${attribute}="${name}"]`);
    return meta ? meta.getAttribute('content') : null;
  }

  // Extract Open Graph tags
  function getOGTag(property) {
    return getMetaContent(property, 'property');
  }

  // Extract Schema.org JSON-LD data
  function getSchemaOrgData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const schemas = [];
    
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent);
        if (Array.isArray(data)) {
          schemas.push(...data);
        } else {
          schemas.push(data);
        }
      } catch (e) {
        console.warn('Failed to parse JSON-LD:', e);
      }
    }
    
    return schemas;
  }

  // Extract price from Schema.org data
  function extractPriceFromSchema(schemas) {
    for (const schema of schemas) {
      // Check for Product schema with offers
      if (schema['@type'] === 'Product' || schema['@type'] === 'http://schema.org/Product') {
        if (schema.offers) {
          const offers = Array.isArray(schema.offers) ? schema.offers : [schema.offers];
          for (const offer of offers) {
            if (offer.price !== undefined) {
              return {
                price: parseFloat(offer.price),
                currency: offer.priceCurrency || 'EUR'
              };
            }
          }
        }
        if (schema.price !== undefined) {
          return {
            price: parseFloat(schema.price),
            currency: schema.priceCurrency || 'EUR'
          };
        }
      }
      
      // Check for Offer schema
      if (schema['@type'] === 'Offer' || schema['@type'] === 'http://schema.org/Offer') {
        if (schema.price !== undefined) {
          return {
            price: parseFloat(schema.price),
            currency: schema.priceCurrency || 'EUR'
          };
        }
      }
    }
    return null;
  }

  // Extract price from meta tags
  function extractPriceFromMeta() {
    const priceAmount = getMetaContent('product:price:amount') || getOGTag('product:price:amount') || getOGTag('og:price:amount');
    const priceCurrency = getMetaContent('product:price:currency') || getOGTag('product:price:currency') || getOGTag('og:price:currency');
    
    if (priceAmount) {
      return {
        price: parseFloat(priceAmount),
        currency: priceCurrency || 'EUR'
      };
    }
    return null;
  }

  // Extract price from text using regex
  function extractPriceFromText() {
    const bodyText = document.body.innerText || '';
    
    // Patterns: €29.99, 29,99 EUR, EUR 29.99, $29.99, etc.
    const patterns = [
      /([€$£¥]|EUR|USD|GBP|JPY)\s*([\d.,]+)/i,
      /([\d.,]+)\s*([€$£¥]|EUR|USD|GBP|JPY)/i,
      /([\d.,]+)\s*(?:Euro|EUR|Dollar|USD|Pound|GBP|Yen|JPY)/i
    ];
    
    for (const pattern of patterns) {
      const match = bodyText.match(pattern);
      if (match) {
        const currencyMap = {
          '€': 'EUR', 'EUR': 'EUR', 'EURO': 'EUR',
          '$': 'USD', 'USD': 'USD', 'US$': 'USD',
          '£': 'GBP', 'GBP': 'GBP',
          '¥': 'JPY', 'JPY': 'JPY', 'JP¥': 'JPY'
        };
        
        let currency = 'EUR';
        let priceStr = '';
        
        if (match[1] && /[€$£¥]|EUR|USD|GBP|JPY/i.test(match[1])) {
          currency = currencyMap[match[1].toUpperCase()] || match[1].toUpperCase();
          priceStr = match[2];
        } else if (match[2] && /[€$£¥]|EUR|USD|GBP|JPY/i.test(match[2])) {
          priceStr = match[1];
          currency = currencyMap[match[2].toUpperCase()] || match[2].toUpperCase();
        } else {
          priceStr = match[1] || match[2];
        }
        
        const price = parseFloat(priceStr.replace(',', '.'));
        if (!isNaN(price) && price > 0) {
          return { price, currency };
        }
      }
    }
    
    return null;
  }

  // Extract main content
  function extractMainContent() {
    // Try article tag first
    const article = document.querySelector('article');
    if (article) {
      return article.innerText.trim();
    }
    
    // Try main tag
    const main = document.querySelector('main');
    if (main) {
      return main.innerText.trim();
    }
    
    // Try common content selectors
    const contentSelectors = [
      '.content',
      '.post-content',
      '.article-content',
      '.entry-content',
      '[role="main"]'
    ];
    
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.innerText.trim();
      }
    }
    
    // Fallback to body (remove script and style tags)
    const bodyClone = document.body.cloneNode(true);
    const scripts = bodyClone.querySelectorAll('script, style, nav, header, footer, aside');
    scripts.forEach(el => el.remove());
    return bodyClone.innerText.trim();
  }

  // Extract relevant product/article images only
  function extractImages() {
    const images = [];
    const seenUrls = new Set();
    
    // Minimum size for product images (filter out icons/logos)
    const MIN_SIZE = 100; // pixels
    
    // Selectors for product/image galleries (common patterns)
    const gallerySelectors = [
      '.product-images',
      '.product-gallery',
      '.product-images-container',
      '.gallery',
      '.image-gallery',
      '.product-photos',
      '.product-media',
      '[class*="gallery"]',
      '[class*="product-image"]',
      '[class*="product-photo"]',
      '[id*="gallery"]',
      '[id*="product-image"]',
      'article img',
      'main img',
      '.content img',
      '.post-content img',
      '.article-content img',
      '.entry-content img'
    ];
    
    // Areas to exclude (navigation, header, footer, etc.)
    const excludeSelectors = [
      'nav img',
      'header img',
      'footer img',
      '.navbar img',
      '.navigation img',
      '.menu img',
      '.logo img',
      '[class*="logo"] img',
      '[class*="icon"] img',
      '[class*="avatar"] img',
      '.social img',
      '.share img'
    ];
    
    // First, try to find images in product/gallery areas
    let foundInGallery = false;
    for (const selector of gallerySelectors) {
      try {
        const container = document.querySelector(selector);
        if (container) {
          const imgs = container.querySelectorAll('img[src]');
          for (const img of imgs) {
            const src = img.src;
            if (src && !src.startsWith('data:') && !seenUrls.has(src)) {
              // Check image size
              const width = img.naturalWidth || img.width || 0;
              const height = img.naturalHeight || img.height || 0;
              
              if (width >= MIN_SIZE || height >= MIN_SIZE) {
                try {
                  const absoluteUrl = new URL(src, window.location.href).href;
                  images.push(absoluteUrl);
                  seenUrls.add(src);
                  foundInGallery = true;
                } catch (e) {
                  // Skip invalid URLs
                }
              }
            }
          }
        }
      } catch (e) {
        // Skip invalid selectors
      }
    }
    
    // If no gallery found, look in main content area
    if (!foundInGallery) {
      const mainContent = document.querySelector('article, main, .content, .post-content, .article-content, .entry-content');
      if (mainContent) {
        const imgs = mainContent.querySelectorAll('img[src]');
        for (const img of imgs) {
          const src = img.src;
          if (src && !src.startsWith('data:') && !seenUrls.has(src)) {
            // Check if image is in excluded area
            let isExcluded = false;
            for (const excludeSelector of excludeSelectors) {
              if (img.closest(excludeSelector.replace(' img', ''))) {
                isExcluded = true;
                break;
              }
            }
            
            if (!isExcluded) {
              const width = img.naturalWidth || img.width || 0;
              const height = img.naturalHeight || img.height || 0;
              
              if (width >= MIN_SIZE || height >= MIN_SIZE) {
                try {
                  const absoluteUrl = new URL(src, window.location.href).href;
                  images.push(absoluteUrl);
                  seenUrls.add(src);
                } catch (e) {
                  // Skip invalid URLs
                }
              }
            }
          }
        }
      }
    }
    
    // Always include og:image if available
    const ogImage = getOGTag('og:image');
    if (ogImage && !seenUrls.has(ogImage)) {
      try {
        const absoluteUrl = new URL(ogImage, window.location.href).href;
        images.unshift(absoluteUrl); // Add to beginning
        seenUrls.add(ogImage);
      } catch (e) {
        // Skip invalid URLs
      }
    }
    
    // Limit to max 20 images to avoid too many
    return images.slice(0, 20);
  }

  // Main extraction function
  function extractArticleData() {
    const schemas = getSchemaOrgData();
    const priceFromSchema = extractPriceFromSchema(schemas);
    const priceFromMeta = extractPriceFromMeta();
    const priceFromText = extractPriceFromText();
    
    // Priority: Schema.org > Meta tags > Text extraction
    const priceData = priceFromSchema || priceFromMeta || priceFromText;
    
    // Extract title
    const title = 
      getOGTag('og:title') ||
      getMetaContent('title') ||
      document.querySelector('title')?.textContent ||
      document.querySelector('h1')?.textContent ||
      '';
    
    // Extract description
    const description = 
      getOGTag('og:description') ||
      getMetaContent('description') ||
      '';
    
    // Extract author
    const author = 
      getMetaContent('author') ||
      getOGTag('article:author') ||
      document.querySelector('[rel="author"]')?.textContent ||
      '';
    
    // Extract published date
    const publishedDate = 
      getMetaContent('article:published_time') ||
      getOGTag('article:published_time') ||
      getMetaContent('datePublished') ||
      '';
    
    // Extract category
    const category = 
      getMetaContent('article:section') ||
      getOGTag('article:section') ||
      '';
    
    // Extract main image
    const ogImage = getOGTag('og:image');
    
    // Extract main content
    const content = extractMainContent();
    
    // Extract all images
    const images = extractImages();
    
    // Build metadata object
    const metadata = {
      schemas: schemas,
      metaTags: {
        title: document.querySelector('title')?.textContent,
        description: getMetaContent('description'),
        keywords: getMetaContent('keywords'),
      },
      ogTags: {
        title: getOGTag('og:title'),
        description: getOGTag('og:description'),
        type: getOGTag('og:type'),
        site_name: getOGTag('og:site_name'),
      }
    };
    
    return {
      title: title.trim(),
      content: content,
      excerpt: description.trim() || content.substring(0, 300).trim(),
      author: author.trim() || undefined,
      published_date: publishedDate || undefined,
      source_url: window.location.href,
      og_image_url: ogImage || undefined,
      category: category || undefined,
      price: priceData?.price || undefined,
      price_currency: priceData?.currency || 'EUR',
      images: images,
      metadata: metadata
    };
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractArticle') {
      try {
        const articleData = extractArticleData();
        sendResponse({ success: true, data: articleData });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
      return true; // Keep message channel open for async response
    }
  });

  // Make extraction function available globally for debugging
  window.extractArticleData = extractArticleData;
})();

