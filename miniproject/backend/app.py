from flask import Flask, request, jsonify, session, send_from_directory
import mysql.connector
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
import speech_recognition as sr
import pyttsx3
from datetime import datetime
import google.generativeai as genai
import traceback
from responses import get_disease_info

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5000", "http://127.0.0.1:5000"])  # More specific CORS settings
app.secret_key = "0x000002082528B890"

# Configure Google Gemini AI
API_KEY = 'AIzaSyBK-oHzyGQsrLR3ikZg5QLEdVaeSo7C_yo'
genai.configure(api_key=API_KEY)

# Initialize the Gemini model
try:
    model_list = genai.list_models()
    print("Available models:", [model.name for model in model_list])
    
    # Use the Gemini 1.5 Pro model
    model = genai.GenerativeModel('gemini-1.5-pro')
    chat = model.start_chat(history=[])
    print("Gemini model initialized successfully")
except Exception as e:
    print(f"Error initializing Gemini model: {str(e)}")
    traceback.print_exc()

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',  # Replace with your MySQL username
    'password': 'Aayush@45',  # Using the password from the second snippet
    'database': 'chatbot_db'
}

# Define EMOJI dictionary
EMOJI = {
    'symptom': '🔍',
    'doctor': '👨‍⚕️',
    'warning': '⚠️',
    'info': 'ℹ️',
    'treatment': '💊',
    'diet': '🍎',
    'rest': '🛌',
    'temperature': '🌡️'
}

# Function to get database connection
def get_db_connection():
    try:
        return mysql.connector.connect(**db_config)
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        traceback.print_exc()
        return None

# Serve index.html when accessing "/"
@app.route("/")
def serve_index():
    return send_from_directory(os.path.abspath("../frontend"), "index.html")

# Serve other static files like CSS, JS, images
@app.route('/<path:filename>')
def serve_static_files(filename):
    return send_from_directory(os.path.abspath("../frontend"), filename)

# Test endpoint to check if API is working
@app.route("/api/test", methods=["GET"])
def test_api():
    return jsonify({"status": "API is working!"})

# Add diagnostic endpoint to test database connection
@app.route("/api/db-test", methods=["GET"])
def test_db_connection():
    try:
        db = get_db_connection()
        if db:
            cursor = db.cursor()
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            cursor.close()
            db.close()
            return jsonify({"status": "Database connection successful", "result": result}), 200
        else:
            return jsonify({"status": "Database connection failed"}), 500
    except Exception as e:
        return jsonify({"status": "Database error", "error": str(e)}), 500

# Login Route
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")  # Get the selected role from the request

        print("Received Role:", role)  # Debugging - Check received role

        if role not in ["doctor", "patient"]:  # Ensure role is valid
            return jsonify({"error": "Invalid role selected"}), 400

        db = get_db_connection()
        if not db:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = db.cursor(dictionary=True)

        if role == "doctor":
            cursor.execute("SELECT * FROM doctors WHERE email = %s", (email,))
            user = cursor.fetchone()
            redirect_url = "/doctor/doctor.html" # Redirect to doctor dashboard
        else:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            redirect_url = "/homepage/home.html"  # Redirect to patient homepage

        cursor.close()
        db.close()

        if user and check_password_hash(user['password'], password):
            session['user'] = user  # Store session
            return jsonify({"message": "Login successful", "redirect": redirect_url}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Login error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": "An error occurred during login"}), 500

    
# Register Route   
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = generate_password_hash(data.get("password"))  # Hash password
        role = data.get("role")
        phone = data.get("phone")
        address = data.get("address")

        print("Registering Role:", role)  # Debugging

        if role not in ["doctor", "patient"]:  # Ensure valid role
            return jsonify({"error": "Invalid role selected"}), 400

        db = get_db_connection()
        if not db:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = db.cursor()

        if role == "doctor":
            cursor.execute("INSERT INTO doctors (full_name, email, password, phone_number, address) VALUES (%s, %s, %s, %s, %s)",
                           (name, email, password, phone, address))
            redirect_url = "/doctor.html"  # Redirect doctors to their page
        else:
            cursor.execute("INSERT INTO users (name, email, password, role, phone, address) VALUES (%s, %s, %s, %s, %s, %s)",
                           (name, email, password, role, phone, address))
            redirect_url = "/homepage/home.html"  # Redirect patients to home

        db.commit()
        cursor.close()
        db.close()

        return jsonify({"message": "User registered successfully!", "redirect": redirect_url}), 201
    except Exception as e:
        print(f"Registration error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Disease info endpoint
@app.route("/disease", methods=["POST"])
def disease_info():
    try:
        if not request.is_json:
            return jsonify({"reply": "Invalid request format. JSON expected."}), 400
            
        data = request.json
        disease_key = data.get("keyword", "").strip().lower()
        
        print(f"Disease info requested: '{disease_key}'")
        
        if not disease_key:
            return jsonify({"reply": "Please specify a health condition."}), 400

        # Get the formatted disease information
        response_text = get_disease_info(disease_key)
        
        # Try to store chat in database, but continue even if it fails
        try:
            user_email = session.get('user', {}).get('email', 'guest')
            print(f"Storing disease query for user: {user_email}")
            
            db = get_db_connection()
            if db:
                cursor = db.cursor()
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                user_message = f"tell me about {disease_key}"
                cursor.execute("INSERT INTO chat_history (user_email, user_message, bot_reply, timestamp) VALUES (%s, %s, %s, %s)",
                              (user_email, user_message, response_text, timestamp))
                db.commit()
                cursor.close()
                db.close()
                print("Chat history stored successfully")
            else:
                print("Skipping chat history storage due to DB connection failure")
        except Exception as e:
            print(f"Error storing chat history: {str(e)}")
            traceback.print_exc()
            # Continue even if DB storage fails
        
        return jsonify({"reply": response_text})
    
    except Exception as e:
        print(f"Unexpected error in disease info endpoint: {str(e)}")
        traceback.print_exc()
        return jsonify({"reply": "I'm having trouble processing your request at the moment. Please try again later."}), 500

# Chat endpoint
@app.route("/chat", methods=["POST"])
def chat_endpoint():
    print("Chat endpoint called")  # Debug log
    try:
        # Print request data for debugging
        print(f"Request headers: {request.headers}")
        print(f"Request data: {request.data}")
        
        # Get and validate JSON data
        if not request.is_json:
            print("Request is not JSON")
            return jsonify({"reply": "Invalid request format. JSON expected."}), 400
            
        data = request.json
        print(f"Parsed JSON data: {data}")
        
        user_message = data.get("message", "").strip()
        print(f"User message: '{user_message}'")
        
        if not user_message:
            return jsonify({"reply": "Please enter a valid question."}), 400

        # Check if this is a request about a disease
        for disease in ["fever", "migraine", "hypertension", "diabetes", "asthma", 
                        "arthritis", "depression", "gerd", "allergies", "common_cold"]:
            if f"tell me about {disease}" in user_message.lower():
                # Create a new request with the disease keyword
                disease_request = {"keyword": disease}
                return disease_info(disease_request)

        # Process the message using Google Gemini for non-disease queries
        try:
            print("Sending message to Gemini API")
            response = chat.send_message(user_message)
            bot_reply = response.text
            print(f"Gemini API response received: {bot_reply[:100]}...")  # Log first 100 chars
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            traceback.print_exc()
            return jsonify({"reply": f"AI model error: {str(e)}"}), 500
        
        # Try to store chat in database, but continue even if it fails
        try:
            user_email = session.get('user', {}).get('email', 'guest')
            print(f"Storing chat for user: {user_email}")
            
            db = get_db_connection()
            if db:
                cursor = db.cursor()
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                cursor.execute("INSERT INTO chat_history (user_email, user_message, bot_reply, timestamp) VALUES (%s, %s, %s, %s)",
                              (user_email, user_message, bot_reply, timestamp))
                db.commit()
                cursor.close()
                db.close()
                print("Chat history stored successfully")
            else:
                print("Skipping chat history storage due to DB connection failure")
        except Exception as e:
            print(f"Error storing chat history: {str(e)}")
            traceback.print_exc()
            # Continue even if DB storage fails
        
        print("Returning successful response")
        return jsonify({"reply": bot_reply})
    
    except Exception as e:
        print(f"Unexpected error in chat endpoint: {str(e)}")
        traceback.print_exc()
        return jsonify({"reply": "I'm having trouble processing your request at the moment. Please try again later."}), 500

# Retrieve Chat History for Logged-in User
@app.route("/history", methods=["GET"])
def get_chat_history():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        db = get_db_connection()
        if not db:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM chat_history WHERE user_email = %s ORDER BY timestamp DESC LIMIT 20",
                       (session['user']['email'],))
        chats = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify({"history": chats})
    except Exception as e:
        print(f"Error retrieving chat history: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# DOCTORS API ROUTES
# Fetch List of Doctors from Database
@app.route('/doctors', methods=['GET'])
def get_doctors():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT 
                d.doctor_id, 
                d.first_name, 
                d.last_name, 
                d.specialty, 
                d.qualifications, 
                d.experience_years, 
                d.profile_image, 
                d.email, 
                d.phone
            FROM 
                doctors_list d
        """)
        
        doctors = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'doctors': doctors})
    
    except Exception as e:
        print(f"Error getting doctors: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/doctors/<int:doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT 
                d.doctor_id, 
                d.first_name, 
                d.last_name, 
                d.specialty, 
                d.qualifications, 
                d.experience_years, 
                d.profile_image, 
                d.email, 
                d.phone,
                GROUP_CONCAT(DISTINCT l.name) AS locations
            FROM 
                doctors_list d
            LEFT JOIN 
                doctor_locations dl ON d.doctor_id = dl.location_id
            LEFT JOIN 
                locations l ON dl.location_id = l.location_id
            WHERE 
                d.doctor_id = %s
            GROUP BY 
                d.doctor_id
        """, (doctor_id,))
        
        doctor = cursor.fetchone()
        
        if not doctor:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Doctor not found'}), 404
        
        cursor.close()
        conn.close()
        
        return jsonify(doctor)
    
    except Exception as e:
        print(f"Error getting doctor details: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/doctors/<int:doctor_id>/schedule', methods=['GET'])
def get_doctor_schedule(doctor_id):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT 
                schedule_id,
                doctor_id,
                day_of_week,
                start_time,
                end_time,
                is_available
            FROM 
                doctor_schedules
            WHERE 
                doctor_id = %s
            ORDER BY 
                FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
                start_time
        """, (doctor_id,))
        
        schedule = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify(schedule)
    
    except Exception as e:
        print(f"Error getting doctor schedule: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/appointments', methods=['POST'])
def create_appointment():
    try:
        if not request.is_json:
            return jsonify({'error': 'Invalid request format. JSON expected.'}), 400
            
        data = request.json
        
        # Debug: Log the received data
        print(f"Received appointment data: {data}")
        
        # Validate required fields
        required_fields = ['doctor_id', 'patient_name', 'patient_email', 'patient_phone', 
                           'appointment_date', 'appointment_time']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor()
        
        # Insert appointment into database
        try:
            cursor.execute("""
                INSERT INTO appointments (
                    doctor_id, 
                    patient_name, 
                    patient_email, 
                    patient_phone, 
                    appointment_date, 
                    appointment_time, 
                    reason, 
                    status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['doctor_id'],
                data['patient_name'],
                data['patient_email'],
                data['patient_phone'],
                data['appointment_date'],
                data['appointment_time'],
                data.get('reason', ''),
                data.get('status', 'scheduled')
            ))
            
            conn.commit()
            appointment_id = cursor.lastrowid
            
            cursor.close()
            conn.close()
            
            print(f"Appointment created successfully with ID: {appointment_id}")
            return jsonify({'success': True, 'appointment_id': appointment_id}), 201
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            return jsonify({'error': f"Database error: {str(db_error)}"}), 500
    
    except Exception as e:
        print(f"Error creating appointment: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
# User appointments route with improved error handling
@app.route('/user/appointments', methods=['GET'])
def get_user_appointments():
    try:
        # Get user email from query parameter first, then try session
        user_email = request.args.get('email')
        
        if not user_email and 'user' in session and 'email' in session['user']:
            user_email = session['user']['email']
            
        if not user_email:
            print("No user email provided")
            return jsonify({"appointments": []}), 200
            
        conn = get_db_connection()
        if not conn:
            print("Database connection failed")
            return jsonify({"appointments": []}), 200
            
        cursor = conn.cursor(dictionary=True)
        
        # Fix the query to ensure proper type handling
        cursor.execute("""
            SELECT 
                appointment_id,
                doctor_id,
                patient_name,
                patient_email,
                patient_phone,
                appointment_date,
                appointment_time,
                reason,
                status,
                created_at
            FROM 
                appointments
            WHERE 
                patient_email = %s
            ORDER BY
                appointment_date, appointment_time
        """, (user_email,))
        
        appointments = cursor.fetchall()
        
        # Properly format date objects before JSON serialization
        for appt in appointments:
            if isinstance(appt['appointment_date'], (datetime.date, datetime.datetime)):
                appt['appointment_date'] = appt['appointment_date'].strftime('%Y-%m-%d')
            if isinstance(appt['created_at'], (datetime.date, datetime.datetime)):
                appt['created_at'] = appt['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        
        cursor.close()
        conn.close()
        
        return jsonify({"appointments": appointments})
        
    except Exception as e:
        print(f"Error retrieving appointments: {str(e)}")
        traceback.print_exc()
        return jsonify({'appointments': []}), 200
    
# Initialize the speech recognition and text-to-speech engines
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Create a new route for voice input
@app.route("/voice", methods=["POST"])
def voice_input():
    if request.method == "POST":
        try:
            # Get the audio file from the request
            audio_file = request.files.get("audio")
            
            if not audio_file:
                return jsonify({"error": "No audio file received"}), 400
                
            # Save the audio file temporarily
            temp_audio_path = "temp_audio.wav"
            audio_file.save(temp_audio_path)
            
            # Convert speech to text
            with sr.AudioFile(temp_audio_path) as source:
                audio_data = recognizer.record(source)
                text = recognizer.recognize_google(audio_data)
                
            # Remove temporary file
            os.remove(temp_audio_path)
            
            # Process the text through the Gemini API
            response = chat.send_message(text)
            bot_reply = response.text
            
            return jsonify({
                "recognized_text": text,
                "reply": bot_reply
            })
                
        except sr.UnknownValueError:
            return jsonify({"error": "Could not understand audio"}), 400
        except sr.RequestError:
            return jsonify({"error": "Could not request results from speech recognition service"}), 500
        except Exception as e:
            print(f"Voice input error: {str(e)}")
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500

# Route for text-to-speech conversion
@app.route("/speak", methods=["POST"])
def text_to_speech():
    try:
        if not request.is_json:
            return jsonify({"error": "Invalid request format. JSON expected."}), 400
            
        data = request.json
        text = data.get("text", "")
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
            
        # Set the speech engine properties
        engine.setProperty('rate', 150)    # Speed of speech
        engine.setProperty('volume', 0.9)  # Volume (0 to 1)
        
        # Generate audio file
        output_file = "speech_output.mp3"
        engine.save_to_file(text, output_file)
        engine.runAndWait()
        
        # Return the path to the audio file
        return send_from_directory(os.path.abspath("."), output_file)
        
    except Exception as e:
        print(f"Text-to-speech error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5000)