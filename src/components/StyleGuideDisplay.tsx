import { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface StyleGuideDisplayProps {
  styleGuide: string;
}

export default function StyleGuideDisplay({ styleGuide }: StyleGuideDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(styleGuide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to format markdown-style content
  const formatContent = (content: string) => {
    // Split content into sections based on headings
    const sections = content.split(/(?=^#+\s)/m).filter(Boolean);

    return sections.map((section, index) => {
      // Extract section title and content
      const [title, ...contentLines] = section.split('\n');
      const content = contentLines.join('\n').trim();

      // Format the content
      const formattedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/`([^`]+)`/g, '<code>$1</code>') // Code/color values
        .replace(/^- (.*?)$/gm, '• $1') // Convert hyphens to bullets
        .split('\n')
        .filter(line => line.trim()) // Remove empty lines
        .map(line => line.trim()); // Trim each line

      return (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            {title.replace(/^#+\s/, '')}
          </h3>
          <div className="space-y-2">
            {formattedContent.map((line, i) => {
              if (line.startsWith('•')) {
                // Bullet points
                return (
                  <div key={i} className="flex items-start gap-2 ml-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <p 
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: line.substring(1).trim()
                      }} 
                    />
                  </div>
                );
              } else if (line.includes('<code>')) {
                // Lines with color codes
                return (
                  <div key={i} className="flex items-center gap-2">
                    <p 
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: line }}
                    />
                    {line.match(/`#[0-9a-fA-F]{6}`/) && (
                      <div 
                        className="w-4 h-4 rounded border border-gray-200" 
                        style={{ 
                          backgroundColor: line.match(/`(#[0-9a-fA-F]{6})`/)?.[1] || ''
                        }}
                      />
                    )}
                  </div>
                );
              } else {
                // Regular text
                return (
                  <p 
                    key={i} 
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                );
              }
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Design Style Guide</h2>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy to Clipboard
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-4">
        {formatContent(styleGuide)}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Use this style guide as inspiration for your design system</p>
      </div>
    </div>
  );
} 