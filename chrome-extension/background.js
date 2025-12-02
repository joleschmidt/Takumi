// Background service worker for Chrome extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default API URL
    chrome.storage.sync.set({
      apiUrl: 'http://localhost:3000/api/articles/import'
    });
    
    console.log('Takumi Article Importer installed');
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getApiUrl') {
    chrome.storage.sync.get(['apiUrl'], (result) => {
      sendResponse({ apiUrl: result.apiUrl || 'http://localhost:3000/api/articles/import' });
    });
    return true; // Keep message channel open
  }
  
  if (request.action === 'setApiUrl') {
    chrome.storage.sync.set({ apiUrl: request.apiUrl }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

