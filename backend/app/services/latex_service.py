import os
import subprocess
import requests
from typing import Dict, Optional
from datetime import datetime
from app.config import settings


class LaTeXService:
    """Service for generating and compiling LaTeX resumes"""
    
    def __init__(self):
        self.latex_mode = settings.LATEX_MODE
        self.online_url = settings.LATEX_ONLINE_URL
        self.output_dir = f"{settings.UPLOAD_DIR}/latex"
        self.pdf_dir = f"{settings.UPLOAD_DIR}/pdfs"
        
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.pdf_dir, exist_ok=True)
    
    def generate_latex_from_template(self, user_data: Dict) -> str:
        """
        Generate LaTeX content from user data using standard document class
        """
        # Use standard article class with custom formatting
        latex_template = r"""\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[left=0.5in,top=0.5in,right=0.5in,bottom=0.5in]{geometry}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{array}

% Remove page numbers
\pagestyle{empty}

% Custom section formatting
\titleformat{\section}{\large\bfseries\uppercase}{}{0em}{}[\titlerule]
\titlespacing{\section}{0pt}{12pt}{6pt}

% Custom subsection formatting
\titleformat{\subsection}{\bfseries}{}{0em}{}
\titlespacing{\subsection}{0pt}{6pt}{3pt}

\begin{document}

% Header with name
{\LARGE\bfseries """ + user_data.get('name', 'YOUR NAME') + r"""}

\vspace{3pt}

% Contact information
""" + user_data.get('contact_info', 'Contact Information Here') + r"""

\vspace{10pt}

% Objective
\section{OBJECTIVE}
""" + user_data.get('objective', 'Your career objective here.') + r"""

% Experience
\section{EXPERIENCE}
""" + user_data.get('experience', '') + r"""

% Technical Strengths
\section{TECHNICAL STRENGTHS}
\begin{tabular}{@{}>{\raggedright\arraybackslash}p{0.25\linewidth}@{\hspace{2em}}>{\raggedright\arraybackslash}p{0.7\linewidth}}
\textbf{Technical Skills} & """ + user_data.get('technical_skills', '') + r""" \\
\textbf{Soft Skills} & """ + user_data.get('soft_skills', '') + r""" \\
\end{tabular}

% Projects
\section{PROJECTS}
""" + user_data.get('projects', '') + r"""

% Education
\section{EDUCATION}
""" + user_data.get('education', '') + r"""

% Certifications
\section{CERTIFICATIONS}
""" + user_data.get('certifications', '') + r"""

\end{document}
"""
        return latex_template
    
    def compile_latex_local(self, latex_content: str, output_name: str) -> Optional[str]:
        """
        Compile LaTeX to PDF using local pdflatex installation
        """
        tex_file = os.path.join(self.output_dir, f"{output_name}.tex")
        pdf_file = os.path.join(self.pdf_dir, f"{output_name}.pdf")
        
        try:
            # Write LaTeX content to file
            with open(tex_file, 'w', encoding='utf-8') as f:
                f.write(latex_content)
            
            # Compile with pdflatex
            result = subprocess.run(
                ['pdflatex', '-interaction=nonstopmode', '-output-directory', self.pdf_dir, tex_file],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            # Check if PDF was created
            if os.path.exists(pdf_file):
                # Clean up auxiliary files
                aux_extensions = ['.aux', '.log', '.out']
                for ext in aux_extensions:
                    aux_file = os.path.join(self.pdf_dir, f"{output_name}{ext}")
                    if os.path.exists(aux_file):
                        os.remove(aux_file)
                
                return pdf_file
            else:
                raise Exception(f"PDF compilation failed: {result.stderr}")
                
        except FileNotFoundError:
            raise Exception("pdflatex not found. Please install LaTeX or switch to online mode.")
        except subprocess.TimeoutExpired:
            raise Exception("LaTeX compilation timed out")
        except Exception as e:
            raise Exception(f"Error compiling LaTeX: {str(e)}")
    
    def compile_latex_online(self, latex_content: str, output_name: str) -> Optional[str]:
        """
        Compile LaTeX to PDF using online service (LaTeX.Online)
        """
        try:
            # Prepare the request
            url = f"{self.online_url}?target=resume.pdf"
            files = {'file': ('resume.tex', latex_content, 'text/plain')}
            
            # Send compilation request
            response = requests.post(url, files=files, timeout=60)
            
            if response.status_code == 200:
                # Save PDF
                pdf_file = os.path.join(self.pdf_dir, f"{output_name}.pdf")
                with open(pdf_file, 'wb') as f:
                    f.write(response.content)
                
                # Also save the .tex file
                tex_file = os.path.join(self.output_dir, f"{output_name}.tex")
                with open(tex_file, 'w', encoding='utf-8') as f:
                    f.write(latex_content)
                
                return pdf_file
            else:
                raise Exception(f"Online compilation failed with status {response.status_code}")
                
        except requests.exceptions.Timeout:
            raise Exception("Online LaTeX compilation timed out")
        except Exception as e:
            raise Exception(f"Error with online compilation: {str(e)}")
    
    def compile_latex(self, latex_content: str, output_name: Optional[str] = None) -> str:
        """
        Compile LaTeX to PDF using configured mode
        Returns path to generated PDF
        """
        if output_name is None:
            output_name = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Try local compilation first if in local mode
        if self.latex_mode == 'local':
            try:
                return self.compile_latex_local(latex_content, output_name)
            except Exception as e:
                # Fallback to online if local fails
                print(f"Local compilation failed: {str(e)}. Trying online...")
                return self.compile_latex_online(latex_content, output_name)
        else:
            # Use online compilation
            return self.compile_latex_online(latex_content, output_name)
    
    def save_latex(self, latex_content: str, output_name: Optional[str] = None) -> str:
        """
        Save LaTeX content to file without compiling
        Returns path to .tex file
        """
        if output_name is None:
            output_name = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        tex_file = os.path.join(self.output_dir, f"{output_name}.tex")
        
        with open(tex_file, 'w', encoding='utf-8') as f:
            f.write(latex_content)
        
        return tex_file
