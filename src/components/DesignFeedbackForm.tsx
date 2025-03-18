'use client';

import React from 'react';
import { useState, useCallback } from 'react';
import { ArrowRight, Loader2, Download, Image as ImageIcon, Globe, X } from 'lucide-react';
import LoadingState from '@/components/LoadingState';
import FeedbackDisplay from '@/components/FeedbackDisplay';

type InputMethod = 'url' | 'image';

export default function DesignFeedbackForm() {
  const [inputMethod, setInputMethod] = useState<InputMethod>('url');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'screenshot' | 'upload' | 'analysis' | null>(null);
  const [result, setResult] = useState<{
    screenshot?: string;
    feedback?: string;
    metadata?: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisError(null);
    setLoadingStage('upload');
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload the image
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      
      // Store the image info
      setResult({
        screenshot: uploadData.url,
        metadata: uploadData.metadata
      });
      
      // Add a small delay to ensure the image is accessible
      console.log('Waiting for image to be accessible...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process with Vision AI
      setLoadingStage('analysis');
      console.log('Starting analysis with image URL:', uploadData.url);
      
      const analyzeResponse = await fetch('/api/design-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: uploadData.url 
        }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        setAnalysisError(errorData.error || 'Failed to analyze design');
        setIsLoading(false);
        setLoadingStage(null);
        return;
      }

      const analyzeData = await analyzeResponse.json();
      
      // Update the result with the feedback
      setResult(prevResult => ({
        ...prevResult,
        feedback: analyzeData.feedback
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoadingStage(null);
    }
  }, []);

  // Handle clipboard paste
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData?.items;
    
    if (!items) return;

    // Look for image data in clipboard
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          setInputMethod('image'); // Switch to image mode if we're not already there
          handleImageUpload(file);
          break;
        }
      }
    }
  }, [handleImageUpload]);

  // Add paste event listener
  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleImageUpload]);

  // Handle URL submission
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnalysisError(null);
    setLoadingStage('screenshot');
    
    try {
      // Step 1: Get the screenshot
      const screenshotResponse = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!screenshotResponse.ok) {
        const errorData = await screenshotResponse.json();
        throw new Error(errorData.error || 'Failed to capture screenshot');
      }

      const screenshotData = await screenshotResponse.json();
      
      // Store the screenshot info
      setResult({
        screenshot: screenshotData.screenshot,
        metadata: screenshotData.metadata
      });
      
      // Step 2: Process with Vision AI
      setLoadingStage('analysis');
      
      const analyzeResponse = await fetch('/api/design-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: screenshotData.screenshot 
        }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        setAnalysisError(errorData.error || 'Failed to analyze design');
        setIsLoading(false);
        setLoadingStage(null);
        return;
      }

      const analyzeData = await analyzeResponse.json();
      
      // Update the result with the feedback
      setResult(prevResult => ({
        ...prevResult,
        feedback: analyzeData.feedback
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoadingStage(null);
    }
  };

  // Function to handle image download
  const handleDownload = () => {
    if (result?.screenshot) {
      const link = document.createElement('a');
      link.href = result.screenshot;
      link.download = `${url ? url.replace(/[^a-z0-9]/gi, '_') : 'design'}_screenshot.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        {/* URL Input Form */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Enter Website URL</h3>
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Analyze Website</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">or</span>
          </div>
        </div>

        {/* Image Upload Area */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload or Paste Image</h3>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              <ImageIcon className="mx-auto w-12 h-12 text-gray-400" />
              <p className="text-gray-600">
                Drag and drop your image here, click to select, or paste (⌘V)
              </p>
              <p className="text-sm text-gray-500">Supports PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && loadingStage && <LoadingState stage={loadingStage} />}

      {/* Error Display */}
      {(error || analysisError) && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error || analysisError}</p>
        </div>
      )}

      {/* Results Display */}
      {result && !isLoading && (
        <div className="mt-8 space-y-6">
          {/* Screenshot Preview */}
          {result.screenshot && (
            <div className="relative max-h-[600px] overflow-hidden">
              <img
                src={result.screenshot}
                alt="Screenshot"
                className="w-full rounded-lg shadow-lg object-contain max-h-[600px]"
              />
              <button
                onClick={handleDownload}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                title="Download screenshot"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Feedback Display */}
          {result.feedback && (
            <FeedbackDisplay feedback={result.feedback} />
          )}
        </div>
      )}
    </div>
  );
}