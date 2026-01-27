import json
from typing import Dict
from groq import Groq
from app.config import settings
from app.services.latex_service import LaTeXService


class ResumeEditor:
    """AI-powered resume editor that improves resume based on job description"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL
        self.latex_service = LaTeXService()
    
    def improve_resume_content(self, resume_text: str, jd_text: str, 
                               missing_skills: list, missing_keywords: list) -> Dict:
        """
        Use AI to improve resume content based on JD and identified gaps
        Returns structured data for LaTeX generation
        """
        
        prompt = f"""You are an expert resume writer. Improve the following resume to better match the job description.

CURRENT RESUME:
{resume_text}

JOB DESCRIPTION:
{jd_text}

IDENTIFIED GAPS:
- Missing Skills: {', '.join(missing_skills)}
- Missing Keywords: {', '.join(missing_keywords)}

Improve the resume by:
1. Incorporating missing keywords naturally
2. Highlighting relevant skills and experience
3. Rewriting experience bullets to be more impactful
4. Adding relevant projects or certifications if applicable
5. Optimizing for ATS (Applicant Tracking Systems)

Provide the improved resume in structured JSON format:
{{
    "name": "<full name>",
    "contact_info": "<phone, email, location, LinkedIn, GitHub, portfolio - in LaTeX format>",
    "objective": "<improved career objective aligned with JD>",
    "experience": "<LaTeX formatted experience section>",
    "technical_skills": "<comma-separated technical skills>",
    "soft_skills": "<comma-separated soft skills>",
    "projects": "<LaTeX formatted projects>",
    "education": "<LaTeX formatted education>",
    "certifications": "<LaTeX formatted certifications>"
}}

Use proper LaTeX formatting for bullets (\\item), bold (\\textbf{{}}), dates (\\hfill), etc.
Return ONLY the JSON object."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert resume writer. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=4000
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # Extract JSON - find the outermost braces
            json_start = result_text.find('{')
            json_end = result_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                result_text = result_text[json_start:json_end]
            
            # Parse JSON with strict=False to handle control characters
            try:
                improved_data = json.loads(result_text, strict=False)
            except json.JSONDecodeError:
                # If parsing fails, try cleaning control characters
                import re
                # Replace unescaped control characters
                cleaned_text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', result_text)
                improved_data = json.loads(cleaned_text, strict=False)
            
            return improved_data
            
        except json.JSONDecodeError as e:
            raise Exception(f"Error parsing AI response: {str(e)}")
        except Exception as e:
            raise Exception(f"Error improving resume: {str(e)}")
    
    def generate_improved_resume(self, resume_text: str, jd_text: str,
                                 missing_skills: list, missing_keywords: list) -> tuple:
        """
        Generate improved resume in LaTeX format
        Returns: (latex_content, pdf_path)
        """
        # Get improved content from AI
        improved_data = self.improve_resume_content(resume_text, jd_text, 
                                                     missing_skills, missing_keywords)
        
        # Generate LaTeX from improved data
        latex_content = self.latex_service.generate_latex_from_template(improved_data)
        
        # Compile to PDF
        pdf_path = self.latex_service.compile_latex(latex_content)
        
        return latex_content, pdf_path
