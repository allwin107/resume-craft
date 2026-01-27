import os
import re
from typing import Dict, Optional, Tuple
from PyPDF2 import PdfReader
from docx import Document


class ResumeParser:
    """Parse resumes from PDF and DOCX files"""
    
    def __init__(self):
        self.section_patterns = {
            'experience': r'(experience|work history|employment)',
            'education': r'(education|academic|qualification)',
            'skills': r'(skills|technical skills|expertise|competencies)',
            'projects': r'(projects|work projects)',
            'certifications': r'(certifications|certificates|licenses)'
        }
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
    
    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")
    
    def extract_text(self, file_path: str) -> str:
        """Extract text from resume file"""
        _, ext = os.path.splitext(file_path)
        ext = ext.lower()
        
        if ext == '.pdf':
            return self.extract_text_from_pdf(file_path)
        elif ext in ['.docx', '.doc']:
            return self.extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")
    
    def extract_email(self, text: str) -> Optional[str]:
        """Extract email address from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        return match.group(0) if match else None
    
    def extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text"""
        phone_pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
        match = re.search(phone_pattern, text)
        return match.group(0).strip() if match else None
    
    def extract_sections(self, text: str) -> Dict[str, str]:
        """Extract different sections from resume"""
        sections = {}
        text_lower = text.lower()
        
        # Find section positions
        section_positions = []
        for section_name, pattern in self.section_patterns.items():
            matches = re.finditer(pattern, text_lower, re.IGNORECASE)
            for match in matches:
                section_positions.append((match.start(), section_name))
        
        # Sort by position
        section_positions.sort()
        
        # Extract content for each section
        for i, (start_pos, section_name) in enumerate(section_positions):
            end_pos = section_positions[i + 1][0] if i + 1 < len(section_positions) else len(text)
            
            # Get the content (skip the header line)
            content_start = text.find('\n', start_pos)
            if content_start != -1:
                sections[section_name] = text[content_start:end_pos].strip()
        
        return sections
    
    def extract_skills(self, text: str) -> list:
        """Extract skills from text"""
        # Common programming languages and technologies
        common_skills = [
            'python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
            'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'fastapi',
            'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
            'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'git',
            'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science',
            'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
            'rest api', 'graphql', 'microservices', 'agile', 'scrum'
        ]
        
        text_lower = text.lower()
        found_skills = []
        
        for skill in common_skills:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        return list(set(found_skills))  # Remove duplicates
    
    def parse_resume(self, file_path: str) -> Dict:
        """Parse resume and extract structured data"""
        # Extract raw text
        text = self.extract_text(file_path)
        
        # Extract structured data
        parsed_data = {
            'raw_text': text,
            'email': self.extract_email(text),
            'phone': self.extract_phone(text),
            'sections': self.extract_sections(text),
            'skills': self.extract_skills(text)
        }
        
        return parsed_data
