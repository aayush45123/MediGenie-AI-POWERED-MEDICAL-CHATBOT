Medical Chatbot with Doctor Appointment System
A comprehensive medical chatbot application that provides disease information and appointment booking with Somaiya doctors.
Features

Medical Information: Get information about various diseases and conditions using the Gemini API
Predefined Disease Database: Access a curated Python dictionary of common diseases and their details
Doctor Appointment System: Book appointments with Somaiya doctors through an intuitive interface
User-Friendly Interface: Easy-to-navigate design for all users

Technologies Used

Python
Flask and Flask-CORS for the web framework and API
Google Generative AI (Gemini API) for chatbot intelligence
Python dictionaries for predefined disease database
HTML, CSS, JavaScript for the frontend

Installation
bash# Clone the repository
git clone https://github.com/your-username/medical-chatbot.git

# Navigate to the project directory
cd medical-chatbot

# Install dependencies
pip install flask flask_cors google-generativeai

# Set up environment variables
# Create a .env file and add your Gemini API key:
# GEMINI_API_KEY=your_api_key_here

# Run the application
python backend/app.py
Usage

Launch the application by running the Flask backend
python backend/app.py

Open frontend/index.html in your browser or navigate to the localhost URL provided by Flask
Choose between disease information or doctor appointment booking from the homepage
For disease information:

Navigate to the chatbot section
Type symptoms or disease name
Review the information provided by the Gemini-powered chatbot


For doctor appointments:

Browse the available Somaiya doctors
View doctor profiles and specialties
Choose a suitable time slot
Fill in your details
Confirm your appointment



Project Structure
MINIPROJECT/
├── .vscode/            # VS Code configuration
├── backend/            # Backend Python files
│   ├── __pycache__/    # Python cache
│   ├── app.py          # Main Flask application
│   ├── responses.py    # Response handling
│   └── temp_audio.wav  # Temporary audio file
├── frontend/           # Frontend files
│   ├── aboutus/        # About us page
│   ├── assets/         # Static assets
│   ├── chatbot/        # Chatbot interface
│   ├── doctor/         # Doctor section
│   ├── doctors_lists/  # List of doctors
│   ├── doctors_profile/# Doctor profiles
│   ├── doctorsimg/     # Doctor images
│   ├── homepage/       # Homepage
│   ├── login/          # Login page
│   ├── index.html      # Main HTML file
│   ├── script.js       # JavaScript
│   └── style.css       # CSS styling
Screenshots

![image](https://github.com/user-attachments/assets/2e8af5b2-0b30-4de9-a21f-b43dc15b32a8)
![image](https://github.com/user-attachments/assets/4488917b-24a6-4959-9fcb-f17a4be65f8a)
![image](https://github.com/user-attachments/assets/018dd072-0ec7-4a24-a91b-ce250784503d)
![image](https://github.com/user-attachments/assets/af077775-1807-4736-a583-b0950c431828)
![image](https://github.com/user-attachments/assets/25538e92-78e9-41b6-86e2-85593a23a709)
![image](https://github.com/user-attachments/assets/c49c5fc8-4800-4951-a0fe-fed395e1d97e)
![image](https://github.com/user-attachments/assets/0687945d-7ad2-44e3-989d-0054c995dd9e)


Future Enhancements

Integration with electronic health records
Multilingual support
Mobile application development
Advanced symptom analysis
Telemedicine features

Contributors
Aayush Bharda


License
This project is licensed under the MIT License.
Acknowledgments

Somaiya Hospital for providing doctor information
Gemini API for powering the chatbot functionality
