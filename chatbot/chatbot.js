document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const themeToggle = document.getElementById('theme-toggle');
  const clearChat = document.getElementById('clear-chat');
  const typingStatus = document.getElementById('typing-status');
  const attachButton = document.getElementById('attach-button');
  const emojiButton = document.getElementById('emoji-button');
  const voiceButton = document.getElementById('voice-button');
  const historyBtn = document.getElementById('history-btn');
  const historyPanel = document.getElementById('history-panel');
  const closeHistory = document.getElementById('close-history');
  const historyList = document.getElementById('history-list');
  const toggleSidebar = document.querySelector('.toggle-sidebar');
  const sidebar = document.querySelector('.sidebar');
  const notification = document.getElementById('notification');
  const appointmentBtn = document.querySelector('.nav-item:nth-child(4)');
  
  // API Configuration
  const apiUrl = 'http://localhost:5000/chat';
  const appointmentUrl = 'http://localhost:5000/user/appointments';
  
  // Application State
  let darkMode = localStorage.getItem('darkMode') === 'true';
  let isTyping = false;
  let voiceRecording = false;
  let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  let recognition = null;
  
  // Initialize the application
  initApp();
  
  function initApp() {
    // Apply theme on load
    applyTheme();
    
    // Focus input on load
    userInput.focus();
    
    // Initialize animations
    initializeAnimations();
    
    // Attach event listeners
    attachEventListeners();
    
    // Load chat history
    loadChatHistory();
  }
  
  function initializeAnimations() {
    // Add animation classes to existing messages
    document.querySelectorAll('.message').forEach(msg => {
      msg.classList.add('animated');
    });
  }
  
  function attachEventListeners() {
    // Send message on button click
    sendButton.addEventListener('click', handleSendMessage);
    
    // Send message on Enter key (without shift for newline)
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });
    
    // Input animation for focus
    userInput.addEventListener('focus', function() {
      document.querySelector('.input-container').classList.add('focused');
    });
    
    userInput.addEventListener('blur', function() {
      document.querySelector('.input-container').classList.remove('focused');
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Clear chat
    clearChat.addEventListener('click', clearAllMessages);
    
    // Toggle sidebar
    toggleSidebar.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      this.querySelector('i').classList.toggle('fa-chevron-right');
      this.querySelector('i').classList.toggle('fa-chevron-left');
    });
    
    // History panel toggle
    historyBtn.addEventListener('click', function() {
      historyPanel.classList.toggle('active');
      animateButtonClick(this);
    });
    
    // Close history panel
    closeHistory.addEventListener('click', function() {
      historyPanel.classList.remove('active');
    });
    
    // Voice input
    voiceButton.addEventListener('click', toggleVoiceInput);
    
    // Attachment button (mockup)
    attachButton.addEventListener('click', function() {
      animateButtonClick(this);
      showNotification('Attachment feature coming soon!');
    });
    
    // Emoji button (mockup)
    emojiButton.addEventListener('click', function() {
      animateButtonClick(this);
      showNotification('Emoji picker coming soon!');
    });
    
    // Appointments button
    if (appointmentBtn) {
      appointmentBtn.addEventListener('click', function() {
        fetchUserAppointments();
        animateButtonClick(this);
      });
    }
    
    // Handle window resize for responsive adjustments
    window.addEventListener('resize', handleResize);
    
    // Initial responsive check
    handleResize();
  }
  
  function handleResize() {
    if (window.innerWidth <= 1024) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }
  }
  
  function applyTheme() {
    document.body.classList.toggle('dark-theme', darkMode);
    themeToggle.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  
  function toggleTheme() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyTheme();
    animateButtonClick(themeToggle);
  }
  
  function handleSendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Add to chat
    addMessage(message, true);
    
    // Save to history
    saveMessageToHistory(message, true);
    
    // Clear input and focus
    userInput.value = '';
    userInput.focus();
    
    // Check if it's an appointment query
    if (isAppointmentQuery(message)) {
      fetchUserAppointments();
    } else {
      // Send to backend
      sendMessageToBackend(message);
    }
  }
  
  function isAppointmentQuery(message) {
    const appointmentKeywords = [
      'appointment', 'appointments', 'scheduled', 'doctor visit', 
      'when is my appointment', 'my appointments', 'my doctor', 
      'see my appointments', 'show appointments', 'check appointments', 
      'any appointments', 'upcoming appointments', 'appointments today',
      'view my appointments', 'view appointments'
    ];
    
    return appointmentKeywords.some(keyword => 
      message.toLowerCase().includes(keyword));
  }
  
  function toggleVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
      showNotification('Voice recognition is not supported in your browser.');
      return;
    }
    
    if (!voiceRecording) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  }
  
  function startVoiceRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = function() {
      voiceRecording = true;
      voiceButton.classList.add('active');
      showNotification('Listening...');
    };
    
    recognition.onresult = function(event) {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (finalTranscript !== '') {
        userInput.value = finalTranscript;
      } else {
        userInput.value = interimTranscript;
      }
    };
    
    recognition.onerror = function(event) {
      stopVoiceRecognition();
      showNotification('Error occurred in recognition: ' + event.error);
    };
    
    recognition.onend = function() {
      stopVoiceRecognition();
    };
    
    recognition.start();
  }
  
  function stopVoiceRecognition() {
    if (recognition) {
      recognition.stop();
      voiceRecording = false;
      voiceButton.classList.remove('active');
    }
  }
  
  function clearAllMessages() {
    // Animation for clearing messages
    const messages = document.querySelectorAll('.message');
    let delay = 0;
    
    messages.forEach(msg => {
      setTimeout(() => {
        msg.style.transition = 'all 0.3s ease';
        msg.style.opacity = '0';
        msg.style.transform = 'scale(0.8)';
      }, delay);
      delay += 50;
    });
    
    setTimeout(() => {
      chatMessages.innerHTML = '';
      // Add timestamp
      addTimestamp();
      // Add welcome message back
      addMessage('Hello! I\'m your health assistant. How can I help you today?', false);
    }, delay + 300);
    
    // Clear local storage history
    chatHistory = [];
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    updateHistoryPanel();
    
    animateButtonClick(clearChat);
  }
  
  function addTimestamp() {
    const timestampDiv = document.createElement('div');
    timestampDiv.classList.add('timestamp');
    
    const dateSpan = document.createElement('span');
    dateSpan.textContent = getCurrentDate();
    
    timestampDiv.appendChild(dateSpan);
    chatMessages.appendChild(timestampDiv);
  }
  
  function getCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  }
  
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  function addMessage(message, isUser) {
    if (message.trim() === '') return;
    
    // Create message container
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.classList.add('animated');
    
    // Create message content
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    // Create message text with proper formatting
    // Support for markdown-like formatting and links
    const formattedMessage = formatMessage(message);
    messageContent.innerHTML = formattedMessage;
    
    // Create time element
    const messageTime = document.createElement('div');
    messageTime.classList.add('message-time');
    messageTime.textContent = getCurrentTime();
    
    // Assemble message components
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    // Add to chat
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom with animation
    smoothScrollToBottom();
  }
  
  function formatMessage(message) {
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let formattedMessage = message.replace(urlRegex, function(url) {
      return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
    
    // Format bold text (** or __)
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*|__(.*?)__/g, function(match, p1, p2) {
      return '<strong>' + (p1 || p2) + '</strong>';
    });
    
    // Convert line breaks to <br>
    formattedMessage = formattedMessage.replace(/\n/g, '<br>');
    
    return formattedMessage;
  }
  
  function smoothScrollToBottom() {
    const scrollOptions = {
      top: chatMessages.scrollHeight,
      behavior: 'smooth'
    };
    chatMessages.scrollTo(scrollOptions);
  }
  
  function showTypingIndicator() {
    typingStatus.classList.add('visible');
    isTyping = true;
  }
  
  function hideTypingIndicator() {
    typingStatus.classList.remove('visible');
    isTyping = false;
  }
  
  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  function animateButtonClick(button) {
    button.classList.add('clicked');
    setTimeout(() => {
      button.classList.remove('clicked');
    }, 200);
  }
  
  async function sendMessageToBackend(message) {
    // Show typing indicator
    showTypingIndicator();
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process response with a slight delay for natural feel
      setTimeout(() => {
        hideTypingIndicator();
        
        let botReply = '';
        if (data.reply) {
          botReply = data.reply;
        } else if (data.response) {
          botReply = data.response;
        } else if (data.message) {
          botReply = data.message;
        } else {
          botReply = 'I received your message, but I\'m not sure how to respond.';
        }
        
        // Add bot response to chat
        addMessage(botReply, false);
        
        // Save to history
        saveMessageToHistory(botReply, false);
        
      }, Math.random() * 500 + 300); // Random delay between 300-800ms for natural typing feel
      
    } catch (error) {
      console.error('Error communicating with backend:', error);
      
      setTimeout(() => {
        hideTypingIndicator();
        const errorMessage = 'Sorry, I encountered an error while processing your request. Please try again later.';
        addMessage(errorMessage, false);
        saveMessageToHistory(errorMessage, false);
      }, 500);
    }
  }
  
  function fetchUserAppointments() {
    // Show typing indicator while fetching
    showTypingIndicator();
    
    // Get the user email
    const userEmail = new URLSearchParams(window.location.search).get('email') 
                    || localStorage.getItem('userEmail') 
                    || document.getElementById('patient-email')?.value 
                    || 'aayushbharda999@gmail.com'; // Use the email we know has appointments
    
    console.log("Fetching appointments for email:", userEmail); // Debug log
    
    fetch(`${appointmentUrl}?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        credentials: 'include', // Include cookies for session
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch appointments: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Full appointments response:", data); // Log the entire response
        hideTypingIndicator();
        
        // Check if data has appointments property and it's an array
        if (data && data.appointments && Array.isArray(data.appointments)) {
            if (data.appointments.length > 0) {
                // Add initiating message to chat
                addMessage("Here are your upcoming appointments:", false);
                saveMessageToHistory("Here are your upcoming appointments:", false);
                
                // Show appointments in an attractive format
                setTimeout(() => {
                    displayAppointmentsCard(data.appointments);
                }, 500);
            } else {
                const noApptsMsg = 'You don\'t have any upcoming appointments. Would you like to schedule one?';
                addMessage(noApptsMsg, false);
                saveMessageToHistory(noApptsMsg, false);
            }
        } else {
            console.error("Invalid appointments data format:", data);
            const errorMsg = 'Sorry, I couldn\'t fetch your appointments correctly. Please try again later.';
            addMessage(errorMsg, false);
            saveMessageToHistory(errorMsg, false);
        }
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
        hideTypingIndicator();
        const errorMsg = `Sorry, I couldn't fetch your appointments: ${error.message}`;
        addMessage(errorMsg, false);
        saveMessageToHistory(errorMsg, false);
    });
}
  
  function displayAppointmentsCard(appointments) {
    if (!appointments || appointments.length === 0) {
        return;
    }
    
    // Create a card-style message for appointments
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message', 'animated', 'appointment-card-container');
    
    const appointmentsHTML = appointments.map((appt, index) => {
        // Format date properly
        const appointmentDate = new Date(appt.appointment_date);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Determine status class for styling
        const statusClass = getStatusClass(appt.status);
        
        return `
            <div class="appointment-card">
                <div class="appointment-header">
                    <span class="appointment-number">#${index + 1}</span>
                    <span class="appointment-status ${statusClass}">${appt.status}</span>
                </div>
                <div class="appointment-doctor">
                    <i class="fas fa-user-md"></i> ${appt.doctor_name || 'Doctor #' + appt.doctor_id}
                </div>
                <div class="appointment-specialty">
                    <i class="fas fa-stethoscope"></i> ${appt.specialty || 'Medical Professional'}
                </div>
                <div class="appointment-datetime">
                    <i class="far fa-calendar-alt"></i> ${formattedDate}
                </div>
                <div class="appointment-time">
                    <i class="far fa-clock"></i> ${appt.appointment_time}
                </div>
                <div class="appointment-reason">
                    <i class="fas fa-clipboard-list"></i> ${appt.reason || 'General Check-up'}
                </div>
            </div>
        `;
    }).join('');
    
    // Create styles for the appointment cards
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .appointment-card-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 90%;
        }
        .appointment-card {
            background: ${darkMode ? '#2a2a2a' : '#f5f5f5'};
            border-left: 4px solid #3498db;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .appointment-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .appointment-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            border-bottom: 1px solid ${darkMode ? '#444' : '#e0e0e0'};
            padding-bottom: 5px;
        }
        .appointment-number {
            font-weight: bold;
            color: #3498db;
        }
        .appointment-status {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status-scheduled {
            background-color: #3498db;
            color: white;
        }
        .status-confirmed {
            background-color: #2ecc71;
            color: white;
        }
        .status-completed {
            background-color: #7f8c8d;
            color: white;
        }
        .status-cancelled {
            background-color: #e74c3c;
            color: white;
        }
        .appointment-doctor, .appointment-specialty, .appointment-datetime, .appointment-time, .appointment-reason {
            margin: 5px 0;
            display: flex;
            align-items: center;
        }
        .appointment-card i {
            margin-right: 8px;
            color: #3498db;
            width: 16px;
        }
        .message-time {
            padding-top: 10px;
        }
    `;
    
    document.head.appendChild(styleElement);
    
    // Create message content
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.innerHTML = appointmentsHTML;
    
    // Create time element
    const messageTime = document.createElement('div');
    messageTime.classList.add('message-time');
    messageTime.textContent = getCurrentTime();
    
    // Assemble message components
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    // Add to chat
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom with animation
    smoothScrollToBottom();
    
    // Save the plain text version to history
    const plainTextAppointments = formatAppointmentsForHistory(appointments);
    saveMessageToHistory(plainTextAppointments, false);
  }
  
  function getStatusClass(status) {
    status = status.toLowerCase();
    if (status === 'scheduled') return 'status-scheduled';
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'completed') return 'status-completed';
    if (status === 'cancelled') return 'status-cancelled';
    return 'status-scheduled'; // default
  }
  
  function formatAppointmentsForHistory(appointments) {
    // Create a plain text version for history storage
    let text = 'Your appointments:\n\n';
    
    appointments.forEach((appt, index) => {
        const appointmentDate = new Date(appt.appointment_date);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        text += `Appointment #${index + 1}\n`;
        text += `- Doctor: ${appt.doctor_name || 'Doctor #' + appt.doctor_id}\n`;
        text += `- Specialty: ${appt.specialty || 'Medical Professional'}\n`;
        text += `- Date: ${formattedDate}\n`;
        text += `- Time: ${appt.appointment_time}\n`;
        text += `- Reason: ${appt.reason || 'General Check-up'}\n`;
        text += `- Status: ${appt.status}\n\n`;
    });
    
    return text;
  }
  
  function saveMessageToHistory(message, isUser) {
    const timestamp = new Date().toISOString();
    chatHistory.push({
      message: message,
      isUser: isUser,
      timestamp: timestamp
    });
    
    // Keep history limited to most recent 50 messages
    if (chatHistory.length > 50) {
      chatHistory = chatHistory.slice(chatHistory.length - 50);
    }
    
    // Save to local storage
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    // Update history panel
    updateHistoryPanel();
  }
  
  function updateHistoryPanel() {
    // Clear current history
    historyList.innerHTML = '';
    
    // Group messages by day
    const groupedHistory = groupHistoryByDay();
    
    // Add each day group
    Object.keys(groupedHistory).sort().reverse().forEach(day => {
      // Add day header
      const dayHeader = document.createElement('div');
      dayHeader.classList.add('history-day-header');
      dayHeader.textContent = day;
      historyList.appendChild(dayHeader);
      
      // Add messages for this day
      groupedHistory[day].forEach(historyItem => {
        addHistoryItem(historyItem);
      });
    });
  }
  
  function groupHistoryByDay() {
    const grouped = {};
    
    chatHistory.forEach(item => {
      const date = new Date(item.timestamp);
      const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      
      if (!grouped[day]) {
        grouped[day] = [];
      }
      
      grouped[day].push(item);
    });
    
    return grouped;
  }
  
  function addHistoryItem(historyItem) {
    const item = document.createElement('div');
    item.classList.add('history-item');
    
    // Add icon based on sender
    const icon = document.createElement('i');
    icon.classList.add('fas', historyItem.isUser ? 'fa-user' : 'fa-robot');
    icon.style.marginRight = '8px';
    
    // Format time
    const time = new Date(historyItem.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const timeElement = document.createElement('div');
    timeElement.classList.add('history-item-time');
    timeElement.textContent = time;
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('history-item-message');
    messageElement.textContent = truncateText(historyItem.message, 50);
    
    // Add all elements to the item
    item.appendChild(icon);
    item.appendChild(timeElement);
    item.appendChild(messageElement);
    
    // Add click event to load this conversation
    item.addEventListener('click', function() {
      // When clicked, show the full message in the chat
      addMessage(historyItem.message, historyItem.isUser);
      historyPanel.classList.remove('active');
    });
    
    historyList.appendChild(item);
  }
  
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  function loadChatHistory() {
    // Update history panel with stored messages
    updateHistoryPanel();
  }
  
  // Check if we need to add timestamp (first load)
  if (!document.querySelector('.timestamp')) {
    addTimestamp();
  }
});

// Add this code to your chatbot.js file

// Event listener for disease keyword buttons
document.addEventListener('DOMContentLoaded', function() {
  // Get all keyword buttons
  const keywordButtons = document.querySelectorAll('.keyword-btn');
  
  // Add click event listener to each button
  keywordButtons.forEach(button => {
      button.addEventListener('click', function() {
          const keyword = this.getAttribute('data-keyword');
          
          // Extract the disease name from the keyword phrase
          const diseaseName = keyword.replace('tell me about ', '');
          
          // Show the message in the chat
          addUserMessage(keyword);
          
          // Show typing indicator
          document.getElementById('typing-status').style.display = 'block';
          
          // Make API request for disease information
          fetch('/disease', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ keyword: diseaseName })
          })
          .then(response => response.json())
          .then(data => {
              // Hide typing indicator
              document.getElementById('typing-status').style.display = 'none';
              
              // Add the bot's response to the chat
              addBotMessage(data.reply);
              
              // Save to chat history
              saveToHistory(keyword, data.reply);
          })
          .catch(error => {
              console.error('Error:', error);
              document.getElementById('typing-status').style.display = 'none';
              addBotMessage('Sorry, I could not process your request at the moment.');
          });
      });
  });
});

// Function to add user message to chat
function addUserMessage(message) {
  const chatMessages = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message user-message animated';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = `<p>${message}</p>`;
  
  const time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = 'Just now';
  
  messageElement.appendChild(content);
  messageElement.appendChild(time);
  chatMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Clear input field if this was from input
  const userInput = document.getElementById('user-input');
  if (userInput) {
      userInput.value = '';
  }
}

// Function to add bot message to chat
function addBotMessage(message) {
  const chatMessages = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message bot-message animated';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  
  // Convert markdown to HTML for display
  const formattedMessage = parseMarkdown(message);
  content.innerHTML = `<p>${formattedMessage}</p>`;
  
  const time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = 'Just now';
  
  messageElement.appendChild(content);
  messageElement.appendChild(time);
  chatMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Simple markdown parser for formatting responses
function parseMarkdown(text) {
  // Handle headers
  text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // Handle bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle italics
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Handle lists - properly close the ul tags
  let listText = text;
  listText = listText.replace(/^\- (.*$)/gm, '<li>$1</li>');
  listText = listText.replace(/(<li>.*<\/li>(\n|$))+/g, '<ul>$&</ul>');
  
  // Handle emojis - convert emoji codes to actual emojis
  listText = listText.replace(/🔍|🌡️|👨‍⚕️|⚠️|ℹ️|💊|🍎|🛌/g, function(match) {
      return match; // Already emoji characters, keep as is
  });
  
  return listText;
}

// Function to save chat to history
function saveToHistory(userMessage, botReply) {
  // Check if we're logged in
  const userEmail = getUserEmail(); // Implement this function to get current user email
  
  if (!userEmail) {
      console.log('User not logged in, not saving to history');
      return;
  }
  
  // Save to history via API
  fetch('/api/save-history', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user_message: userMessage,
          bot_reply: botReply
      }),
      credentials: 'include' // Important for session cookies
  })
  .then(response => response.json())
  .then(data => {
      console.log('History saved:', data);
  })
  .catch(error => {
      console.error('Error saving history:', error);
  });
}

// Helper function to get user email from session
function getUserEmail() {
  // This is a placeholder - implement according to your authentication system
  // Could retrieve from localStorage, sessionStorage, or a global variable
  return localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail') || null;
}

// Additional function to handle clicking "Enter" key in the input field
document.addEventListener('DOMContentLoaded', function() {
  const userInput = document.getElementById('user-input');
  if (userInput) {
      userInput.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
              event.preventDefault();
              
              const message = userInput.value.trim();
              if (message) {
                  // Check if it's a disease-related query
                  let isDiseaseQuery = false;
                  const diseaseKeywords = ['fever', 'migraine', 'hypertension', 'diabetes', 
                                         'asthma', 'arthritis', 'depression', 'gerd', 
                                         'allergies', 'common_cold'];
                  
                  let matchedDisease = null;
                  for (const disease of diseaseKeywords) {
                      if (message.toLowerCase().includes(`tell me about ${disease}`)) {
                          isDiseaseQuery = true;
                          matchedDisease = disease;
                          break;
                      }
                  }
                  
                  // Show user message in chat
                  addUserMessage(message);
                  
                  // Show typing indicator
                  document.getElementById('typing-status').style.display = 'block';
                  
                  if (isDiseaseQuery) {
                      // Use disease endpoint
                      fetch('/disease', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ keyword: matchedDisease })
                      })
                      .then(response => response.json())
                      .then(data => {
                          document.getElementById('typing-status').style.display = 'none';
                          addBotMessage(data.reply);
                          saveToHistory(message, data.reply);
                      })
                      .catch(error => {
                          console.error('Error:', error);
                          document.getElementById('typing-status').style.display = 'none';
                          addBotMessage('Sorry, I could not process your request at the moment.');
                      });
                  } else {
                      // Use general chat endpoint
                      fetch('/chat', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ message: message })
                      })
                      .then(response => response.json())
                      .then(data => {
                          document.getElementById('typing-status').style.display = 'none';
                          addBotMessage(data.reply);
                          saveToHistory(message, data.reply);
                      })
                      .catch(error => {
                          console.error('Error:', error);
                          document.getElementById('typing-status').style.display = 'none';
                          addBotMessage('Sorry, I could not process your request at the moment.');
                      });
                  }
              }
          }
      });
  }
  
  // Add click handler for send button if it exists
  const sendButton = document.getElementById('send-button');
  if (sendButton) {
      sendButton.addEventListener('click', function() {
          const userInput = document.getElementById('user-input');
          const message = userInput.value.trim();
          
          if (message) {
              // Trigger the same logic as pressing Enter
              const event = new KeyboardEvent('keypress', { key: 'Enter' });
              userInput.dispatchEvent(event);
          }
      });
  }
});