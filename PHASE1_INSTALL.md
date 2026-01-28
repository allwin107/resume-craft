# Phase 1 - Installation Instructions

## PowerShell Execution Policy Issue

Since PowerShell has execution policy restrictions, please use **Command Prompt (CMD)** instead.

## Installation Steps

1. Open **Command Prompt** (not PowerShell)
2. Navigate to the frontend directory:
   ```cmd
   cd C:\Users\admin\Projects\resume-analyzer\frontend
   ```

3. Install the dependencies:
   ```cmd
   npm install react-syntax-highlighter @types/react-syntax-highlighter react-joyride
   ```

4. After installation, commit and push:
   ```cmd
   cd ..
   git add frontend/package.json frontend/package-lock.json
   git commit -m "Add dependencies for Phase 1 UX enhancements"
   git push
   ```

## What These Dependencies Do

- **react-syntax-highlighter**: Provides syntax highlighting for LaTeX preview
- **@types/react-syntax-highlighter**: TypeScript types
- **react-joyride**: Interactive tutorial/onboarding (for next feature)

## After Installation

Once installed and pushed, Vercel will automatically redeploy with the new features:
- ✅ Loading progress indicators
- ✅ LaTeX preview modal
- ⏳ Example resumes (creating next)
- ⏳ Onboarding tutorial (creating next)
