/**
 * Medical Dashboard - Professional Script (FIXED VERSION)
 * 
 * This script handles theme preferences, UI interactions,
 * news fetching, and animations for the medical chatbot dashboard.
 */

// IIFE to avoid polluting global namespace
(function() {
    // Configuration
    const CONFIG = {
        // NewsAPI now requires server-side requests for production
        // Using a fallback approach for direct browser usage
        NEWS_ENDPOINT: 'https://newsapi.org/v2/everything',
        NEWS_QUERY: 'medical OR health OR medicine OR disease',
        NEWS_API_KEY: '0ae3c956888747138f6993312f736fc6', // Consider moving this to environment variables
        NEWS_COUNT: 20,
        // Fallback data in case API fails or reaches limits
        USE_FALLBACK_DATA: true,
        ANIMATION_DURATION: 600,
        ANIMATION_STAGGER: 100
    };

    // DOM elements cache
    let elements = {};

    /**
     * Initialize the application
     */
    function init() {
        cacheElements();
        registerEventListeners();
        initializeNewsSection();
    }

    /**
     * Cache DOM elements for better performance
     */
    function cacheElements() {
        elements = {
            body: document.body,
            mobileMenu: document.querySelector('.mobile-menu'),
            hamburgerButton: document.querySelector('.hamburger-menu'),
            newsContainer: document.getElementById('news-container')
        };
    }

    /**
     * Register all event listeners
     */
    function registerEventListeners() {
        // Mobile menu toggle
        if (elements.hamburgerButton) {
            elements.hamburgerButton.addEventListener('click', toggleMobileMenu);
        }

        // Add scroll listener for parallax effects
        window.addEventListener('scroll', handleScroll);

        // Add resize listener to handle responsive changes
        window.addEventListener('resize', debounce(handleResize, 250));
    }

    /**
     * Toggle mobile menu visibility with animation
     */
    function toggleMobileMenu() {
        const isVisible = getComputedStyle(elements.mobileMenu).display !== 'none';
        
        if (isVisible) {
            // Add closing animation
            elements.mobileMenu.classList.add('menu-closing');
            setTimeout(() => {
                elements.mobileMenu.style.display = 'none';
                elements.mobileMenu.classList.remove('menu-closing');
            }, 300);
        } else {
            elements.mobileMenu.style.display = 'block';
            // Trigger animation by forcing reflow and adding class
            void elements.mobileMenu.offsetWidth;
            elements.mobileMenu.classList.add('menu-opening');
            setTimeout(() => {
                elements.mobileMenu.classList.remove('menu-opening');
            }, 300);
        }
    }

    /**
     * Initialize and load the news section
     */
    function initializeNewsSection() {
        showNewsLoader();
        
        if (CONFIG.USE_FALLBACK_DATA) {
            // Try API first, fall back to mock data if it fails
            fetchNews()
                .then(articles => {
                    if (articles && articles.length > 0) {
                        displayNews(articles);
                    } else {
                        console.log('API returned no articles, using fallback data');
                        displayNews(getFallbackNewsData());
                    }
                })
                .catch(error => {
                    console.error('News API error, using fallback data:', error);
                    displayNews(getFallbackNewsData());
                });
        } else {
            // Only use the API
            fetchNews()
                .then(articles => displayNews(articles))
                .catch(error => handleNewsError(error));
        }
    }

    /**
     * Show loader in the news container
     */
    function showNewsLoader() {
        elements.newsContainer.innerHTML = `
            <div class="loader" id="news-loader">
                <div class="intern"></div>
                <div class="external-shadow">
                    <div class="central"></div>
                </div>
            </div>
        `;
    }

    /**
     * Fetch news articles from the API
     * @returns {Promise<Array>} Promise resolving to array of news articles
     */
    async function fetchNews() {
        try {
            const params = new URLSearchParams({
                q: CONFIG.NEWS_QUERY,
                sortBy: 'publishedAt',
                language: 'en',
                pageSize: CONFIG.NEWS_COUNT,
                apiKey: CONFIG.NEWS_API_KEY
            });

            // Add a timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
            
            const response = await fetch(`${CONFIG.NEWS_ENDPOINT}?${params}`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API error (${response.status}): ${errorText}`);
                throw new Error(`API returned ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'error') {
                throw new Error(`API error: ${data.message || 'Unknown error'}`);
            }
            
            return data.articles || [];
        } catch (error) {
            console.error('News API error:', error);
            // If error is due to CORS, provide more helpful message
            if (error.message.includes('CORS') || error.message.includes('NetworkError')) {
                console.error('This may be a CORS issue. NewsAPI free tier only allows server-side requests.');
            }
            throw error;
        }
    }

    /**
     * Get fallback news data when API fails
     * @returns {Array} Array of mock news articles
     */
    function getFallbackNewsData() {
        const today = new Date();
        
        return [
            {
                title: "New Research Shows Promise in Treating Chronic Conditions",
                description: "A groundbreaking study reveals potential new approaches to managing chronic illnesses through targeted therapies.",
                urlToImage: "/api/placeholder/400/250",
                url: "#article-1",
                source: { name: "Medical Journal Weekly" },
                publishedAt: new Date(today.setDate(today.getDate() - 1)).toISOString()
            },
            {
                title: "Advancements in Medical Imaging Technology",
                description: "Revolutionary imaging techniques allow doctors to detect diseases earlier and with greater accuracy than ever before.",
                urlToImage: "/api/placeholder/400/250",
                url: "#article-2",
                source: { name: "Health Tech Today" },
                publishedAt: new Date(today.setDate(today.getDate() - 2)).toISOString()
            },
            {
                title: "Understanding the Benefits of Preventive Healthcare",
                description: "Experts emphasize the importance of regular check-ups and preventive measures in maintaining long-term health.",
                urlToImage: "/api/placeholder/400/250",
                url: "#article-3",
                source: { name: "Prevention Health Magazine" },
                publishedAt: new Date(today.setDate(today.getDate() - 3)).toISOString()
            },
            {
                title: "Diet and Nutrition: Latest Guidelines for Optimal Health",
                description: "New dietary recommendations focus on personalized nutrition plans based on individual health profiles.",
                urlToImage: "/api/placeholder/400/250",
                url: "#article-4",
                source: { name: "Nutrition Science Review" },
                publishedAt: new Date(today.setDate(today.getDate() - 4)).toISOString()
            },
            {
                title: "Mental Health Awareness: Breaking the Stigma",
                description: "Healthcare providers are implementing new approaches to mental health treatment with promising results.",
                urlToImage: "/api/placeholder/400/250",
                url: "#article-5",
                source: { name: "Psychology Today" },
                publishedAt: new Date(today.setDate(today.getDate() - 5)).toISOString()
            },
            {
                title: "Telehealth Services Expand Access to Medical Care",
                description: "Virtual healthcare options continue to evolve, providing essential services to underserved communities.",
                urlToImage: "/api/placeholder/400/250",
                url: "#article-6",
                source: { name: "Digital Health Network" },
                publishedAt: new Date(today.setDate(today.getDate() - 6)).toISOString()
            }
        ];
    }

    /**
     * Display news articles with staggered animation
     * @param {Array} articles - Array of news article objects
     */
    function displayNews(articles) {
        elements.newsContainer.innerHTML = '';

        if (!articles || articles.length === 0) {
            elements.newsContainer.innerHTML = '<p class="no-news">No medical news found.</p>';
            return;
        }

        // Create news grid container
        const newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid';
        elements.newsContainer.appendChild(newsGrid);

        // Add articles with staggered animation
        articles.forEach((article, index) => {
            // Skip articles with missing critical data
            if (!article.title) return;
            
            const newsBlock = createNewsBlock(article);
            newsGrid.appendChild(newsBlock);
            
            // Stagger animations
            setTimeout(() => {
                newsBlock.classList.add('visible');
            }, index * CONFIG.ANIMATION_STAGGER);
        });

        // Set up scroll-based animations
        initializeScrollAnimations();
    }

    /**
     * Create a news block element
     * @param {Object} article - News article data
     * @returns {HTMLElement} News block element
     */
    function createNewsBlock(article) {
        const newsBlock = document.createElement('div');
        newsBlock.className = 'news-block';
        
        const imageUrl = article.urlToImage || '/api/placeholder/400/250';
        const description = article.description || 'No description available';
        const source = article.source?.name || 'Unknown Source';
        const url = article.url || '#';
        
        newsBlock.innerHTML = `
            <div class="news-image">
                <img src="${imageUrl}" alt="${article.title}" loading="lazy" onerror="this.src='/api/placeholder/400/250'">
            </div>
            <div class="news-content">
                <h3 class="news-title"><a href="${url}" target="_blank" rel="noopener">${article.title}</a></h3>
                <p class="news-description">${description}</p>
                <div class="news-meta">
                    <span class="news-source">${source}</span>
                    <span class="news-date">${formatDate(article.publishedAt)}</span>
                </div>
            </div>
        `;
        
        return newsBlock;
    }

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    function formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    /**
     * Handle errors in news fetching
     * @param {Error} error - The error object
     */
    function handleNewsError(error) {
        console.error('Failed to load news:', error);
        elements.newsContainer.innerHTML = `
            <div class="error-message">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p>Unable to load news. Please try again later.</p>
                <button id="retry-button">Retry</button>
            </div>
        `;
        
        document.getElementById('retry-button').addEventListener('click', initializeNewsSection);
    }

    /**
     * Initialize scroll-based animations
     */
    function initializeScrollAnimations() {
        const newsBlocks = document.querySelectorAll('.news-block');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        // Slightly improve performance by unobserving after animation
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });
            
            newsBlocks.forEach(block => observer.observe(block));
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            newsBlocks.forEach(block => block.classList.add('in-view'));
        }
    }

    /**
     * Handle scroll events for parallax and other effects
     */
    function handleScroll() {
        // Add parallax effect to header or other elements
        const scrollPosition = window.scrollY;
        
        // Parallax effect on banner
        const banner = document.querySelector('.welcome-banner');
        if (banner) {
            const parallaxValue = scrollPosition * 0.15;
            banner.style.backgroundPositionY = `-${parallaxValue}px`;
        }
    }

    /**
     * Handle window resize events
     */
    function handleResize() {
        // Adjust layout for different screen sizes if needed
        const width = window.innerWidth;
        
        // Close mobile menu on resize to desktop
        if (width > 992 && elements.mobileMenu.style.display === 'block') {
            elements.mobileMenu.style.display = 'none';
        }
    }

    /**
     * Debounce function to limit rapid firing of events
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Initialize the application when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})();