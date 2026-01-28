"""
Professional LaTeX Resume Templates
"""

LATEX_TEMPLATES = {
    "classic": {
        "name": "Classic",
        "description": "Traditional chronological format - professional and timeless",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{geometry}
\usepackage{enumitem}
\geometry{a4paper,margin=0.75in}

\begin{document}

\begin{center}
    {\LARGE \textbf{{{NAME}}}} \\[0.2em]
    {{EMAIL}} $|$ {{PHONE}} $|$ {{LOCATION}}
\end center}

\section*{Professional Summary}
{{SUMMARY}}

\section*{Experience}
\textbf{{{JOB_TITLE}}} $|$ \textit{{{COMPANY}}} \hfill {{DATE_RANGE}} \\
{{EXPERIENCE_DESCRIPTION}}

\section*{Education}
\textbf{{{DEGREE}}} $|$ \textit{{{UNIVERSITY}}} \hfill {{GRADUATION_YEAR}}

\section*{Skills}
{{SKILLS}}

\end{document}
"""
    },
    
    "modern": {
        "name": "Modern",
        "description": "Clean, minimalist design with subtle accents",
        "content": r"""\documentclass[11pt]{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}
\definecolor{maincolor}{RGB}{41,128,185}

\geometry{a4paper,margin=0.7in}
\titleformat{\section}{\large\bfseries\color{maincolor}}{}{0em}{}[\titlerule]

\begin{document}

{\huge\textbf{{NAME}}}

\vspace{0.5em}
\textcolor{maincolor}{{{EMAIL}}} $\diamond$ {{PHONE}} $\diamond$ {{LOCATION}}

\section{Summary}
{{SUMMARY}}

\section{Experience}
\textbf{{{JOB_TITLE}}} $|$ {{COMPANY}} \hfill \textit{{{DATE_RANGE}}}

{{EXPERIENCE_DESCRIPTION}}

\section{Education}
\textbf{{{DEGREE}}} \hfill {{GRADUATION_YEAR}} \\
{{UNIVERSITY}}

\section{Technical Skills}
{{SKILLS}}

\end{document}
"""
    },
    
    "ats_friendly": {
        "name": "ATS-Friendly",
        "description": "Optimized for applicant tracking systems - simple formatting",
        "content": r"""\documentclass[11pt,letter]{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{enumitem}
\geometry{letterpaper,margin=1in}

\setlist[itemize]{leftmargin=*,noitemsep,topsep=0pt}

\begin{document}

{{NAME}}

{{EMAIL}} | {{PHONE}} | {{LOCATION}}

PROFESSIONAL SUMMARY

{{SUMMARY}}

WORK EXPERIENCE

{{JOB_TITLE}} | {{COMPANY}} | {{DATE_RANGE}}

{{EXPERIENCE_DESCRIPTION}}

EDUCATION

{{DEGREE}} | {{UNIVERSITY}} | {{GRADUATION_YEAR}}

SKILLS

{{SKILLS}}

\end{document}
"""
    },
    
    "creative": {
        "name": "Creative",
        "description": "Bold, colorful design for creative roles",
        "content": r"""\documentclass[11pt]{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}
\usepackage{fontawesome5}

\definecolor{headercolor}{RGB}{230,126,34}
\definecolor{textcolor}{RGB}{52,73,94}

\geometry{a4paper,margin=0.6in}
\color{textcolor}

\titleformat{\section}{\Large\bfseries\color{headercolor}}{}{0em}{}[\color{headercolor}\titlerule]

\begin{document}

{\Huge\textbf{\color{headercolor}{{NAME}}}}

\vspace{0.3em}
\faEnvelope\ {{EMAIL}} \quad \faPhone\ {{PHONE}} \quad \faMapMarker\ {{LOCATION}}

\section{About Me}
{{SUMMARY}}

\section{Experience}
\textbf{\large {{JOB_TITLE}}} \\
\textit{{{COMPANY}}} \hfill {{DATE_RANGE}}

{{EXPERIENCE_DESCRIPTION}}

\section{Education}
\textbf{{{DEGREE}}} \\
{{UNIVERSITY}} \hfill {{GRADUATION_YEAR}}

\section{Skills \& Expertise}
{{SKILLS}}

\end{document}
"""
    },
    
    "academic": {
        "name": "Academic",
        "description": "CV format for research and academia",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\usepackage{enumitem}
\usepackage{hyperref}

\geometry{a4paper,margin=1in}
\setlength{\parindent}{0pt}

\begin{document}

\begin{center}
    {\Large \textbf{{{NAME}}}} \\[0.5em]
    {{EMAIL}} $|$ {{PHONE}} $|$ {{LOCATION}}
\end{center}

\section*{Research Interests}
{{SUMMARY}}

\section*{Education}
\textbf{{{DEGREE}}} \\
{{UNIVERSITY}}, {{GRADUATION_YEAR}}

\section*{Academic Experience}
\textbf{{{JOB_TITLE}}} \hfill {{DATE_RANGE}} \\
\textit{{{COMPANY}}}

{{EXPERIENCE_DESCRIPTION}}

\section*{Publications}
[List your publications here]

\section*{Skills \& Competencies}
{{SKILLS}}

\section*{References}
Available upon request

\end{document}
"""
    }
}
