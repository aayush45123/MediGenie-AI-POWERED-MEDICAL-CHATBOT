// Doctors data array
const doctor = [
  {
    id: 1,
    name: "Dr. Samir Vinayak Joshi",
    department: "ENT",
    designation: "Dean Principal",
    qualification: "M.S. (OTO-RHINO-LARYNGOLOGY)",
    registration: "70452, Maharashtra Medical Council",
    image: "../doctorsImg/sameer.png", // Updated to PNG
    specialty: "Otorhinolaryngology",
    location: "Main Campus"
  },
  {
    id: 2,
    name: "Dr. Minu Ramakrishnan",
    department: "OPHTHALMOLOGY",
    designation: "Medical Superintendent & Professor",
    qualification: "Diplomate of National Board (OPHTHALMOLOGY)",
    registration: "86277, Maharashtra Medical Council",
    image: "../doctorsImg/minu.png",
    specialty: "Ophthalmology",
    location: "Main Campus"
  },
  {
    id: 3,
    name: "Dr. Sharadkumar Pralhad Sawant",
    department: "ANATOMY",
    designation: "Professor",
    qualification: "M.S. (ANATOMY)",
    registration: "72755, Maharashtra Medical Council",
    image: "../doctorsImg/sharadhkumar.png",
    specialty: "Anatomy",
    location: "Anatomy Department"
  },
  {
    id: 4,
    name: "Dr. Shaguphta Tasnim Shaikh",
    department: "ANATOMY",
    designation: "Associate Professor",
    qualification: "M.D. (ANATOMY)",
    registration: "2002/04/2113, Maharashtra Medical Council",
    image: "../doctorsImg/shagupta.png",
    specialty: "Anatomy",
    location: "Anatomy Department"
  },
  {
    id: 5,
    name: "Dr. Suruchi Singhal",
    department: "ANATOMY",
    designation: "Assistant Professor",
    qualification: "M.D. (ANATOMY)",
    registration: "2005052832, Maharashtra Medical Council",
    image: "../doctorsImg/suruchi.png",
    specialty: "Anatomy",
    location: "Anatomy Department"
  },
  {
    id: 6,
    name: "Dr. Shaheen Sajid Abbas Rizvi",
    department: "ANATOMY",
    designation: "Assistant Professor",
    qualification: "M.D. (ANATOMY)",
    registration: "73065, Maharashtra Medical Council",
    image: "../doctorsImg/shaheen.png",
    specialty: "Anatomy",
    location: "Anatomy Department"
  },
  // Physiology Department
  {
    id: 7,
    name: "Dr. Shobha Ganesh Kini",
    department: "PHYSIOLOGY",
    designation: "Professor & HOD",
    qualification: "MBBS, M.D. (Physiology)",
    registration: "MMC No.64028, Maharashtra Medical Council",
    image: "../doctorsImg/shobha.png",
    specialty: "Physiology",
    location: "Physiology Department"
  },
  {
    id: 8,
    name: "Dr. Sneha Mahadev Bhatkar",
    department: "PHYSIOLOGY",
    designation: "Associate Professor",
    qualification: "MBBS, M.D. (Physiology), DNB (Physiology)",
    registration: "MMC No.2015/05/2770, Maharashtra Medical Council",
    image: "../doctorsImg/sneha.png",
    specialty: "Physiology",
    location: "Physiology Department"
  },
  // Biochemistry Department
  {
    id: 9,
    name: "Dr. Aditya Balakrishna Sathe",
    department: "BIOCHEMISTRY",
    designation: "Professor & HOD",
    qualification: "MBBS, M.D.(Med. Bioch.), DNB (Med. Bioch.)",
    registration: "83861, Maharashtra Medical Council",
    image: "../doctorsImg/aditya.png",
    specialty: "Biochemistry",
    location: "Biochemistry Department"
  },
  // Pathology Department
  {
    id: 10,
    name: "Dr. Kalpana Ashish Hajirnis",
    department: "PATHOLOGY",
    designation: "Professor",
    qualification: "MBBS, MD (Pathology)",
    registration: "69068, Maharashtra Medical Council",
    image: "../doctorsImg/kalpana.png",
    specialty: "Pathology",
    location: "Pathology Department"
  },
  // General Medicine Department
  {
    id: 11,
    name: "Dr. Niharika Harendra Gill",
    department: "GENERAL MEDICINE",
    designation: "Professor & HOD",
    qualification: "MBBS, MD (General Medicine)",
    registration: "56028, Maharashtra Medical Council",
    image: "../doctorsImg/niharika.png",
    specialty: "Internal Medicine",
    location: "Medicine Department"
  },
  // Dermatology Department
  {
    id: 12,
    name: "Dr. Shital Ashok Poojary",
    department: "DERMATOLOGY",
    designation: "Professor & HOD",
    qualification: "MBBS, MD, DNB, FCPS, DDV (DERMATOLOGY, VENEREOLOGY AND LEPROSY)",
    registration: "79720, Maharashtra Medical Council",
    image: "../doctorsImg/shital.png",
    specialty: "Dermatology",
    location: "Dermatology Department"
  },
  // Psychiatry Department
  {
    id: 13,
    name: "Dr. Bindoo Jadhav",
    department: "PSYCHIATRY",
    designation: "Professor & HOD",
    qualification: "MBBS, MD (Psychiatry), DPM",
    registration: "71584 MMC",
    image: "../doctorsImg/bindoo.png",
    specialty: "Psychiatry",
    location: "Psychiatry Department"
  },
  // General Surgery Department
  {
    id: 14,
    name: "Dr. Rajeev Rajaninath Satoskar",
    department: "GENERAL SURGERY",
    designation: "Professor & HOD",
    qualification: "MBBS, MS (General Surgery)",
    registration: "48893, Maharashtra Medical Council",
    image: "../doctorsImg/rajeev.png",
    specialty: "General Surgery",
    location: "Surgery Department"
  },
  // Neurosurgery
  {
    id: 15,
    name: "Dr. Atul Goel",
    department: "NEUROSURGERY",
    designation: "Professor",
    qualification: "MBBS, MCh Neurosurgery",
    registration: "48918, Maharashtra Medical Council",
    image: "../doctorsImg/atul.png",
    specialty: "Neurosurgery",
    location: "Neurosurgery Department"
  },
  // Orthopedics
  {
    id: 16,
    name: "Dr. Naushad Hussain",
    department: "ORTHOPEDICS",
    designation: "Professor & HOD",
    qualification: "MBBS, MS (Orthopaedics)",
    registration: "67639 MMC",
    image: "../doctorsImg/naushad.png",
    specialty: "Orthopedics",
    location: "Orthopedics Department"
  },
  // ENT Department
  {
    id: 17,
    name: "Dr. Dinesh Shrikrishna Vaidya",
    department: "ENT",
    designation: "Professor",
    qualification: "M.S. (OTO-RHINO-LARYNGOLOGY)",
    registration: "55098, Maharashtra Medical Council",
    image: "../doctorsImg/dinesh.png",
    specialty: "Otorhinolaryngology",
    location: "ENT Department"
  },
  // Ophthalmology
  {
    id: 18,
    name: "Dr. Omkar Jagdish Telang",
    department: "OPHTHALMOLOGY",
    designation: "Professor & HOD",
    qualification: "M.S. (OPHTHALMOLOGY)",
    registration: "2000/03/1560, Maharashtra Medical Council",
    image: "../doctorsImg/omkar.png",
    specialty: "Ophthalmology",
    location: "Ophthalmology Department"
  },
  // Radiology
  {
    id: 19,
    name: "Dr. Chandrakant Manmath Shetty",
    department: "RADIOLOGY",
    designation: "Professor",
    qualification: "MBBS, MD (Radio diagnosis)",
    registration: "72946, Maharashtra Medical Council",
    image: "../doctorsImg/chandrakanth.png",
    specialty: "Radiology",
    location: "Radiology Department"
  },
  // Respiratory Medicine
  {
    id: 20,
    name: "Dr. Mugdha Ashok Bhide",
    department: "RESPIRATORY MEDICINE",
    designation: "Associate Professor & HOD",
    qualification: "MBBS, MD (Respiratory Medicine)",
    registration: "2005/04/2381, Maharashtra Medical Council",
    image: "../doctorsImg/mugdha.png",
    specialty: "Pulmonology",
    location: "Pulmonology Department"
  },
  // Anesthesia
  {
    id: 21,
    name: "Dr. Preeti More",
    department: "ANESTHESIA",
    designation: "Professor & HOD",
    qualification: "MBBS, MD (Anaesthesiology)",
    registration: "75110, Maharashtra Medical Council",
    image: "../doctorsImg/preeti.png",
    specialty: "Anesthesiology",
    location: "Anesthesia Department"
  },
  // Pediatrics
  {
    id: 22,
    name: "Dr. Mukesh Agrawal",
    department: "PEDIATRICS",
    designation: "Professor & Head of Department",
    qualification: "MBBS, MD(Peds)",
    registration: "BMC 6366, MMC 67687",
    image: "../doctorsImg/mukesh.png",
    specialty: "Pediatrics",
    location: "Pediatrics Department"
  },
  // Dental
  {
    id: 23,
    name: "Dr. Bipin Upadhyay",
    department: "DENTAL",
    designation: "Associate Professor",
    qualification: "BDS, MDS",
    registration: "A-13123, Maharashtra State Dental Council",
    image: "../doctorsImg/bipin.png",
    specialty: "Dental Surgery",
    location: "Dental Department"
  },
  // Obstetrics and Gynecology
  {
    id: 24,
    name: "Dr. Pundalik Sonawane",
    department: "OBSTETRICS AND GYNAECOLOGY",
    designation: "Professor & HOD",
    qualification: "MBBS MD DNB DGO FCPS DFP",
    registration: "83279 MMC",
    image: "../doctorsImg/pundalik.png",
    specialty: "Obstetrics & Gynecology",
    location: "OBGYN Department"
  },
  // Physical Medicine and Rehabilitation
  {
    id: 25,
    name: "Dr. Vivek Chawathe",
    department: "PHYSICAL MEDICINE AND REHABILITATION",
    designation: "Associate Professor & HOD",
    qualification: "MBBS, MS",
    registration: "2007/04/0906 MMC",
    image: "../doctorsImg/vivek.png",
    specialty: "Physical Medicine",
    location: "PMR Department"
  }
];