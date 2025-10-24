# Resume AI Analyzer (Django)

An AI-powered web application that analyzes, reviews, and scores resumes using machine learning and natural language processing. Get instant feedback on your resume's ATS compatibility, readability, and job-role matching.

## ✨ Features

- **📄 Multi-format Support**: Upload PDF and DOCX resume files
- **🤖 AI-Powered Analysis**: Intelligent scoring and improvement suggestions
- **🎯 Job-Role Matching**: Match your resume against specific job requirements
- **📊 Detailed Scoring**: Get comprehensive feedback on various resume aspects
- **📱 Responsive Design**: Modern, mobile-friendly Django front-end
- **⚡ Real-time Processing**: Fast analysis with rate limiting for optimal performance

## 🛠️ Tech Stack

- **Backend**: Django 5.2.7 | Python 3.11+
- **AI Integration**: OpenAI API | Google Generative AI
- **File Processing**: PDFplumber | PyPDF2 | python-docx
- **Frontend**: HTML5 | CSS3 | JavaScript | Bootstrap 5
- **Database**: SQLite (development) | PostgreSQL (production ready)
- **Text Analysis**: NLTK | TextStat

## 🚀 Quick Start

### Prerequisites
- Python 3.11 or higher
- Git
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahul-parmar018/resume-ai-analyzer.git
   cd resume-ai-analyzer
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   
   # Windows
   .\.venv\Scripts\activate
   
   # Linux/macOS
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your API keys
   OPENAI_API_KEY=your_openai_api_key_here
   SECRET_KEY=your-secret-key-here
   ```

5. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

6. **Start the development server**
   ```bash
   python manage.py runserver
   ```

7. **Open your browser**
   Navigate to `http://127.0.0.1:8000/`

## 📁 Project Structure

```
resume_ai_app/
├── core/                    # Django project settings
│   ├── settings.py         # Main configuration
│   ├── urls.py            # URL routing
│   └── wsgi.py            # WSGI configuration
├── resumes/                # Main app
│   ├── models.py          # Database models
│   ├── views.py           # View logic
│   ├── utils/             # Utility functions
│   │   ├── checker.py     # Resume scoring logic
│   │   ├── matcher.py     # Job matching
│   │   └── text_extract.py # File parsing
│   ├── templates/         # HTML templates
│   └── static/           # CSS, JS, images
├── media/                 # Uploaded files
├── .env                   # Environment variables (not in repo)
├── .env.example          # Environment template
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# API Keys
OPENAI_API_KEY=your_openai_api_key_here
```

### Rate Limiting
The application includes built-in rate limiting:
- 60 requests per minute (configurable)
- 20 requests per minute for API endpoints

## 📊 Features in Detail

### Resume Analysis
- **ATS Compatibility**: Check if your resume passes Applicant Tracking Systems
- **Readability Score**: Analyze text complexity and readability
- **Keyword Matching**: Identify relevant skills and keywords
- **Format Validation**: Ensure proper resume structure

### AI-Powered Suggestions
- **Improvement Recommendations**: Get specific advice on how to enhance your resume
- **Content Optimization**: Suggestions for better word choice and phrasing
- **Structure Analysis**: Feedback on resume organization and flow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Django community for the excellent framework
- OpenAI for AI capabilities
- Contributors and testers

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation
- Review the troubleshooting section

---

**Made with ❤️ by [Rahul Parmar](https://github.com/Rahul-parmar018)**
