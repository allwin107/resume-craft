# ResumeCraft - AI-Powered Resume Optimization Tool

Craft the Perfect Resume - An intelligent platform that uses AI to optimize resumes for job descriptions, providing detailed match scores, skills gap analysis, and personalized improvement suggestions with professional LaTeX output.

## ✨ Features

- **AI-Powered Analysis**: Advanced resume-JD matching using Groq AI
- **Match Scoring**: Precise 0-100% compatibility score
- **Skills Gap Detection**: Identify matched and missing skills
- **Keyword Analysis**: Track important keywords present and absent
- **Improvement Suggestions**: Actionable, priority-ranked recommendations
- **AI Resume Editor**: Automatically improve resumes based on JD gaps
- **LaTeX Generation**: Professional resume templates in LaTeX format
- **PDF Compilation**: Both local and online LaTeX compilation support
- **User Authentication**: Secure JWT-based authentication
- **Analysis History**: Track and review past analyses
- **Modern UI**: Beautiful, responsive interface with smooth animations

## 🛠️ Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **PostgreSQL** - Robust relational database
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Groq AI** - Advanced AI analysis
- **JWT** - Secure authentication
- **PyPDF2 & python-docx** - Resume parsing
- **PyLaTeX** - LaTeX document generation

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 13+
- pdflatex (optional, for local PDF compilation)
- Groq API Key

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resume-craft.git
cd resume-craft
```

### 2. Database Setup

Install PostgreSQL and create a database:

```bash
# Using PostgreSQL CLI
createdb resumecraft

# Or using psql
psql -U postgres
CREATE DATABASE resumecraft;
\q
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env and add your configuration:
# - DATABASE_URL: Your PostgreSQL connection string
# - GROQ_API_KEY: Your Groq API key
# - SECRET_KEY: Generate a secure random key
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
copy .env.local.example .env.local  # Windows
cp .env.local.example .env.local    # macOS/Linux

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. LaTeX Installation (Optional)

For local PDF compilation:

**Windows:**
```bash
# Download and install MiKTeX or TeX Live
# https://miktex.org/download
# https://www.tug.org/texlive/
```

**macOS:**
```bash
brew install --cask mactex
```

**Linux:**
```bash
sudo apt-get install texlive-full  # Ubuntu/Debian
sudo yum install texlive-scheme-full  # CentOS/RHEL
```

If you don't want to install LaTeX locally, the system will automatically use the free online LaTeX.Online service.

## 🏃 Running the Application

### Start Backend

```bash
cd backend
# Make sure virtual environment is activated
python -m uvicorn app.main:app --reload

# Backend will be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Start Frontend

```bash
cd frontend
npm run dev

# Frontend will be available at http://localhost:3000
```

## 📖 Usage Guide

### 1. Create an Account
- Navigate to http://localhost:3000
- Click "Get Started" or "Sign Up"
- Fill in your details and create an account

### 2. Analyze Your Resume
- Log in to your account
- Click "New Analysis" or navigate to the Analyze page
- Upload your resume (PDF or DOCX, max 10MB)
- Paste the job description
- Optionally add job title and company name
- Click "Analyze Resume"

### 3. View Results
- Match Score: See your compatibility percentage
- Matched Skills: Skills you have that match the JD
- Missing Skills: Skills mentioned in JD but not in your resume
- Matched/Missing Keywords: Important keywords analysis
- Improvement Suggestions: Priority-ranked actionable tips
- Summary: Comprehensive AI-generated analysis

### 4. Improve Your Resume
- Click "Generate Improved Resume" on the results page
- AI will automatically enhance your resume based on the gaps
- Download the improved resume in LaTeX or PDF format

### 5. Track Your Progress
- View all past analyses in the History page
- Search and filter your analysis history
- Compare your match scores over time

## 🗂️ Project Structure

```
resume-craft/
├── backend/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth_routes.py
│   │   │   ├── profile_routes.py
│   │   │   ├── analysis_routes.py
│   │   │   └── download_routes.py
│   │   ├── auth/             # Authentication logic
│   │   ├── database/         # Database models and connection
│   │   ├── services/         # Business logic services
│   │   │   ├── resume_parser.py
│   │   │   ├── groq_analyzer.py
│   │   │   ├── latex_service.py
│   │   │   └── resume_editor.py
│   │   ├── config.py         # Configuration management
│   │   └── main.py           # FastAPI application
│   ├── uploads/              # File uploads storage
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── (dashboard)/      # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── analyze/
│   │   │   ├── analysis/[id]/
│   │   │   ├── history/
│   │   │   └── profile/
│   │   ├── context/          # React contexts
│   │   ├── login/
│   │   ├── register/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # Landing page
│   ├── components/           # Reusable components
│   ├── package.json
│   └── .env.local.example
│
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resumecraft

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Groq AI
GROQ_API_KEY=your-groq-api-key-here
GROQ_MODEL=mixtral-8x7b-32768

# LaTeX
LATEX_MODE=local  # local or online
LATEX_ONLINE_URL=https://latexonline.cc/compile

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation (Swagger UI).

### Key Endpoints:

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

**Profile:**
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/history` - Get analysis history

**Analysis:**
- `POST /api/analyze` - Upload resume and JD for analysis
- `GET /api/analyze/{id}` - Get specific analysis
- `POST /api/analyze/improve` - Generate improved resume

**Downloads:**
- `GET /api/download/latex/{id}` - Download LaTeX source
- `GET /api/download/pdf/{id}` - Download improved PDF
- `GET /api/download/original/{id}` - Download original resume

## 🎨 UI Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Glassmorphism Effects**: Modern, premium UI design
- **Smooth Animations**: Subtle micro-animations for better UX
- **Drag & Drop**: Intuitive file upload experience
- **Color-Coded Results**: Visual indicators for match quality
- **Real-time Validation**: Instant feedback on user input

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Verify database exists
psql -l | grep resumecraft

# Test connection
psql -U postgres -d resumecraft
```

### LaTeX Compilation Fails
```bash
# Check if pdflatex is installed
pdflatex --version

# If not installed, the system will automatically use online compilation
# Or install LaTeX distribution as mentioned in Prerequisites
```

### Frontend Can't Connect to Backend
- Ensure backend is running on port 8000
- Check CORS_ORIGINS in backend .env
- Verify NEXT_PUBLIC_API_URL in frontend .env.local

### Groq API Errors
- Verify your API key is correct
- Check your Groq API quota/limits
- Ensure you're using a supported model

## 🔒 Security Notes

- Never commit `.env` files to version control
- Change the `SECRET_KEY` in production
- Use strong passwords for database
- Keep Groq API key secure
- Implement rate limiting in production
- Use HTTPS in production environment

## 🚀 Production Deployment

For production deployment:

1. Use environment-specific `.env` files
2. Set up proper database with connection pooling
3. Configure CORS for your domain
4. Use a production-grade web server (Gunicorn/uWSGI)
5. Set up SSL/TLS certificates
6. Implement proper logging and monitoring
7. Use a CDN for static assets
8. Set up database backups

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**ResumeCraft** - Craft the Perfect Resume with AI

Built with ❤️ using FastAPI, Next.js, and Groq AI
