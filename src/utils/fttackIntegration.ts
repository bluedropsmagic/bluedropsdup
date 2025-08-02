// FTTrack Integration Utilities
// Handles FTTrack script injection and management across all pages

export interface FTTrackConfig {
  scriptUrl: string;
  productId: string;
}

export const FTTRACK_CONFIG: FTTrackConfig = {
  scriptUrl: 'https://cdn.fttrack.com/scripts/fb-handler.js',
  productId: '23850309-b356-4fec-8b8b-7e4f1281a183'
};

/**
 * Check if FTTrack script is already loaded
 */
export const isFTTrackLoaded = (): boolean => {
  return document.querySelector('script[src*="fttrack.com"]') !== null;
};

/**
 * Remove existing FTTrack scripts to prevent conflicts
 */
export const removeFTTrackScripts = (): void => {
  const existingScripts = document.querySelectorAll('script[src*="fttrack.com"]');
  existingScripts.forEach(script => {
    try {
      script.remove();
      console.log('🧹 Removed existing FTTrack script');
    } catch (error) {
      console.error('Error removing FTTrack script:', error);
    }
  });
};

/**
 * Inject FTTrack script with proper configuration
 */
export const injectFTTrackScript = (pageType: string = 'main'): void => {
  try {
    // Remove any existing scripts first
    removeFTTrackScripts();
    
    // Create and configure the script
    const fttrackScript = document.createElement('script');
    fttrackScript.src = FTTRACK_CONFIG.scriptUrl;
    fttrackScript.setAttribute('data-product-id', FTTRACK_CONFIG.productId);
    fttrackScript.async = true;
    fttrackScript.defer = true;
    
    // Add error handling
    fttrackScript.onload = () => {
      console.log(`✅ FTTrack script loaded successfully for ${pageType} page`);
    };
    
    fttrackScript.onerror = (error) => {
      console.error(`❌ Failed to load FTTrack script for ${pageType} page:`, error);
    };
    
    // Inject into head
    document.head.appendChild(fttrackScript);
    console.log(`🎯 FTTrack script injected for ${pageType} page`);
    
  } catch (error) {
    console.error('Error injecting FTTrack script:', error);
  }
};

/**
 * Initialize FTTrack integration for a specific page
 */
export const initializeFTTrack = (pageType: string = 'main'): void => {
  // Inject the script
  injectFTTrackScript(pageType);
  
  console.log(`🚀 FTTrack integration initialized for ${pageType} page`);
};

/**
 * Cleanup FTTrack integration when leaving a page
 */
export const cleanupFTTrack = (pageType: string = 'main'): void => {
  removeFTTrackScripts();
  console.log(`🧹 FTTrack integration cleaned up for ${pageType} page`);
};

/**
 * Get FTTrack configuration for debugging
 */
export const getFTTrackConfig = (): FTTrackConfig => {
  return FTTRACK_CONFIG;
};

/**
 * Check FTTrack status for debugging
 */
export const getFTTrackStatus = (): {
  loaded: boolean;
  scriptCount: number;
  productId: string;
} => {
  const scripts = document.querySelectorAll('script[src*="fttrack.com"]');
  const productIdScript = document.querySelector(`script[data-product-id="${FTTRACK_CONFIG.productId}"]`);
  
  return {
    loaded: scripts.length > 0,
    scriptCount: scripts.length,
    productId: productIdScript?.getAttribute('data-product-id') || 'Not found'
  };
};