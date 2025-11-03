import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language?: string;
    theme?: 'light' | 'dark';
    showLineNumbers?: boolean;
}

export function CodeBlock({
    code,
    language = 'typescript',
    theme = 'light',
    showLineNumbers = true,
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-block">
            <div className="code-block-header">
                <span className="code-block-language">{language}</span>
                <button
                    className="code-block-copy"
                    onClick={handleCopy}
                    aria-label="Copy code"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={theme === 'dark' ? vscDarkPlus : vs}
                showLineNumbers={showLineNumbers}
                customStyle={{
                    margin: 0,
                    borderRadius: '0 0 8px 8px',
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
