'use client';

import React from 'react';
import { useState } from 'react';
import { Copy, CheckCircle, type LucideProps } from 'lucide-react';
import { cn, patterns } from '@/lib/utils';

interface FeedbackDisplayProps {
  feedback: string;
}

const CopyIcon = (props: LucideProps) => <Copy {...props} />;
const CheckIcon = (props: LucideProps) => <CheckCircle {...props} />;

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(feedback);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to format text with bold sections
  const formatBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // This is bold text
        return <strong key={i} className="font-semibold">{part.slice(2, -2).trim()}</strong>;
      }
      return part;
    });
  };

  // Function to format markdown-style content
  const formatContent = (content: string) => {
    // Normalize line endings and remove extra spaces
    const normalizedContent = content
      .replace(/\r\n/g, '\n')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    // Split the content into sections based on ###
    const parts = normalizedContent.split(/(?=###)/);
    
    // The first part is the intro (if it exists)
    const [intro, ...sections] = parts;

    const formattedSections = sections.map((section, index) => {
      // Split each section into lines and clean them
      const lines = section
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);
      
      // First line is the header (starts with ###)
      const headerLine = lines[0].replace(/^###\s*/, '').trim();
      
      // Rest are content lines
      const contentLines = lines.slice(1);
      
      // Group bullet points and their continuations
      const items: string[] = [];
      let currentItem = '';

      contentLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('- ')) {
          // If we have a previous item, save it
          if (currentItem) {
            items.push(currentItem.trim());
          }
          // Start new item
          currentItem = trimmedLine.substring(2);
        } else if (currentItem && !trimmedLine.startsWith('###')) {
          // Continuation of previous point - add with space
          currentItem += ' ' + trimmedLine;
        }
      });

      // Don't forget the last item
      if (currentItem) {
        items.push(currentItem.trim());
      }

      return (
        <div key={index} className={patterns.card}>
          <h3 className={cn(patterns.heading.h3, "mb-4 text-blue-600")}>
            {headerLine}
          </h3>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1.5 flex-shrink-0">•</span>
                <p className={cn(patterns.text.base, "flex-1 leading-relaxed")}>
                  {formatBoldText(item)}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    });

    return (
      <>
        {intro && intro.trim() && (
          <div className={cn(patterns.text.base, "mb-6 leading-relaxed")}>
            {formatBoldText(intro.trim())}
          </div>
        )}
        {formattedSections}
      </>
    );
  };

  return (
    <div className={cn(patterns.card, "bg-gray-50")}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={patterns.heading.h2}>Design Feedback</h2>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 text-green-500" /> Copied!
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4" /> Copy to Clipboard
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-4">
        {formatContent(feedback)}
      </div>
      
      <div className="mt-4">
        <p className={patterns.text.muted}>Use this feedback to improve your design</p>
      </div>
    </div>
  );
} 