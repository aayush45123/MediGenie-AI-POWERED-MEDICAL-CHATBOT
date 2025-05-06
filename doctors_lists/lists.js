document.addEventListener('DOMContentLoaded', function() {
    // Check if doctor-data.js has loaded properly
    if (typeof doctor === 'undefined') {
        console.error("Doctor data not found! Make sure doctor-data.js is properly loaded.");
        showNotification('Error loading doctor data', 'error');
        return;
    }
    
    // Initialize the UI
    initializeUI();
    
    // Populate doctors list
    populateDoctors(doctor);
    
    // Set up search functionality
    setupSearchWithDebounce();
});

function initializeUI() {
    // Setup modal functionality
    const modal = document.getElementById('doctor-modal');
    if (modal) {
        const closeBtn = document.getElementsByClassName('close')[0];
        
        // Close modal when clicking the X
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            }
        }
        
        // Close modal when clicking outside of it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
    
    // Setup mobile menu toggle
    window.toggleMenu = function() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('show');
        }
    }
}

function populateDoctors(doctorsData) {
    const doctorsContainer = document.getElementById('doctors-container');
    if (!doctorsContainer) {
        console.error("Doctors container not found!");
        return;
    }
    
    // Clear loading skeletons
    doctorsContainer.innerHTML = '';
    
    // Add each doctor to the container
    doctorsData.forEach(doctor => {
        const doctorCard = createDoctorCard(doctor);
        doctorsContainer.appendChild(doctorCard);
    });
}

function createDoctorCard(doctor) {
    const doctorCard = document.createElement('div');
    doctorCard.className = 'doctor-card';
    
    // Set data attributes for filtering
    doctorCard.setAttribute('data-department', (doctor.department || '').toLowerCase());
    doctorCard.setAttribute('data-specialty', (doctor.specialty || '').toLowerCase());
    doctorCard.setAttribute('data-location', (doctor.location || '').toLowerCase());
    
    doctorCard.innerHTML = `
        <div class="doctor-image">
            <img src="${doctor.image || '../assets/default-doctor.png'}" alt="${doctor.name}">
        </div>
        <div class="doctor-info">
            <h3>${doctor.name}</h3>
            ${doctor.specialty ? `<p class="specialty">${doctor.specialty}</p>` : ''}
            ${doctor.department ? `<p class="department">${doctor.department}</p>` : ''}
            ${doctor.designation ? `<p class="designation">${doctor.designation}</p>` : ''}
            <button class="btn view-profile-btn" data-id="${doctor.id}">View Profile</button>
        </div>
    `;
    
    // Add event listener for view profile button
    doctorCard.querySelector('.view-profile-btn').addEventListener('click', function() {
        // Navigate to profile page with doctor ID
        window.location.href = `../doctors_profile/profile.html?doctor_id=${doctor.id}`;
    });

    return doctorCard;
}

// Add search with delay (debouncing)
function setupSearchWithDebounce() {
    const searchInput = document.getElementById('search-filter');
    if (!searchInput) {
        console.error("Search input not found!");
        return;
    }
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Set new timeout (300ms delay)
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });
    
    // Add clear button to search input
    addSearchClearButton();
}

// Add a clear button to the search input
function addSearchClearButton() {
    const searchInput = document.getElementById('search-filter');
    if (!searchInput) return;
    
    const searchContainer = searchInput.parentElement;
    searchContainer.style.position = 'relative';
    
    // Create clear button
    const clearButton = document.createElement('button');
    clearButton.className = 'search-clear-btn';
    clearButton.innerHTML = '&times;';
    clearButton.style.display = 'none';
    clearButton.style.position = 'absolute';
    clearButton.style.right = '10px';
    clearButton.style.top = '50%';
    clearButton.style.transform = 'translateY(-50%)';
    clearButton.style.background = 'none';
    clearButton.style.border = 'none';
    clearButton.style.fontSize = '18px';
    clearButton.style.cursor = 'pointer';
    
    // Add clear button to container
    searchContainer.appendChild(clearButton);
    
    // Show/hide clear button based on input content
    searchInput.addEventListener('input', function() {
        clearButton.style.display = this.value ? 'block' : 'none';
    });
    
    // Clear search when button is clicked
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        clearButton.style.display = 'none';
        applyFilters();
    });
}

// Simplified applyFilters function that only uses the search filter
function applyFilters() {
    const searchTerm = document.getElementById('search-filter').value.toLowerCase().trim();
    
    const doctorCards = document.querySelectorAll('.doctor-card');
    let matchCount = 0;
    
    doctorCards.forEach(card => {
        const doctorName = card.querySelector('h3').textContent.toLowerCase();
        
        // Get additional searchable text from doctor card
        const specialty = card.querySelector('.specialty')?.textContent.toLowerCase() || '';
        const department = card.querySelector('.department')?.textContent.toLowerCase() || '';
        const designation = card.querySelector('.designation')?.textContent.toLowerCase() || '';
        
        // Combine all searchable text
        const searchableText = `${doctorName} ${specialty} ${department} ${designation}`;
        
        // Enhanced search: 
        // Support multi-word search with space-separated terms (must match all terms)
        let matchesSearch = true;
        if (searchTerm) {
            const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);
            matchesSearch = searchTerms.every(term => searchableText.includes(term));
        }
        
        if (matchesSearch) {
            card.style.display = 'flex';
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show "no results" message if needed
    updateNoResultsMessage(matchCount);
    
    // Update results counter
    updateResultsCounter(matchCount);
}

// Update the no results message
function updateNoResultsMessage(matchCount) {
    const doctorsContainer = document.getElementById('doctors-container');
    if (!doctorsContainer) return;
    
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (matchCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-message';
            noResultsMsg.className = 'no-results';
            noResultsMsg.style.width = '100%';
            noResultsMsg.style.padding = '20px';
            noResultsMsg.style.textAlign = 'center';
            
            // Create a more user-friendly message
            const message = document.createElement('div');
            message.innerHTML = `
                <h3>No doctors match your search criteria</h3>
                <p>Try adjusting your search term.</p>
                <button id="clear-filters" class="btn secondary-btn">Clear search</button>
            `;
            
            noResultsMsg.appendChild(message);
            doctorsContainer.appendChild(noResultsMsg);
            
            // Add event listener to clear filters button
            document.getElementById('clear-filters').addEventListener('click', clearAllFilters);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Function to clear all filters
function clearAllFilters() {
    const searchInput = document.getElementById('search-filter');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Re-apply filters (which now should show all doctors)
    applyFilters();
    
    // Show notification
    showNotification('Search cleared', 'success');
}

// Add a results counter to show how many doctors match the search
function updateResultsCounter(count) {
    let counterElement = document.getElementById('results-counter');
    
    if (!counterElement) {
        counterElement = document.createElement('div');
        counterElement.id = 'results-counter';
        counterElement.className = 'results-counter';
        counterElement.style.marginTop = '10px';
        counterElement.style.fontSize = '14px';
        counterElement.style.color = '#666';
        
        // Insert counter after the filter container
        const filtersSection = document.querySelector('#filters .container');
        if (filtersSection) {
            filtersSection.appendChild(counterElement);
        }
    }
    
    // Update the counter text
    counterElement.textContent = `Found ${count} doctor${count !== 1 ? 's' : ''}`;
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const notificationMessage = notification.querySelector('.notification-message');
    const notificationIcon = notification.querySelector('.notification-icon');
    
    if (notificationMessage) {
        notificationMessage.textContent = message;
    }
    
    // Set icon based on notification type
    if (notificationIcon) {
        if (type === 'success') {
            notificationIcon.className = 'notification-icon fas fa-check-circle';
            notification.className = 'notification notification-success';
        } else if (type === 'error') {
            notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
            notification.className = 'notification notification-error';
        } else {
            notificationIcon.className = 'notification-icon fas fa-info-circle';
            notification.className = 'notification notification-info';
        }
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}