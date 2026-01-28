/**
 * LaTeX Validator
 * Validates LaTeX syntax and provides error markers
 */

export interface ValidationError {
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
}

export class LaTeXValidator {
    /**
     * Validate LaTeX content
     */
    validate(content: string): ValidationError[] {
        const errors: ValidationError[] = [];
        const lines = content.split('\n');

        // Track open environments
        const environmentStack: { name: string; line: number }[] = [];
        // Track brackets
        const bracketStack: { type: string; line: number; column: number }[] = [];

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum];

            // Check for \begin{} without matching \end{}
            const beginMatches = Array.from(line.matchAll(/\\begin\{([^}]+)\}/g));
            for (const match of beginMatches) {
                if (match[1]) {
                    environmentStack.push({ name: match[1], line: lineNum });
                }
            }

            // Check for \end{} without matching \begin{}
            const endMatches = Array.from(line.matchAll(/\\end\{([^}]+)\}/g));
            for (const match of endMatches) {
                if (match[1]) {
                    const lastEnv = environmentStack.pop();
                    if (!lastEnv) {
                        errors.push({
                            line: lineNum,
                            column: match.index || 0,
                            message: `\\end{${match[1]}} without matching \\begin{}`,
                            severity: 'error'
                        });
                    } else if (lastEnv.name !== match[1]) {
                        errors.push({
                            line: lineNum,
                            column: match.index || 0,
                            message: `Expected \\end{${lastEnv.name}}, found \\end{${match[1]}}`,
                            severity: 'error'
                        });
                    }
                }
            }

            // Check for unescaped special characters
            const specialChars = ['&', '%', '$', '#', '_'];
            for (const char of specialChars) {
                const regex = new RegExp(`(?<!\\\\)${char === '$' ? '\\$' : char}`, 'g');
                let match;
                while ((match = regex.exec(line)) !== null) {
                    // Check if it's in a valid context (e.g., & in tabular)
                    if (char === '&' && this.isInEnvironment(lines, lineNum, ['tabular', 'array', 'align'])) {
                        continue;
                    }
                    if (char === '$' && this.isInMathMode(line, match.index)) {
                        continue;
                    }

                    errors.push({
                        line: lineNum,
                        column: match.index,
                        message: `Unescaped special character '${char}'. Use \\${char} instead`,
                        severity: 'warning'
                    });
                }
            }

            // Check for bracket matching
            this.checkBrackets(line, lineNum, bracketStack, errors);
        }

        // Check for unclosed environments
        for (const env of environmentStack) {
            errors.push({
                line: env.line,
                column: 0,
                message: `Unclosed environment '${env.name}'. Missing \\end{${env.name}}`,
                severity: 'error'
            });
        }

        return errors;
    }

    private checkBrackets(
        line: string,
        lineNum: number,
        stack: { type: string; line: number; column: number }[],
        errors: ValidationError[]
    ): void {
        const brackets = { '{': '}', '[': ']', '(': ')' };

        for (let col = 0; col < line.length; col++) {
            const char = line[col];

            if (char === '{' || char === '[' || char === '(') {
                stack.push({ type: char, line: lineNum, column: col });
            } else if (char === '}' || char === ']' || char === ')') {
                const last = stack.pop();
                if (!last) {
                    errors.push({
                        line: lineNum,
                        column: col,
                        message: `Unexpected closing bracket '${char}'`,
                        severity: 'error'
                    });
                } else if (brackets[last.type as keyof typeof brackets] !== char) {
                    errors.push({
                        line: lineNum,
                        column: col,
                        message: `Mismatched brackets: '${last.type}' opened at line ${last.line + 1}, but '${char}' found`,
                        severity: 'error'
                    });
                }
            }
        }
    }

    private isInEnvironment(lines: string[], lineNum: number, envNames: string[]): boolean {
        // Simple check - look backwards for \begin{envName}
        for (let i = lineNum; i >= 0; i--) {
            for (const envName of envNames) {
                if (lines[i].includes(`\\begin{${envName}}`)) return true;
                if (lines[i].includes(`\\end{${envName}}`)) return false;
            }
        }
        return false;
    }

    private isInMathMode(line: string, position: number): boolean {
        // Count $ before position
        const before = line.substring(0, position);
        const dollarCount = (before.match(/(?<!\\)\$/g) || []).length;
        // If odd number, we're in math mode
        return dollarCount % 2 === 1;
    }
}

export const latexValidator = new LaTeXValidator();
