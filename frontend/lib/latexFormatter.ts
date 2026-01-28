/**
 * LaTeX Formatter
 * Formats LaTeX code with proper indentation and spacing
 */

export class LaTeXFormatter {
    private indentSize = 4;

    /**
     * Format the entire LaTeX document
     */
    format(content: string): string {
        const lines = content.split('\n');
        const formatted: string[] = [];
        let indentLevel = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Skip empty lines
            if (line === '') {
                formatted.push('');
                continue;
            }

            // Decrease indent for \end{} before adding line
            if (line.startsWith('\\end{')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // Add indented line
            const indent = ' '.repeat(indentLevel * this.indentSize);
            formatted.push(indent + line);

            // Increase indent after \begin{}
            if (line.startsWith('\\begin{')) {
                indentLevel++;
            }

            // Add blank line after section headings
            if (line.startsWith('\\section') || line.startsWith('\\subsection')) {
                if (i < lines.length - 1 && lines[i + 1].trim() !== '') {
                    formatted.push('');
                }
            }
        }

        return formatted.join('\n');
    }

    /**
     * Format a selection of text
     */
    formatSelection(selection: string): string {
        return this.format(selection);
    }

    /**
     * Remove extra whitespace
     */
    cleanWhitespace(content: string): string {
        // Remove trailing whitespace from each line
        let cleaned = content.replace(/[ \t]+$/gm, '');

        // Remove multiple consecutive blank lines
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

        return cleaned;
    }

    /**
     * Align environment content
     */
    alignEnvironments(content: string): string {
        const lines = content.split('\n');
        const aligned: string[] = [];

        for (const line of lines) {
            // Align & in tabular/array environments
            if (line.includes('&')) {
                const parts = line.split('&').map(p => p.trim());
                aligned.push(parts.join('  &  '));
            } else {
                aligned.push(line);
            }
        }

        return aligned.join('\n');
    }
}

export const latexFormatter = new LaTeXFormatter();
