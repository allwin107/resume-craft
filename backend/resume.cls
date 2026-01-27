% Resume Document Class
% Custom class for professional resume formatting

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{resume}[2024/01/01 Resume class]
\LoadClass[11pt,letterpaper]{article}

\RequirePackage[parfill]{parskip}
\RequirePackage{array}
\RequirePackage{ifthen}
\RequirePackage{hyperref}

% Reduce margins
\RequirePackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}

% Colors
\RequirePackage{xcolor}
\definecolor{linkcolor}{HTML}{0645AD}

% Hyperlink setup
\hypersetup{
    colorlinks=true,
    linkcolor=linkcolor,
    urlcolor=linkcolor,
    filecolor=linkcolor
}

% Section formatting
\def\namesize{\huge}
\def\nameskip{\medskip}
\def\addressskip{\smallskip}
\def\sectionlineskip{\medskip}
\def\sectionskip{\medskip}

% Name command
\def\@name{}
\def\name#1{\def\@name{#1}}

% Address command
\def\@addressone{}
\def\@addresstwo{}
\def\address#1{\def\@addressone{#1}}

% Section environment
\newenvironment{rSection}[1]{
  \sectionskip
  \textbf{\large #1}
  \sectionlineskip
  \hrule
  \begin{list}{}{
    \setlength{\leftmargin}{1.5em}
  }
  \item[]
}{
  \end{list}
}

% Subsection environment
\newenvironment{rSubsection}[4]{
  {\textbf{#1}} \hfill {#2}
  \ifthenelse{\equal{#3}{}}{}{
  \\
  {\em #3} \hfill {\em #4}
  }
  \smallskip
  \begin{list}{$\cdot$}{\leftmargin=0em}
  \itemsep -0.5em \vspace{-0.5em}
}{
  \end{list}
  \vspace{0.5em}
}

% Custom commands
\def\@makeheader{
  \centering{\namesize\bf \@name}
  \nameskip
  \@addressone
  \addressskip
}

\let\ori@document=\document
\renewcommand{\document}{
  \ori@document
  \@makeheader
}
