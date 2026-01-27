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
        Generate LaTeX content from user data using the provided template
        """
        # Base template structure (using the provided format)
        latex_template = r"""\documentclass{resume}
\usepackage{etoolbox}
\usepackage{graphicx}
\usepackage{float}
\usepackage[absolute,overlay]{textpos}
\setlength{\topskip}{0pt}

\makeatletter
\patchcmd{\@name}{\Huge}{\Large}{}{}
\makeatother

\usepackage[left=0.32 in,top=0.32in,right=0.32 in,bottom=0.32in]{geometry}
\newcommand{\tab}[1]{\hspace{.0\textwidth}\rlap{#1}} 
\newcommand{\itab}[1]{\hspace{0.9em}\rlap{#1}}

\begin{document}
\vspace*{-1.2cm}
\vspace*{-0.4cm}

\begin{minipage}[t]{0.74\textwidth}
\vspace{0pt}
{\Large \textbf{""" + user_data.get('name', 'YOUR NAME') + r"""}}\\[-6pt]

""" + user_data.get('contact_info', 'Contact Information Here') + r"""
\end{minipage}
\hfill
\begin{minipage}[t]{0.24\textwidth}
\vspace{-6pt}
\raggedleft
% Photo placeholder - user can add their photo
% \includegraphics[width=2.7cm]{photo.jpg}
\end{minipage}

\vspace{-1.1em}

%----------------------------------------------------------------------------------------
%	OBJECTIVE
%----------------------------------------------------------------------------------------
\vspace{-0.3em}

\begin{rSection}{OBJECTIVE}
\vspace{-0.2em}
{""" + user_data.get('objective', 'Your career objective here.') + r"""}
\end{rSection}

%----------------------------------------------------------------------------------------
%	WORK EXPERIENCE SECTION
%----------------------------------------------------------------------------------------
\begin{rSection}{EXPERIENCE}
\vspace{-0.3em}
""" + user_data.get('experience', '') + r"""
\end{rSection}

%----------------------------------------------------------------------------------------
% TECHNICAL STRENGTHS	
%----------------------------------------------------------------------------------------
\begin{rSection}{TECHNICAL STRENGTHS}
\vspace{-0.4em}
\begin{tabular}{@{}>{\raggedright\arraybackslash}p{0.2\linewidth}@{\hspace{6ex}}>{\raggedright\arraybackslash}p{0.75\linewidth}}
\textbf{Technical Skills} & """ + user_data.get('technical_skills', '') + r""" \\   
\textbf{Soft Skills} & """ + user_data.get('soft_skills', '') + r""" \\ 
\end{tabular}
\end{rSection}
\vspace{-1.5em}

%----------------------------------------------------------------------------------------
%	WORK PROJECTS SECTION
%----------------------------------------------------------------------------------------
\begin{rSection}{PROJECTS}
\vspace{-0.9em}
""" + user_data.get('projects', '') + r"""
\end{rSection}
 
%----------------------------------------------------------------------------------------
%	EDUCATION SECTION
%----------------------------------------------------------------------------------------
\begin{rSection}{EDUCATION}
\vspace{-0.3em}
""" + user_data.get('education', '') + r"""
\end{rSection}

%----------------------------------------------------------------------------------------
%	CERTIFICATION SECTION
%----------------------------------------------------------------------------------------
\begin{rSection}{CERTIFICATIONS}
\vspace{-0.3em}
""" + user_data.get('certifications', '') + r"""
\end{rSection}

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
