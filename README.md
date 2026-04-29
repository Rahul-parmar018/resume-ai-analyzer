<div align="center">
  <img src="https://img.icons8.com/fluency/96/artificial-intelligence.png" alt="Candidex AI Logo"/>
  <h1>Candidex AI</h1>
  <p><strong>The Next-Generation Neural Hiring & Applicant Tracking Engine</strong></p>

  [![React](https://img.shields.io/badge/React-18-blue.svg?style=flat&logo=react)](https://reactjs.org/)
  [![Django](https://img.shields.io/badge/Django-5.2-green.svg?style=flat&logo=django)](https://www.djangoproject.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28.svg?style=flat&logo=firebase)](https://firebase.google.com/)
</div>

<br/>

Candidex AI is a modern, dual-sided AI platform built to bridge the gap between job seekers and recruiters. By utilizing deep semantic matching and neural vector analysis, it transforms the hiring process from a manual reading task into a high-speed data decision workflow.

## ✨ Dual-Sided Platform

### 👨‍💻 For Candidates (Resume Optimizer)
Stop guessing what ATS systems want. Candidex acts as your personal AI career coach.
*   **ATS Compatibility Scoring**: Instantly check if your resume parses correctly.
*   **Neural Gap Analysis**: Detect missing keywords and critical skills compared to target job descriptions.
*   **Readability & Impact Metrics**: Analyze text complexity and action-verb density.
*   **Real-time Fixes**: Get line-by-line rewrite suggestions to increase your hiring probability.

### 👔 For Recruiters (Bulk Decision Engine)
A high-density, professional tool layout designed for scanning massive batches of resumes in seconds.
*   **Batch Processing**: Upload batches of PDFs/DOCXs and rank them simultaneously.
*   **High-Density Grid Layout**: Compare candidates side-by-side with a 4-column, compact card view.
*   **Instant Strengths & Gaps**: Visual chips immediately highlight what a candidate has (✔) and what they lack (❌).
*   **Neural Sorting**: Sort by "Match Score" to instantly find the top 1% of applicants.

---

## 🛠️ Technology Stack

Candidex AI is built with a modern, decoupled architecture separating the high-performance React UI from the heavy Python ML processing.

**Frontend (Client)**
*   **Framework**: React 18 powered by Vite
*   **Styling**: TailwindCSS & Framer Motion for premium, glassmorphic UI/UX
*   **State Management**: Zustand
*   **Routing**: React Router DOM v6
*   **Hosting**: Vercel

**Backend (API)**
*   **Framework**: Django & Django REST Framework (Python 3.11+)
*   **AI/NLP Core**: OpenAI API, NLTK, TextStat
*   **Document Processing**: PDFplumber, PyPDF2, python-docx
*   **Authentication**: Firebase Admin SDK (JWT verification)
*   **Hosting**: Render

---

## 🚀 Local Development Setup

To run Candidex AI locally, you need to spin up both the Django backend and the Vite frontend.

### 1. Backend Setup (Django)

```bash
# Clone the repository
git clone https://github.com/Rahul-parmar018/resume-ai-analyzer.git
cd resume-ai-analyzer

# Create and activate a virtual environment
python -m venv .venv
# Windows: .\.venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file based on .env.example
# Ensure you add your OPENAI_API_KEY and Firebase Admin SDK JSON paths
cp .env.example .env

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```
*The backend will run on `http://127.0.0.1:8000`*

### 2. Frontend Setup (React/Vite)

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 🔐 Environment Variables

You will need the following API keys and configurations to run the project fully:

**Backend (`/.env`)**
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
OPENAI_API_KEY=sk-your-openai-api-key
FIREBASE_CREDENTIALS_BASE64=your-base64-encoded-firebase-adminsdk.json
```

**Frontend (`/frontend/.env`)**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_API_URL=http://localhost:8000/api
```

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/neural-sorting`)
3. Commit your changes (`git commit -m 'feat: added neural sorting capability'`)
4. Push to the branch (`git push origin feature/neural-sorting`)
5. Open a Pull Request

---

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <p>Engineered by <a href="https://github.com/Rahul-parmar018">Rahul Parmar</a></p>
</div>
