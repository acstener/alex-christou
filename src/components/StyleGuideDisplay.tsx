import { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface StyleGuideDisplayProps {
  styleGuide: string;
}

export default function StyleGuideDisplay({ styleGuide }: StyleGuideDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  // Function to copy style guide to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(styleGuide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Function to format the style guide text with Markdown-like styling
  const formatStyleGuide = () => {
    // Split by sections (numbered items)
    const sections = styleGuide.split(/\d+\.\s+/);
    
    // Remove the first empty section if it exists
    const contentSections = sections.filter(section => section.trim().length > 0);
    
    // Extract section titles from the original text
    const sectionTitles = styleGuide.match(/\d+\.\s+([^:]+):/g) || [];
    
    return (
      <div className="space-y-6">
        {contentSections.map((section, index) => {
          // Extract section title
          const titleMatch = sectionTitles[index]?.match(/\d+\.\s+([^:]+):/) || [];
          const title = titleMatch[1] || `Section ${index + 1}`;
          
          // Format the section content
          const formattedContent = section
            .split('\n')
            .map((line, i) => {
              // Format list items
              if (line.trim().startsWith('-')) {
                return (
                  <li key={i} className="ml-6 list-disc text-gray-800">
                    {line.trim().substring(1).trim()}
                  </li>
                );
              }
              
              // Format headings (usually at the start of sections)
              if (line.trim().endsWith(':') && !line.includes('-')) {
                return (
                  <h4 key={i} className="font-medium text-gray-900 mt-4">
                    {line.trim()}
                  </h4>
                );
              }
              
              // Regular text
              return line.trim() ? (
                <p key={i} className="text-gray-700">
                  {line.trim()}
                </p>
              ) : null;
            })
            .filter(Boolean);
          
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">{title}</h3>
              <div className="space-y-2">
                {formattedContent}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Design Style Guide</h3>
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
      
      {formatStyleGuide()}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Use this style guide as a prompt with your favorite AI design tool</p>
      </div>
    </div>
  );
} 