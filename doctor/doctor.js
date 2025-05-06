function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector(".theme-toggle");

    // Toggle the class
    body.classList.toggle("light-mode");

    // Change icon based on theme
    if (body.classList.contains("light-mode")) {
        themeToggle.innerHTML = "🌞"; // Light mode
        localStorage.setItem("theme", "light");
    } else {
        themeToggle.innerHTML = "🌙"; // Dark mode
        localStorage.setItem("theme", "dark");
    }
}

// Load saved theme preference
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        document.querySelector(".theme-toggle").innerHTML = "🌞";
    }
});

function toggleMenu() {
    const menu = document.querySelector('.mobile-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

document.addEventListener("DOMContentLoaded", function () {
    fetchNews();
});

async function fetchNews() {
    const apiKey = '0ae3c956888747138f6993312f736fc6'; // Replace with your API Key
    const url = `https://newsapi.org/v2/everything?q=medical OR health OR medicine OR disease&sortBy=publishedAt&language=en&pageSize=100&apiKey=${apiKey}`;
    
    const newsContainer = document.getElementById('news-container');

    // Show the loader before fetching news
    newsContainer.innerHTML = `
        <div class="loader" id="news-loader">
            <div class="intern"></div>
            <div class="external-shadow">
                <div class="central"></div>
            </div>
        </div>
    `;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Hide the loader
        document.getElementById('news-loader').style.display = "none";

        if (data.articles.length === 0) {
            newsContainer.innerHTML = "<p>No medical news found.</p>";
            return;
        }

        newsContainer.innerHTML = ''; // Clear loader

        data.articles.forEach((article) => {
            const newsBlock = document.createElement('div');
            newsBlock.classList.add('news-block');
            const imageUrl = article.urlToImage || 'https://via.placeholder.com/300';

            newsBlock.innerHTML = `
                <div class="news-image">
                    <img src="${imageUrl}" alt="News Image">
                </div>
                <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                <p>${article.description || 'No description available'}</p>
                <small>Source: ${article.source.name}</small>
            `;

            newsContainer.appendChild(newsBlock);
        });

        // Apply fade animation on scroll
        observeNewsBlocks();

    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = `<p>Error loading news. Please try again later.</p>`;
    }
}

// Function to observe and trigger fade animations
function observeNewsBlocks() {
    const newsBlocks = document.querySelectorAll('.news-block');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    newsBlocks.forEach(block => observer.observe(block));
}
