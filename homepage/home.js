   /**
         * Medical Dashboard - Professional Script
         * 
         * This script handles theme preferences, UI interactions,
         * news fetching, and animations for the medical chatbot dashboard.
         */

        // IIFE to avoid polluting global namespace
        (function() {
            // Configuration
            const CONFIG = {
                NEWS_API_KEY: '18bfc2aa1f3f6791af3a9f588c35f7e7',
                NEWS_ENDPOINT: 'https://gnews.io/api/v4/search',
                NEWS_QUERY: 'hospital OR hospitals OR "medical center" OR "healthcare facility"',
                NEWS_LANG: 'en',
                NEWS_COUNTRY: 'in',
                NEWS_COUNT: 10,
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
                fetchNews()
                    .then(articles => displayNews(articles))
                    .catch(error => handleNewsError(error));
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
                        lang: CONFIG.NEWS_LANG,
                        country: CONFIG.NEWS_COUNTRY,
                        max: CONFIG.NEWS_COUNT,
                        apikey: CONFIG.NEWS_API_KEY
                    });
            
                    const response = await fetch(`${CONFIG.NEWS_ENDPOINT}?${params}`);
            
                    if (!response.ok) {
                        throw new Error(`API returned ${response.status}: ${response.statusText}`);
                    }
            
                    const data = await response.json();
                    return data.articles || [];
                } catch (error) {
                    console.error('News API error:', error);
                    throw error;
                }
            }
            

            /**
             * Display news articles with staggered animation
             * @param {Array} articles - Array of news article objects
             */
            function displayNews(articles) {
                elements.newsContainer.innerHTML = '';

                if (articles.length === 0) {
                    elements.newsContainer.innerHTML = '<p class="no-news">No medical news found.</p>';
                    return;
                }

                // Create news grid container
                const newsGrid = document.createElement('div');
                newsGrid.className = 'news-grid';
                elements.newsContainer.appendChild(newsGrid);

                // Add articles with staggered animation
                articles.forEach((article, index) => {
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
                
                const imageUrl = article.image || 'https://via.placeholder.com/300x200?text=No+Image';

                const description = article.description || 'No description available';
                const source = article.source?.name || 'Unknown Source';
                
                newsBlock.innerHTML = `
                    <div class="news-image">
                        <img src="${imageUrl}" alt="${article.title}" loading="lazy">
                    </div>
                    <div class="news-content">
                        <h3 class="news-title"><a href="${article.url}" target="_blank" rel="noopener">${article.title}</a></h3>
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