/**
 * MortgageIQ - Main Application Controller
 * Handles theme, loading, and global UI interactions
 */

// ============================================
// Global State
// ============================================
let currentTheme = localStorage.getItem('theme') || 'light';

// ============================================
// Theme Management
// ============================================

/**
 * Initialize theme on page load
 */
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggleIcon();
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeToggleIcon();
}

/**
 * Update theme toggle button icon
 */
function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    if (currentTheme === 'dark') {
        sunIcon?.classList.add('hidden');
        moonIcon?.classList.remove('hidden');
    } else {
        sunIcon?.classList.remove('hidden');
        moonIcon?.classList.add('hidden');
    }
}

// ============================================
// Loading Screen
// ============================================

/**
 * Hide loading screen after page is fully loaded
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800);
    }
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

/**
 * Add smooth scroll behavior to all anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// FAQ Accordion
// ============================================

/**
 * Initialize FAQ accordion functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question?.addEventListener('click', () => {
            // Optional: Close other open items
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item && otherItem.hasAttribute('open')) {
            //         otherItem.removeAttribute('open');
            //     }
            // });
        });
    });
}

// ============================================
// Navbar Scroll Effect
// ============================================

let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

/**
 * Add shadow to navbar on scroll
 */
function handleNavbarScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (navbar) {
        if (scrollTop > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    }
    
    lastScrollTop = scrollTop;
}

// ============================================
// Intersection Observer for Animations
// ============================================

/**
 * Animate elements when they come into view
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and other elements
    const animatedElements = document.querySelectorAll('.feature-card, .tool-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// Window Resize Handler
// ============================================

let resizeTimer;

/**
 * Handle window resize events
 */
function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Adjust layout if calculator results are showing
        const calculatorLayout = document.querySelector('.calculator-layout');
        const resultsPanel = document.getElementById('resultsPanel');
        
        if (calculatorLayout && resultsPanel && !resultsPanel.classList.contains('hidden')) {
            if (window.innerWidth < 1024) {
                calculatorLayout.classList.remove('show-results');
            } else {
                calculatorLayout.classList.add('show-results');
            }
        }
    }, 250);
}

// ============================================
// Print Functionality
// ============================================

/**
 * Handle print functionality
 */
function handlePrint() {
    window.print();
}

// Add keyboard shortcut for printing (Ctrl+P / Cmd+P)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
    }
});

// ============================================
// Error Handling
// ============================================

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Optional: Send to error tracking service
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ============================================
// Analytics (Optional)
// ============================================

/**
 * Track page view
 */
function trackPageView() {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_path: window.location.pathname
        });
    }
    
    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
        plausible('pageview');
    }
}

/**
 * Track custom event
 */
function trackEvent(eventName, eventData = {}) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
        plausible(eventName, { props: eventData });
    }
    
    console.log('📊 Event tracked:', eventName, eventData);
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize all app functionality
 */
function initApp() {
    // Theme
    initTheme();
    
    // Loading screen
    hideLoadingScreen();
    
    // Smooth scroll
    initSmoothScroll();
    
    // FAQ
    initFAQ();
    
    // Scroll animations
    initScrollAnimations();
    
    // Track page view
    trackPageView();
    
    console.log('✅ MortgageIQ App Initialized');
}

// ============================================
// Event Listeners
// ============================================

// Theme toggle button
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Navbar scroll effect
window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// Window resize
window.addEventListener('resize', handleResize);

// ============================================
// DOM Ready
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ============================================
// Export functions for use in other scripts
// ============================================

window.MortgageIQApp = {
    toggleTheme,
    trackEvent,
    handlePrint
};
