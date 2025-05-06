# responses.py - Health AI Chatbot Disease Information

"""
This file contains structured information about common health conditions.
Each disease has standardized sections for symptoms, causes, treatment, prevention, etc.
"""

DISEASE_INFO = {
    "fever": {
        "name": "Fever",
        "description": "Fever is a temporary increase in your body temperature, often due to an illness.",
        "symptoms": [
            "Temperature above 100.4°F (38°C)",
            "Sweating",
            "Chills and shivering",
            "Headache",
            "Muscle aches",
            "Loss of appetite",
            "Dehydration",
            "General weakness"
        ],
        "causes": [
            "Infections (viral, bacterial)",
            "Inflammatory conditions",
            "Heat exhaustion",
            "Certain medications",
            "Autoimmune disorders"
        ],
        "treatment": [
            "Rest and adequate fluids",
            "Over-the-counter fever reducers (acetaminophen, ibuprofen)",
            "Cool compresses",
            "Light clothing and bedding",
            "Treating underlying causes"
        ],
        "when_to_see_doctor": [
            "Fever above 103°F (39.4°C)",
            "Fever lasting more than three days",
            "Severe headache",
            "Unusual skin rash",
            "Unusual sensitivity to bright light",
            "Stiff neck and pain when bending the head forward",
            "Mental confusion",
            "Persistent vomiting"
        ],
        "prevention": [
            "Regular handwashing",
            "Avoiding close contact with sick people",
            "Keeping immunizations up to date",
            "Maintaining good hygiene"
        ]
    },
    
    "migraine": {
        "name": "Migraine",
        "description": "Migraine is a neurological condition that causes recurring headaches, often with intense throbbing pain on one side of the head.",
        "symptoms": [
            "Throbbing or pulsating pain",
            "Light sensitivity (photophobia)",
            "Sound sensitivity (phonophobia)",
            "Nausea and vomiting",
            "Blurred vision",
            "Aura (visual disturbances, like flashing lights)",
            "Dizziness",
            "Fatigue"
        ],
        "causes": [
            "Genetic factors",
            "Hormonal changes",
            "Certain foods and food additives",
            "Stress",
            "Environmental changes",
            "Medication overuse",
            "Sleep disturbances"
        ],
        "treatment": [
            "Pain-relieving medications (aspirin, ibuprofen, triptans)",
            "Anti-nausea medications",
            "Preventive medications",
            "Stress management",
            "Rest in a quiet, dark room",
            "Cold compresses",
            "Relaxation techniques"
        ],
        "when_to_see_doctor": [
            "Headache worse than previously experienced",
            "Headache that comes on suddenly and is severe",
            "Headache accompanied by fever, stiff neck, confusion, seizures, double vision, weakness, numbness or difficulty speaking",
            "Headache after a head injury",
            "Chronic headaches that worsen after coughing, exertion, or sudden movement"
        ],
        "prevention": [
            "Identifying and avoiding triggers",
            "Maintaining regular sleep schedule",
            "Staying hydrated",
            "Regular exercise",
            "Stress management",
            "Limiting caffeine and alcohol"
        ]
    },
    
    "hypertension": {
        "name": "Hypertension (High Blood Pressure)",
        "description": "Hypertension is a common condition where the long-term force of blood against artery walls is high enough to potentially cause health problems.",
        "symptoms": [
            "Most people have no symptoms (\"silent killer\")",
            "Some may experience headaches",
            "Shortness of breath",
            "Nosebleeds",
            "Dizziness",
            "Chest pain (in severe cases)"
        ],
        "causes": [
            "Age (risk increases with age)",
            "Family history",
            "Obesity",
            "Sedentary lifestyle",
            "Tobacco use",
            "Too much salt in diet",
            "Excessive alcohol consumption",
            "Stress",
            "Chronic conditions (kidney disease, diabetes)"
        ],
        "treatment": [
            "Lifestyle changes (diet, exercise)",
            "Diuretics (water pills)",
            "ACE inhibitors",
            "Angiotensin II receptor blockers",
            "Calcium channel blockers",
            "Beta blockers",
            "Regular monitoring"
        ],
        "when_to_see_doctor": [
            "Regular check-ups to monitor blood pressure",
            "Blood pressure readings consistently above 130/80 mm Hg",
            "Symptoms like severe headache, fatigue, vision problems, chest pain, difficulty breathing",
            "Family history of heart disease"
        ],
        "prevention": [
            "Regular physical activity",
            "Heart-healthy diet (low salt, high in fruits and vegetables)",
            "Maintaining healthy weight",
            "Limiting alcohol consumption",
            "Not smoking",
            "Managing stress",
            "Regular health check-ups"
        ]
    },
    
    "diabetes": {
        "name": "Diabetes",
        "description": "Diabetes is a chronic health condition that affects how your body turns food into energy, characterized by high blood sugar levels.",
        "types": {
            "Type 1": "Immune system attacks insulin-producing cells in the pancreas",
            "Type 2": "Body becomes resistant to insulin or doesn't produce enough",
            "Gestational": "Develops during pregnancy"
        },
        "symptoms": [
            "Increased thirst and urination",
            "Extreme hunger",
            "Unexplained weight loss",
            "Fatigue",
            "Blurred vision",
            "Slow-healing sores",
            "Frequent infections",
            "Tingling or numbness in hands or feet"
        ],
        "causes": [
            "Type 1: Autoimmune reaction",
            "Type 2: Genetic and lifestyle factors",
            "Gestational: Hormonal changes during pregnancy"
        ],
        "treatment": {
            "Type 1": [
                "Insulin therapy",
                "Carbohydrate counting",
                "Regular blood sugar monitoring",
                "Healthy eating and exercise"
            ],
            "Type 2": [
                "Healthy eating and exercise",
                "Blood sugar monitoring",
                "Diabetes medications or insulin therapy",
                "Weight loss if overweight"
            ]
        },
        "when_to_see_doctor": [
            "Symptoms of diabetes",
            "Family history of diabetes",
            "Overweight or obesity",
            "If diagnosed, regular follow-ups"
        ],
        "prevention": [
            "Type 1: Cannot be prevented currently",
            "Type 2 and Gestational:",
            "Maintain healthy weight",
            "Regular physical activity",
            "Eat a balanced diet",
            "Avoid smoking and excessive alcohol"
        ],
        "complications": [
            "Heart disease",
            "Stroke",
            "Kidney damage",
            "Nerve damage",
            "Eye damage",
            "Foot damage",
            "Skin conditions",
            "Hearing impairment"
        ]
    },
    
    "asthma": {
        "name": "Asthma",
        "description": "Asthma is a chronic condition that affects the airways in the lungs, causing inflammation and narrowing that leads to breathing difficulties.",
        "symptoms": [
            "Shortness of breath",
            "Chest tightness or pain",
            "Wheezing when exhaling",
            "Trouble sleeping due to breathing problems",
            "Coughing attacks worsened by respiratory viruses"
        ],
        "triggers": [
            "Airborne allergens (pollen, dust mites, pet dander)",
            "Respiratory infections",
            "Physical activity (exercise-induced asthma)",
            "Cold air",
            "Air pollutants and irritants",
            "Strong emotions and stress",
            "Certain medications (beta blockers, aspirin)",
            "Sulfites in foods and drinks"
        ],
        "treatment": [
            "Quick-relief (rescue) medications",
            "Long-term control medications",
            "Bronchial thermoplasty",
            "Inhalers and nebulizers",
            "Allergy medications if asthma is triggered by allergies",
            "Asthma action plan"
        ],
        "when_to_see_doctor": [
            "Increasing difficulty breathing",
            "No improvement with rescue inhaler",
            "Shortness of breath during minimal activity",
            "To review and update asthma action plan",
            "Emergency: Severe shortness of breath, difficulty talking, blue lips/fingers"
        ],
        "prevention": [
            "Identify and avoid asthma triggers",
            "Take prescribed medications",
            "Monitor breathing and lung function",
            "Identify and treat attacks early",
            "Maintain good overall health",
            "Get vaccinated for pneumonia and influenza"
        ]
    },
    
    "arthritis": {
        "name": "Arthritis",
        "description": "Arthritis is inflammation of one or more joints, causing pain and stiffness that can worsen with age.",
        "types": {
            "Osteoarthritis": "Wear-and-tear damage to joint cartilage",
            "Rheumatoid": "Immune system attacks the lining of joint capsule",
            "Psoriatic": "Joint inflammation related to psoriasis",
            "Gout": "Uric acid crystal buildup in joints"
        },
        "symptoms": [
            "Joint pain",
            "Stiffness",
            "Swelling",
            "Redness",
            "Decreased range of motion",
            "Fatigue and general malaise (in rheumatoid arthritis)"
        ],
        "causes": [
            "Cartilage breakdown",
            "Autoimmune disorders",
            "Joint injuries",
            "Metabolic abnormalities",
            "Infections",
            "Age and family history"
        ],
        "treatment": [
            "Pain medications",
            "Anti-inflammatory drugs",
            "Disease-modifying antirheumatic drugs (for rheumatoid arthritis)",
            "Physical therapy",
            "Exercise and weight management",
            "Joint surgery in severe cases",
            "Heat and cold therapy"
        ],
        "when_to_see_doctor": [
            "Joint pain that doesn't go away after a few days",
            "Joint swelling, redness, and warmth",
            "Joint stiffness, especially in the morning",
            "Difficulty moving a joint"
        ],
        "prevention": [
            "Maintain healthy weight",
            "Regular physical activity",
            "Protect joints from injuries",
            "Balanced diet rich in anti-inflammatory foods",
            "Regular stretching",
            "Good posture"
        ]
    },
    
    "depression": {
        "name": "Depression",
        "description": "Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest, affecting how you feel, think, and behave.",
        "symptoms": [
            "Persistent sad, anxious, or empty mood",
            "Loss of interest in activities once enjoyed",
            "Feelings of hopelessness or pessimism",
            "Decreased energy, fatigue",
            "Difficulty concentrating, remembering, making decisions",
            "Insomnia or oversleeping",
            "Changes in appetite and weight",
            "Thoughts of death or suicide",
            "Physical symptoms like aches or pains without clear cause"
        ],
        "causes": [
            "Brain chemistry imbalances",
            "Hormonal changes",
            "Genetic factors",
            "Biological differences",
            "Life events (trauma, loss, stress)",
            "Personality traits",
            "Medication side effects",
            "Medical conditions"
        ],
        "treatment": [
            "Psychotherapy (talk therapy)",
            "Antidepressant medications",
            "Electroconvulsive therapy (for severe cases)",
            "Transcranial magnetic stimulation",
            "Lifestyle changes",
            "Support groups",
            "Self-care strategies"
        ],
        "when_to_see_doctor": [
            "Symptoms persisting more than two weeks",
            "Difficulty functioning in daily life",
            "Thoughts of harming yourself or others",
            "Depression symptoms alongside other health concerns"
        ],
        "prevention": [
            "Regular physical activity",
            "Maintaining social connections",
            "Getting enough sleep",
            "Healthy diet",
            "Managing stress",
            "Seeking help early for symptoms"
        ],
        "emergency": "If you or someone you know is having suicidal thoughts, get help immediately by calling a suicide hotline (988 in the US) or going to an emergency room."
    },
    
    "gerd": {
        "name": "GERD (Gastroesophageal Reflux Disease)",
        "description": "GERD occurs when stomach acid frequently flows back into the tube connecting your mouth and stomach (esophagus), irritating the esophageal lining.",
        "symptoms": [
            "Heartburn (burning sensation in chest)",
            "Regurgitation of food or sour liquid",
            "Difficulty swallowing",
            "Sensation of a lump in throat",
            "Chronic cough",
            "Disrupted sleep",
            "New or worsening asthma",
            "Chest pain (less common)"
        ],
        "causes": [
            "Weakened lower esophageal sphincter",
            "Hiatal hernia",
            "Slow emptying of the stomach",
            "Obesity",
            "Pregnancy",
            "Connective tissue disorders"
        ],
        "triggers": [
            "Spicy, fatty, or fried foods",
            "Tomato-based products",
            "Citrus fruits",
            "Chocolate and mint",
            "Alcohol and caffeine",
            "Large meals",
            "Eating close to bedtime",
            "Smoking"
        ],
        "treatment": [
            "Lifestyle changes",
            "Over-the-counter antacids",
            "H-2-receptor blockers",
            "Proton pump inhibitors",
            "Surgery in severe cases"
        ],
        "when_to_see_doctor": [
            "Frequent or severe heartburn",
            "Difficulty swallowing",
            "Persistent nausea or vomiting",
            "Weight loss due to poor appetite or difficulty eating",
            "Over-the-counter medications don't provide relief"
        ],
        "prevention": [
            "Maintain healthy weight",
            "Avoid trigger foods",
            "Eat smaller meals",
            "Don't lie down after eating",
            "Elevate head of bed",
            "Quit smoking",
            "Avoid tight clothing"
        ],
        "complications": [
            "Esophagitis (inflammation of esophagus)",
            "Esophageal stricture (narrowing)",
            "Barrett's esophagus (precancerous changes)",
            "Esophageal cancer (rare)"
        ]
    },
    
    "allergies": {
        "name": "Allergies",
        "description": "Allergies occur when your immune system reacts to a foreign substance as if it were harmful, producing antibodies that cause allergic reactions.",
        "types": {
            "Seasonal": "Pollen from trees, grasses, weeds",
            "Food": "Common triggers include nuts, dairy, eggs, shellfish",
            "Drug": "Reactions to medications",
            "Insect": "Bee stings, wasp venom",
            "Contact": "Reactions to substances touching skin",
            "Pet": "Animal dander, saliva, urine"
        },
        "symptoms": [
            "Sneezing and runny nose",
            "Itchy, watery eyes",
            "Coughing, wheezing, shortness of breath",
            "Skin rash, hives, or eczema",
            "Swelling of lips, tongue, face, or throat",
            "Digestive problems (for food allergies)",
            "Anaphylaxis (severe, life-threatening reaction)"
        ],
        "treatment": [
            "Avoiding allergens",
            "Antihistamines",
            "Decongestants",
            "Corticosteroids",
            "Mast cell stabilizers",
            "Allergy shots (immunotherapy)",
            "Emergency epinephrine (for severe reactions)"
        ],
        "when_to_see_doctor": [
            "Symptoms interfering with daily activities",
            "Over-the-counter medications not providing relief",
            "Multiple allergies suspected",
            "To identify specific allergens",
            "Emergency: severe allergic reaction symptoms like difficulty breathing, swelling of face/throat"
        ],
        "prevention": [
            "Identify and avoid known allergens",
            "Keep track of symptoms and triggers",
            "Wear medical alert bracelet if severe allergies",
            "Clean home regularly to reduce allergens",
            "Use air purifiers",
            "Keep windows closed during high pollen seasons"
        ]
    },
    
    "common_cold": {
        "name": "Common Cold",
        "description": "The common cold is a viral infection of the upper respiratory tract, including the nose and throat.",
        "symptoms": [
            "Runny or stuffy nose",
            "Sore throat",
            "Cough",
            "Congestion",
            "Slight body aches or mild headache",
            "Sneezing",
            "Low-grade fever",
            "Generally feeling unwell (malaise)"
        ],
        "causes": [
            "Rhinoviruses (most common)",
            "Coronavirus (not COVID-19)",
            "RSV (respiratory syncytial virus)",
            "Other respiratory viruses"
        ],
        "treatment": [
            "Rest and hydration",
            "Over-the-counter pain relievers",
            "Decongestants",
            "Cough syrups",
            "Throat lozenges",
            "Saline nasal drops",
            "Humidifier or steam inhalation"
        ],
        "when_to_see_doctor": [
            "Fever above 101.3°F (38.5°C)",
            "Fever lasting five days or more or returning after being gone",
            "Shortness of breath",
            "Severe sore throat, headache or sinus pain",
            "Symptoms that worsen or last more than 10 days"
        ],
        "prevention": [
            "Frequent handwashing",
            "Avoid close contact with sick people",
            "Don't share utensils or drinking glasses",
            "Clean frequently touched surfaces",
            "Use tissues when sneezing or coughing",
            "Maintain healthy habits (diet, exercise, sleep)"
        ],
        "duration": "7-10 days typically, though some symptoms might linger for up to 2 weeks"
    }
}

def get_disease_info(disease_key):
    """
    Returns formatted information about a specific disease
    """
    if disease_key not in DISEASE_INFO:
        return f"I don't have specific information about {disease_key}. Please ask about one of the following conditions: " + ", ".join(DISEASE_INFO.keys())
    
    disease = DISEASE_INFO[disease_key]
    
    # Format the response with emoji indicators
    response = f"# {disease['name']} 🔍\n\n"
    response += f"{disease['description']}\n\n"
    
    # Add symptoms section
    response += "## Symptoms 🌡️\n"
    for symptom in disease['symptoms']:
        response += f"- {symptom}\n"
    response += "\n"
    
    # Add causes or triggers section
    if 'causes' in disease:
        response += "## Causes 🔍\n"
        if isinstance(disease['causes'], list):
            for cause in disease['causes']:
                response += f"- {cause}\n"
        else:
            response += disease['causes'] + "\n"
        response += "\n"
    
    if 'triggers' in disease:
        response += "## Triggers 🔍\n"
        for trigger in disease['triggers']:
            response += f"- {trigger}\n"
        response += "\n"
    
    # Add treatment section
    response += "## Treatment 💊\n"
    if isinstance(disease['treatment'], list):
        for treatment in disease['treatment']:
            response += f"- {treatment}\n"
    elif isinstance(disease['treatment'], dict):
        for type_name, treatments in disease['treatment'].items():
            response += f"### {type_name}\n"
            if isinstance(treatments, list):
                for item in treatments:
                    response += f"- {item}\n"
            else:
                response += f"- {treatments}\n"
    else:
        response += disease['treatment'] + "\n"
    response += "\n"
    
    # Add when to see doctor section
    response += "## When to See a Doctor 👨‍⚕️\n"
    for condition in disease['when_to_see_doctor']:
        response += f"- {condition}\n"
    response += "\n"
    
    # Add prevention section
    response += "## Prevention ⚠️\n"
    if isinstance(disease['prevention'], list):
        for prevention in disease['prevention']:
            response += f"- {prevention}\n"
    else:
        response += disease['prevention'] + "\n"
    
    # Add emergency info if available
    if 'emergency' in disease:
        response += f"\n## ⚠️ EMERGENCY INFORMATION ⚠️\n{disease['emergency']}\n"
    
    return response