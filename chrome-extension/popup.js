// Popup script for article importer

let articleData = null;
let apiUrl = 'http://localhost:3000/api/articles/import'; // Default

// Load API URL from storage
async function loadApiUrl() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiUrl'], (result) => {
      if (result.apiUrl) {
        apiUrl = result.apiUrl;
      }
      resolve(apiUrl);
    });
  });
}

// Get current tab
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Extract article data from current page
async function extractArticleData() {
  try {
    const tab = await getCurrentTab();
    
    // Send message to content script to extract article data
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractArticle' });
    
    if (!response) {
      throw new Error('Keine Antwort vom Content Script. Bitte Seite neu laden und erneut versuchen.');
    }
    
    return response;
  } catch (error) {
    console.error('Error extracting article:', error);
    // If content script hasn't loaded, try to inject it
    if (error.message.includes('Could not establish connection')) {
      const tab = await getCurrentTab();
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        // Wait a bit for script to load
        await new Promise(resolve => setTimeout(resolve, 500));
        // Try again
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractArticle' });
        return response;
      } catch (retryError) {
        throw new Error('Fehler beim Laden des Content Scripts. Bitte Seite neu laden.');
      }
    }
    throw error;
  }
}

// Load categories from API
async function loadCategories() {
  try {
    const currentApiUrl = await loadApiUrl();
    const baseUrl = currentApiUrl.replace('/api/articles/import', '');
    const response = await fetch(`${baseUrl}/api/articles/categories`);
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

// Populate category dropdown
async function populateCategories() {
  const categories = await loadCategories();
  const select = document.getElementById('category-select');
  const categoryInput = document.getElementById('category');
  
  // Clear existing options except the first one
  while (select.options.length > 1) {
    select.remove(1);
  }
  
  // Add categories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
  
  // Handle category selection change
  select.addEventListener('change', () => {
    if (select.value === '') {
      // Show input for new category
      categoryInput.classList.remove('hidden');
      categoryInput.value = '';
      categoryInput.focus();
    } else {
      // Hide input and use selected category
      categoryInput.classList.add('hidden');
      categoryInput.value = select.value;
    }
  });
  
  // Handle manual input
  categoryInput.addEventListener('input', () => {
    if (categoryInput.value.trim() !== '') {
      select.value = '';
    }
  });
}

// Populate form with extracted data
async function populateForm(data) {
  document.getElementById('title').value = data.title || '';
  document.getElementById('excerpt').value = data.excerpt || '';
  document.getElementById('author').value = data.author || '';
  document.getElementById('price').value = data.price || '';
  document.getElementById('price_currency').value = data.price_currency || 'EUR';
  document.getElementById('source_url').value = data.source_url || '';
  
  // Load and populate categories
  await populateCategories();
  
  // Set category if it exists in data
  const categorySelect = document.getElementById('category-select');
  const categoryInput = document.getElementById('category');
  if (data.category) {
    // Check if category exists in dropdown
    const option = Array.from(categorySelect.options).find(opt => opt.value === data.category);
    if (option) {
      categorySelect.value = data.category;
      categoryInput.classList.add('hidden');
      categoryInput.value = data.category;
    } else {
      // Category doesn't exist, show input
      categorySelect.value = '';
      categoryInput.classList.remove('hidden');
      categoryInput.value = data.category;
    }
  }

  // Display images
  const imagesPreview = document.getElementById('images-preview');
  const imageCount = document.getElementById('image-count');
  const images = data.images || [];
  
  imageCount.textContent = images.length;
  imagesPreview.innerHTML = '';
  
  if (images.length > 0) {
    images.slice(0, 5).forEach((imgUrl, index) => {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'image-item';
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = `Image ${index + 1}`;
      img.onerror = () => {
        imgContainer.style.display = 'none';
      };
      imgContainer.appendChild(img);
      imagesPreview.appendChild(imgContainer);
    });
    if (images.length > 5) {
      const moreText = document.createElement('p');
      moreText.className = 'more-images';
      moreText.textContent = `+${images.length - 5} weitere Bilder`;
      imagesPreview.appendChild(moreText);
    }
  }
}

// Show loading state
function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('error').classList.add('hidden');
  document.getElementById('article-form').classList.add('hidden');
  document.getElementById('success').classList.add('hidden');
}

// Show error
function showError(message) {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('error').classList.remove('hidden');
  document.getElementById('error-message').textContent = message;
  document.getElementById('article-form').classList.add('hidden');
  document.getElementById('success').classList.add('hidden');
}

// Show form
function showForm() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('error').classList.add('hidden');
  document.getElementById('article-form').classList.remove('hidden');
  document.getElementById('success').classList.add('hidden');
}

// Show success
function showSuccess() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('error').classList.add('hidden');
  document.getElementById('article-form').classList.add('hidden');
  document.getElementById('success').classList.remove('hidden');
}

// Submit form
async function submitForm(formData) {
  try {
    showLoading();
    
    // Get import type
    const importType = document.getElementById('import-type').value;
    const currentApiUrl = await loadApiUrl();
    
    // Determine API endpoint based on type
    let apiUrl;
    let payload;
    
    if (importType === 'product') {
      // Use products import endpoint
      apiUrl = currentApiUrl.replace('/api/articles/import', '/api/products/import');
      
      // Transform data for products
      const price = formData.price ? parseFloat(formData.price) : undefined;
      const priceRange = price ? `${price.toFixed(2)}€` : '';
      
      // Use first 5 extracted images
      const images = articleData.images && articleData.images.length > 0
        ? articleData.images.slice(0, 5) // Limit to first 5 images
        : articleData.og_image_url
          ? [articleData.og_image_url]
          : []

      payload = {
        title: formData.title,
        description: articleData.content || formData.excerpt || formData.title,
        category: formData.category,
        slug: generateSlug(formData.title),
        price_range: priceRange,
        is_new: false,
        features: [],
        history: '',
        usage: '',
        care: '',
        image_url: articleData.og_image_url || (images.length > 0 ? images[0] : undefined),
        images: images,
        vendors: [], // Vendors can be added manually later
        original_name: formData.author || undefined,
      };
    } else {
      // Use articles import endpoint
      apiUrl = currentApiUrl;
      payload = formData;
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Import fehlgeschlagen');
    }

    const typeLabel = importType === 'product' ? 'Produkt' : 'Artikel';
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
      successMessage.textContent = `${typeLabel} erfolgreich importiert!`;
    }
    showSuccess();
  } catch (error) {
    showError(error.message || 'Fehler beim Importieren');
  }
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Initialize popup
async function init() {
  showLoading();

  try {
    // Extract article data
    const response = await extractArticleData();
    
    if (!response.success) {
      throw new Error(response.error || 'Fehler beim Extrahieren der Artikel-Daten');
    }

    articleData = response.data;
    await populateForm(articleData);
    showForm();
  } catch (error) {
    console.error('Error:', error);
    showError(error.message || 'Fehler beim Laden der Seite. Bitte versuchen Sie es auf einer Artikel-Seite.');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', init);

document.getElementById('article-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get category from either select or input
  const categorySelect = document.getElementById('category-select');
  const categoryInput = document.getElementById('category');
  const category = categorySelect.value || categoryInput.value.trim() || undefined;
  
  const importType = document.getElementById('import-type').value;
  
  // For products, category is required
  if (importType === 'product' && !category) {
    alert('Bitte wählen Sie eine Kategorie für das Produkt.');
    return;
  }
  
  const formData = {
    title: document.getElementById('title').value,
    content: articleData.content, // Use extracted content
    excerpt: document.getElementById('excerpt').value,
    author: document.getElementById('author').value,
    category: category,
    price: document.getElementById('price').value ? parseFloat(document.getElementById('price').value) : undefined,
    price_currency: document.getElementById('price_currency').value,
    source_url: document.getElementById('source_url').value,
    og_image_url: articleData.og_image_url,
    published_date: articleData.published_date,
    images: articleData.images,
    metadata: articleData.metadata,
  };

  submitForm(formData);
});

document.getElementById('cancel-btn').addEventListener('click', () => {
  window.close();
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.close();
});

