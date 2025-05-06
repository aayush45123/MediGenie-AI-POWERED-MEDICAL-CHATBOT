document.addEventListener('DOMContentLoaded', function () {
    // Initialize the UI
    initializeUI();

    // Get doctor ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctor_id');

    // Check if we have doctor data in localStorage
    let doctorData = localStorage.getItem('doctorData');

    if (doctorData) {
        try {
            window.doctor = JSON.parse(doctorData);
            processDoctor();
        } catch (e) {
            console.error('Error parsing doctor data from localStorage:', e);
            loadDoctorData();
        }
    } else {
        loadDoctorData();
    }

    // Setup appointment form submission
    setupAppointmentForm();
});

function loadDoctorData() {
    // Import doctor data or fetch from API
    fetch('http://localhost:5000/doctors')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            window.doctor = data.doctors; // Make 'doctor' globally accessible
            localStorage.setItem('doctorData', JSON.stringify(data.doctors));
            processDoctor();
        })
        .catch(error => {
            console.error('Error loading doctor data:', error);
            // Fallback to import if API fails
            import('../doctors_lists/doctor-data.js')
                .then(module => {
                    window.doctor = module.doctors;
                    processDoctor();
                })
                .catch(importError => {
                    console.error('Error importing doctor data:', importError);
                    showNotification('Failed to load doctor data. Please try again later.', 'error');
                });
        });
}

function processDoctor() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctor_id');

    if (doctorId) {
        // Find doctor in the data
        const selectedDoctor = findDoctorById(doctorId);

        if (selectedDoctor) {
            // Display doctor profile
            displayDoctorProfile(selectedDoctor);

            // Store selected doctor info for appointment reference
            localStorage.setItem('selectedDoctor', JSON.stringify(selectedDoctor));
        } else {
            // Show error if doctor not found
            showNotification('Doctor not found. Please try again.', 'error');
            // Redirect back to doctors list after a delay
            setTimeout(() => {
                window.location.href = '../lists/lists.html';
            }, 3000);
        }
    } else {
        // No doctor ID provided
        showNotification('No doctor selected. Redirecting to doctors list.', 'info');
        // Redirect back to doctors list after a delay
        setTimeout(() => {
            window.location.href = '../doctors_lists/lists.html';
        }, 3000);
    }
}

function initializeUI() {
    // Setup mobile menu toggle
    window.toggleMenu = function () {
        const mobileMenu = document.querySelector('.mobile-menu');
        mobileMenu.classList.toggle('show');
    }

    // Setup back button if available
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            window.history.back();
        });
    }
}

function findDoctorById(id) {
    // Convert id to number for comparison
    const numId = parseInt(id);

    // Handle different doctor data structures
    if (Array.isArray(doctor)) {
        // If doctor is array, find by id prop
        return doctor.find(doc => doc.id === numId || doc.doctor_id === numId);
    } else if (typeof doctor === 'object' && doctor !== null) {
        // If doctor is an object with doctor_id props directly
        return doctor[numId] || null;
    }

    return null;
}

function displayDoctorProfile(doctor) {
    // Hide loading indicator
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.style.display = 'none';
    }

    // Get profile container
    const profileContainer = document.getElementById('doctor-profile');

    // Use appropriate properties based on data structure
    const doctorName = doctor.name || `${doctor.first_name} ${doctor.last_name}`;
    const doctorSpecialty = doctor.specialty || doctor.specialization || 'Specialist';
    const doctorDepartment = doctor.department || doctor.specialty || 'Medical Department';
    const doctorImage = doctor.image || doctor.profile_image || '../assets/images/doctor-placeholder.jpg';

    // Create profile HTML
    profileContainer.innerHTML = `
        <div class="profile-header">
            <div class="profile-image">
                <img src="${doctorImage}" alt="${doctorName}" onerror="this.src='../assets/images/doctor-placeholder.jpg'">
            </div>
            <div class="profile-header-info">
                <h1>${doctorName}</h1>
                <p class="specialty">${doctorSpecialty}</p>
                <p class="department">${doctorDepartment}</p>
                <p class="designation">${doctor.designation || doctor.qualifications || 'Medical Professional'}</p>
                <div class="profile-actions">
                    <a href="#appointment-form-container" class="btn primary-btn">Book Appointment</a>
                    <button class="btn secondary-btn" onclick="showContactInfo('${doctor.phone || doctor.phone_number || ''}', '${doctor.email || ''}')">Contact Information</button>
                </div>
            </div>
        </div>
        <div class="profile-body">
            <h2 class="profile-section-title">Doctor Information</h2>
            <div class="profile-info-grid">
                <div class="profile-info-item">
                    <h3>Qualifications</h3>
                    <p>${doctor.qualification || doctor.qualifications || 'Medical Degree'}</p>
                </div>
                <div class="profile-info-item">
                    <h3>Registration</h3>
                    <p>${doctor.registration || doctor.license_number || 'Registered Medical Practitioner'}</p>
                </div>
                <div class="profile-info-item">
                    <h3>Department</h3>
                    <p>${doctorDepartment}</p>
                </div>
                <div class="profile-info-item">
                    <h3>Location</h3>
                    <p>${doctor.location || doctor.address || 'Main Hospital'}</p>
                </div>
            </div>
            
            <h2 class="profile-section-title">About Doctor</h2>
            <p>${doctor.about || `Dr. ${doctorName.split(' ')[1] || doctorName.split(' ')[0]} is a highly skilled and experienced ${doctorSpecialty} specialist with extensive experience in treating various conditions. With a focus on patient-centered care, Dr. ${doctorName.split(' ')[1] || doctorName.split(' ')[0]} is dedicated to providing the highest quality medical services.`}</p>
            
            <h2 class="profile-section-title">Specializations</h2>
            <ul class="specializations-list">
                ${generateSpecializations(doctorSpecialty)}
            </ul>
            
            <div id="doctor-schedule" class="schedule-section">
                <h2 class="profile-section-title">Availability</h2>
                <div class="schedule-grid">
                    ${generateScheduleDisplay(doctor)}
                </div>
            </div>
        </div>
    `;

    // Show profile container
    profileContainer.style.display = 'block';

    // Update page title
    document.title = `${doctorName} - Doctor Profile | MediConnect`;

    // Update appointment form with doctor information
    const appointmentTitle = document.querySelector('#appointment-form-container h2');
    if (appointmentTitle) {
        appointmentTitle.textContent = `Book an Appointment with ${doctorName}`;
    }

    // Load doctor schedule if available
    if (doctor.doctor_id) {
        fetchDoctorSchedule(doctor.doctor_id);
    }
}

function generateSpecializations(specialty) {
    // Generate list items based on specialty
    const specialties = [
        `General ${specialty}`,
        `Advanced ${specialty} Procedures`,
        `Minimally Invasive Techniques`,
        `Preventive ${specialty} Care`
    ];

    return specialties.map(item => `<li>${item}</li>`).join('');
}

function generateScheduleDisplay(doctor) {
    // Generate placeholder schedule display
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return daysOfWeek.map(day => {
        const isAvailable = Math.random() > 0.3; // Random availability for placeholder
        const availabilityClass = isAvailable ? 'available' : 'unavailable';
        const times = isAvailable ? '9:00 AM - 5:00 PM' : 'Not Available';

        return `
            <div class="schedule-day ${availabilityClass}">
                <div class="day-name">${day}</div>
                <div class="day-times">${times}</div>
            </div>
        `;
    }).join('');
}

function fetchDoctorSchedule(doctorId) {
    fetch(`http://localhost:5000/doctors/${doctorId}/schedule`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch doctor schedule');
            }
            return response.json();
        })
        .then(scheduleData => {
            updateScheduleDisplay(scheduleData);
        })
        .catch(error => {
            console.error('Error fetching doctor schedule:', error);
            // Schedule already displayed with placeholder data
        });
}

function updateScheduleDisplay(scheduleData) {
    const scheduleGrid = document.querySelector('.schedule-grid');
    if (!scheduleGrid || !scheduleData || !scheduleData.length) return;

    // Clear existing content
    scheduleGrid.innerHTML = '';

    // Create day-based schedule mapping
    const scheduleByDay = {};
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Initialize with all days as unavailable
    daysOfWeek.forEach(day => {
        scheduleByDay[day] = { isAvailable: false, times: [] };
    });

    // Update with actual schedule data
    scheduleData.forEach(slot => {
        const day = slot.day_of_week;
        if (scheduleByDay[day]) {
            if (slot.is_available) {
                scheduleByDay[day].isAvailable = true;
                scheduleByDay[day].times.push(`${slot.start_time} - ${slot.end_time}`);
            }
        }
    });

    // Generate schedule HTML
    daysOfWeek.forEach(day => {
        const dayData = scheduleByDay[day];
        const availabilityClass = dayData.isAvailable ? 'available' : 'unavailable';
        const times = dayData.isAvailable ? dayData.times.join('<br>') : 'Not Available';

        const dayElement = document.createElement('div');
        dayElement.className = `schedule-day ${availabilityClass}`;
        dayElement.innerHTML = `
            <div class="day-name">${day}</div>
            <div class="day-times">${times}</div>
        `;

        scheduleGrid.appendChild(dayElement);
    });
}

function setupAppointmentForm() {
    const appointmentForm = document.getElementById('appointment-form');
    if (!appointmentForm) return;

    appointmentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get doctor ID
        const doctorId = getSelectedDoctorId();
        if (!doctorId) {
            showNotification('Doctor information not available', 'error');
            return;
        }

        // Get form data
        const formData = {
            doctor_id: doctorId,
            patient_name: document.getElementById('patient-name').value,
            patient_email: document.getElementById('patient-email').value,
            patient_phone: document.getElementById('patient-phone').value,
            appointment_date: document.getElementById('appointment-date').value,
            appointment_time: document.getElementById('appointment-time').value,
            reason: document.getElementById('reason').value,
            status: 'scheduled'
        };

        // Send appointment data to server
        fetch('http://localhost:5000/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include' // Include cookies for session
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Failed to save appointment');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Appointment saved:', data);
                showNotification('Appointment request submitted successfully! We will contact you shortly to confirm.', 'success');

                // Store user email for future reference in chatbot
                localStorage.setItem('userEmail', document.getElementById('patient-email').value);

                // Store appointment data for chatbot reference
                const appointmentInfo = {
                    doctor_id: doctorId,
                    doctor_name: getSelectedDoctorName(),
                    specialty: getSelectedDoctorSpecialty(),
                    patient_name: document.getElementById('patient-name').value,
                    patient_email: document.getElementById('patient-email').value,
                    appointment_date: document.getElementById('appointment-date').value,
                    appointment_time: document.getElementById('appointment-time').value,
                    reason: document.getElementById('reason').value,
                    status: 'scheduled'
                };

                // Store in localStorage for reference by chatbot
                storeAppointmentInLocalStorage(appointmentInfo);

                // Reset form
                appointmentForm.reset();

                // Offer to return to chatbot after booking
                offerChatbotReturn();
            })
            .catch(error => {
                console.error('Error saving appointment:', error);
                showNotification('Failed to save appointment. Please try again.', 'error');
            });
    });

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        dateInput.setAttribute('min', today);
    }

    // Populate time slot options based on date selection
    setupDateTimeRelationship();
}

function setupDateTimeRelationship() {
    const dateInput = document.getElementById('appointment-date');
    const timeSelect = document.getElementById('appointment-time');

    if (!dateInput || !timeSelect) return;

    dateInput.addEventListener('change', function () {
        // Get day of week
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Clear existing options except the default
        while (timeSelect.options.length > 1) {
            timeSelect.remove(1);
        }

        // Generate time slots based on day of week
        const timeSlots = generateTimeSlotsForDay(dayOfWeek);

        // Add time options
        // In the setupDateTimeRelationship function, replace the loop that adds options with:
        timeSlots.forEach(slot => {
            const option = document.createElement('option');
            if (typeof slot === 'object') {
                option.value = slot.value; // Database-friendly format (24-hour)
                option.textContent = slot.display; // User-friendly format (12-hour with AM/PM)
            } else {
                option.value = slot;
                option.textContent = slot;
            }
            timeSelect.appendChild(option);
        });

        // Enable time select
        timeSelect.disabled = false;
    });
}

function generateTimeSlotsForDay(dayOfWeek) {
    // Default time slots
    let startHour = 9; // 9 AM
    let endHour = 17; // 5 PM
    let interval = 30; // 30 minute intervals

    // Adjust hours based on day of week
    if (dayOfWeek === 0) { // Sunday
        return ['Closed']; // No appointments on Sunday
    } else if (dayOfWeek === 6) { // Saturday
        startHour = 10; // 10 AM
        endHour = 14; // 2 PM
    }

    // Generate time slots
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
            const minuteFormatted = minute === 0 ? '00' : minute;
            const ampm = hour < 12 ? 'AM' : 'PM';

            // Create an option value in 24-hour format for the database
            const hour24 = hour.toString().padStart(2, '0');
            const min = minuteFormatted.toString().padStart(2, '0');
            const dbTimeValue = `${hour24}:${min}:00`;

            // Create a display text in 12-hour format for the user
            const displayText = `${hourFormatted}:${minuteFormatted} ${ampm}`;

            slots.push({
                value: dbTimeValue,
                display: displayText
            });
        }
    }

    return slots;
}

// Helper function to get doctor ID from URL
function getSelectedDoctorId() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctor_id');

    // If not in URL, try from localStorage
    if (!doctorId) {
        const selectedDoctor = JSON.parse(localStorage.getItem('selectedDoctor') || '{}');
        return selectedDoctor.id || selectedDoctor.doctor_id;
    }

    return doctorId;
}

// Helper function to get selected doctor name
function getSelectedDoctorName() {
    const selectedDoctor = JSON.parse(localStorage.getItem('selectedDoctor') || '{}');
    return selectedDoctor.name ||
        (selectedDoctor.first_name ? `${selectedDoctor.first_name} ${selectedDoctor.last_name}` : 'Doctor');
}

// Helper function to get selected doctor specialty
function getSelectedDoctorSpecialty() {
    const selectedDoctor = JSON.parse(localStorage.getItem('selectedDoctor') || '{}');
    return selectedDoctor.specialty || selectedDoctor.specialization || 'Medical Professional';
}

// Function to show contact information
window.showContactInfo = function (phone, email) {
    const phoneDisplay = phone || 'Not available';
    const emailDisplay = email || 'Not available';

    const contactMessage = `
        <div class="contact-info">
            <p><strong>Phone:</strong> ${phoneDisplay}</p>
            <p><strong>Email:</strong> ${emailDisplay}</p>
            <p>You can also contact our hospital at (555) 123-4567.</p>
        </div>
    `;

    showNotification(contactMessage, 'info', true);
}

// Store appointment in localStorage
function storeAppointmentInLocalStorage(appointmentInfo) {
    // Get existing appointments
    const storedAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');

    // Add new appointment with timestamp
    appointmentInfo.created_at = new Date().toISOString();
    appointmentInfo.appointment_id = Date.now(); // Use timestamp as ID

    storedAppointments.push(appointmentInfo);

    // Store updated appointments
    localStorage.setItem('userAppointments', JSON.stringify(storedAppointments));
}

// Offer to return to chatbot
function offerChatbotReturn() {
    const returnNotification = `
        <div class="return-to-chatbot">
            <p>Your appointment has been booked. Would you like to return to the chatbot?</p>
            <button class="btn primary-btn" onclick="returnToChatbot()">Yes, return to chatbot</button>
        </div>
    `;

    showNotification(returnNotification, 'success', true, false);
}

// Return to chatbot function
window.returnToChatbot = function () {
    window.location.href = '../chatbot/chatbot.html';
}

// Helper function to show notifications
function showNotification(message, type = 'info', html = false, autoHide = true) {
    const notification = document.getElementById('notification');
    if (!notification) {
        // Create notification element if it doesn't exist
        const notifElement = document.createElement('div');
        notifElement.id = 'notification';
        notifElement.className = `notification notification-${type}`;

        const iconElement = document.createElement('div');
        iconElement.className = 'notification-icon';
        iconElement.innerHTML = getNotificationIcon(type);

        const messageElement = document.createElement('div');
        messageElement.className = 'notification-message';

        const closeElement = document.createElement('button');
        closeElement.className = 'notification-close';
        closeElement.innerHTML = '&times;';
        closeElement.onclick = function () {
            notifElement.classList.remove('show');
        };

        notifElement.appendChild(iconElement);
        notifElement.appendChild(messageElement);
        notifElement.appendChild(closeElement);
        document.body.appendChild(notifElement);

        if (html) {
            messageElement.innerHTML = message;
        } else {
            messageElement.textContent = message;
        }

        // Show notification
        setTimeout(() => notifElement.classList.add('show'), 10);

        // Hide after delay if autoHide is true
        if (autoHide) {
            setTimeout(() => {
                notifElement.classList.remove('show');
            }, 5000);
        }
    } else {
        // Update existing notification
        const notificationMessage = notification.querySelector('.notification-message');
        const notificationIcon = notification.querySelector('.notification-icon');

        // Update content
        if (html) {
            notificationMessage.innerHTML = message;
        } else {
            notificationMessage.textContent = message;
        }

        // Update icon and class
        notificationIcon.innerHTML = getNotificationIcon(type);
        notification.className = `notification notification-${type} show`;

        // Hide after 3 seconds if autoHide is true
        if (autoHide) {
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '<i class="fas fa-check-circle"></i>';
        case 'error':
            return '<i class="fas fa-exclamation-circle"></i>';
        case 'warning':
            return '<i class="fas fa-exclamation-triangle"></i>';
        case 'info':
        default:
            return '<i class="fas fa-info-circle"></i>';
    }
}