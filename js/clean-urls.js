(function() {
  'use strict';
  
  // Function to remove .html from URL
  function cleanCurrentUrl() {
    const path = window.location.pathname;
    if (path.endsWith('.html')) {
      const cleanPath = path.slice(0, -5); // Remove .html
      window.history.replaceState(null, null, cleanPath + window.location.search + window.location.hash);
    }
  }
  
  // Function to clean all links on page
  function cleanAllLinks() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip external links, anchors, and special protocols
      if (href.includes('://') || href.startsWith('#') || 
          href.startsWith('mailto:') || href.startsWith('tel:') ||
          href.startsWith('javascript:')) {
        return;
      }
      
      // Remove .html from internal links
      if (href.endsWith('.html')) {
        const newHref = href.slice(0, -5); // Remove .html
        link.setAttribute('href', newHref);
      }
    });
  }
  
  // Function to handle link clicks (optional)
  function handleLinkClicks(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Skip if it's an external link or anchor
    if (!href || href.includes('://') || href.startsWith('#') || 
        href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    
    // If it's a .html link, prevent default and navigate cleanly
    if (href.endsWith('.html')) {
      e.preventDefault();
      const cleanHref = href.slice(0, -5);
      window.location.href = cleanHref;
    }
  }
  
  // Run on page load
  document.addEventListener('DOMContentLoaded', function() {
    cleanCurrentUrl();
    cleanAllLinks();
    
    // Optional: Add click handler for links
    document.addEventListener('click', handleLinkClicks);
  });
  
  // Also run when page is shown (for back/forward navigation)
  window.addEventListener('pageshow', cleanCurrentUrl);
})();