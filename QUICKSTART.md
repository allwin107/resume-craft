# Quick Start Guide

## First Time Setup

### 1. Install Prerequisites

**PostgreSQL:**
- Download from https://www.postgresql.org/download/
- Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

**Python & Node.js:**
- Python 3.9+: https://www.python.org/downloads/
- Node.js 18+: https://nodejs.org/

### 2. Get Your Groq API Key

1. Visit https://console.groq.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll need this for setup)

### 3. Setup Backend

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create and configure .env
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux
```

Edit `.env` file:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_analyzer
SECRET_KEY=your-secret-key-here-generate-a-random-string
GROQ_API_KEY=your-groq-api-key-here
```

### 4. Setup Database

```bash
# Create database
createdb resume_analyzer

# Or using psql
psql -U postgres
CREATE DATABASE resume_analyzer;
\q
```

### 5. Setup Frontend

```bash
cd frontend
npm install

copy .env.local.example .env.local  # Windows
cp .env.local.example .env.local    # macOS/Linux
```

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
# Activate venv if not already
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 8. Create Your First Account

1. Click "Get Started" on the landing page
2. Fill in your details
3. Click "Create Account"
4. You'll be automatically logged in

### 9. Analyze Your First Resume

1. Go to "Analyze" page
2. Upload your resume (PDF or DOCX)
3. Paste a job description
4. Click "Analyze Resume"
5. View your results!

## Common Issues

### "Database connection failed"
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env

### "Module not found" errors
- Make sure you installed dependencies: `pip install -r requirements.txt`
- Ensure virtual environment is activated

### "GROQ_API_KEY not found"
- Verify your .env file exists in backend/
- Check that GROQ_API_KEY is set correctly

### Frontend won't start
- Make sure you're in the frontend directory
- Try deleting node_modules and running `npm install` again
- Check if port 3000 is already in use

## Next Steps

- Explore the dashboard
- Check your analysis history
- Update your profile
- Try the AI resume improver feature!

## Need Help?

Check the main README.md for detailed documentation or create an issue on GitHub.
