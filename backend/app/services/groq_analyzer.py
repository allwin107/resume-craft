import json
from typing import Dict, List
from groq import Groq
from app.config import settings


class GroqAnalyzer:
    """AI-powered resume and job description analyzer using Groq"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL
    
    def analyze_resume_jd_match(self, resume_text: str, jd_text: str) -> Dict:
        """
        Analyze resume against job description and provide detailed insights
        Returns: match score, skills analysis, keywords, improvements, and summary
        """
        
        prompt = f"""You are an expert resume analyzer and career consultant. Analyze the following resume against the job description and provide a comprehensive analysis.

RESUME:
{resume_text}

JOB DESCRIPTION:
{jd_text}

Provide your analysis in the following JSON format:
{{
    "match_score": <number between 0-100>,
    "matched_skills": [<list of skills found in both resume and JD>],
    "missing_skills": [<list of skills in JD but not in resume>],
    "matched_keywords": [<list of important keywords found in both>],
    "missing_keywords": [<list of important keywords in JD but not in resume>],
    "improvements": [
        {{
            "category": "<category name>",
            "suggestion": "<specific actionable suggestion>",
            "priority": "<high/medium/low>"
        }}
    ],
    "summary": "<2-3 paragraph comprehensive summary of the analysis, strengths, gaps, and recommendations>"
}}

Be specific and actionable. Focus on technical skills, years of experience, education requirements, and key qualifications.
Return ONLY the JSON object, no additional text."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert resume analyzer. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=4000
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # Extract JSON from response (in case there's extra text)
            json_start = result_text.find('{')
            json_end = result_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                result_text = result_text[json_start:json_end]
            
            result = json.loads(result_text)
            
            # Validate and ensure all fields exist
            required_fields = ['match_score', 'matched_skills', 'missing_skills', 
                             'matched_keywords', 'missing_keywords', 'improvements', 'summary']
            
            for field in required_fields:
                if field not in result:
                    result[field] = [] if field != 'summary' and field != 'match_score' else ('' if field == 'summary' else 0)
            
            # Ensure match_score is within 0-100
            result['match_score'] = max(0, min(100, float(result['match_score'])))
            
            return result
            
        except json.JSONDecodeError as e:
            # Fallback in case JSON parsing fails
            return {
                'match_score': 50,
                'matched_skills': [],
                'missing_skills': [],
                'matched_keywords': [],
                'missing_keywords': [],
                'improvements': [
                    {
                        'category': 'Error',
                        'suggestion': 'Unable to parse AI response. Please try again.',
                        'priority': 'high'
                    }
                ],
                'summary': 'An error occurred while analyzing the resume. Please try again.'
            }
        except Exception as e:
            raise Exception(f"Error analyzing resume: {str(e)}")
    
    def generate_improvement_suggestions(self, resume_text: str, jd_text: str, 
                                        missing_skills: List[str], missing_keywords: List[str]) -> str:
        """Generate specific improvement suggestions based on gaps"""
        
        prompt = f"""Based on the resume and job description analysis, provide 5-7 specific, actionable improvement suggestions.

RESUME GAPS:
- Missing Skills: {', '.join(missing_skills)}
- Missing Keywords: {', '.join(missing_keywords)}

CURRENT RESUME:
{resume_text[:2000]}

JOB DESCRIPTION:
{jd_text[:2000]}

Provide specific suggestions on:
1. How to incorporate missing keywords naturally
2. Which skills to highlight or add
3. How to restructure experience bullets
4. What achievements to emphasize
5. Any formatting or structure improvements

Format each suggestion as a brief, actionable point (2-3 sentences)."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert resume consultant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=1500
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating suggestions: {str(e)}"
