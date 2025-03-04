'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Download, AlertCircle } from 'lucide-react';
import StyleGuideDisplay from './StyleGuideDisplay';
import LoadingState from './LoadingState';

export default function WebStyleForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'screenshot' | 'analysis' | null>(null);
  const [result, setResult] = useState<{
    screenshot?: string;
    styleGuide?: string;
    metadata?: any;
  } | null>(null);
  const [error, setError] = useState<{
    message: string;
    details?: any;
  } | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnalysisError(null);
    setDebugInfo(null);
    setResult(null);
    setLoadingStage('screenshot');
    
    try {
      console.log('Submitting request for URL:', url);
      
      // Step 1: Get the screenshot
      console.log('Step 1: Requesting screenshot from API...');
      const screenshotResponse = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const screenshotData = await screenshotResponse.json();
      console.log('Screenshot API response status:', screenshotResponse.status);
      
      if (!screenshotResponse.ok) {
        console.error('Screenshot API error response:', screenshotData);
        setDebugInfo(JSON.stringify(screenshotData, null, 2));
        throw new Error(screenshotData.error || 'Failed to capture screenshot');
      }

      if (!screenshotData.success || !screenshotData.screenshot) {
        console.error('Invalid screenshot API response:', screenshotData);
        setDebugInfo(JSON.stringify(screenshotData, null, 2));
        throw new Error('Invalid response from server');
      }

      console.log('Screenshot API success response received');
      console.log('Screenshot URL:', screenshotData.screenshot);
      
      // Verify the screenshot URL is accessible
      try {
        console.log('Verifying screenshot URL is accessible...');
        const imageCheckResponse = await fetch(screenshotData.screenshot, { method: 'HEAD' });
        console.log('Screenshot URL check result:', {
          status: imageCheckResponse.status,
          ok: imageCheckResponse.ok,
          contentType: imageCheckResponse.headers.get('content-type')
        });
        
        if (!imageCheckResponse.ok) {
          console.error('Screenshot URL is not accessible:', imageCheckResponse.status);
          throw new Error('Screenshot URL is not accessible. The image might not be ready.');
        }
      } catch (checkError) {
        console.error('Error checking screenshot URL:', checkError);
        setDebugInfo(JSON.stringify({
          error: 'Screenshot URL accessibility check failed',
          details: checkError instanceof Error ? checkError.message : String(checkError),
          url: screenshotData.screenshot
        }, null, 2));
        throw new Error('Failed to verify screenshot accessibility');
      }
      
      // Store the screenshot info
      setResult({
        screenshot: screenshotData.screenshot,
        metadata: screenshotData.metadata
      });
      
      // Add a small delay to ensure the screenshot is fully processed and accessible
      console.log('Adding a short delay before analysis...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Process with Vision AI
      setLoadingStage('analysis');
      console.log('Step 2: Sending screenshot for analysis...');
      
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: screenshotData.screenshot 
        }),
      });

      console.log('Analysis API response status:', analyzeResponse.status);
      const analyzeData = await analyzeResponse.json();
      
      if (!analyzeResponse.ok) {
        console.error('Analysis API error response:', analyzeData);
        setDebugInfo(JSON.stringify(analyzeData, null, 2));
        // We'll show the error but keep the screenshot
        setAnalysisError(analyzeData.error || 'Failed to analyze screenshot');
        setIsLoading(false);
        setLoadingStage(null);
        return;
      }

      if (!analyzeData.success || !analyzeData.styleGuide) {
        console.error('Invalid analysis API response:', analyzeData);
        setDebugInfo(JSON.stringify(analyzeData, null, 2));
        setAnalysisError('Invalid response from analysis server');
        setIsLoading(false);
        setLoadingStage(null);
        return;
      }

      console.log('Analysis API success response received');
      
      // Update the result with the style guide
      setResult(prevResult => ({
        ...prevResult,
        styleGuide: analyzeData.styleGuide
      }));
      
    } catch (err) {
      console.error('Error in form submission:', err);
      setError({
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
        details: err
      });
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
      link.download = `${url.replace(/[^a-z0-9]/gi, '_')}_screenshot.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            required
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Processing...
              </>
            ) : (
              <>
                Generate <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-1">Error</h4>
              <p>{error.message}</p>
              
              {debugInfo && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium">Debug Information</summary>
                  <pre className="mt-2 bg-white border border-red-100 p-3 rounded text-xs overflow-x-auto">
                    {debugInfo}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}
      
      {isLoading && loadingStage && (
        <LoadingState stage={loadingStage} />
      )}
      
      {!isLoading && result && (
        <div className="space-y-6">
          {/* Screenshot Section */}
          {result.screenshot && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Website Screenshot</h3>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Download className="h-4 w-4" /> Save Image
                </button>
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <img 
                  src={result.screenshot} 
                  alt="Website Screenshot" 
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Source URL: {url}</p>
                <p>Captured: {result.metadata?.capturedAt ? new Date(result.metadata.capturedAt).toLocaleString() : 'Unknown'}</p>
              </div>
            </div>
          )}
          
          {/* Analysis Error */}
          {analysisError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg">
              <div className="font-medium">Style Guide Generation Error</div>
              <div className="text-sm">{analysisError}</div>
              <div className="text-sm mt-2">
                The screenshot was captured successfully, but we couldn't generate a style guide.
              </div>
              
              {debugInfo && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium">Debug Information</summary>
                  <pre className="mt-2 bg-white border border-amber-100 p-3 rounded text-xs overflow-x-auto">
                    {debugInfo}
                  </pre>
                </details>
              )}
            </div>
          )}
          
          {/* Style Guide Section */}
          {result.styleGuide && (
            <StyleGuideDisplay styleGuide={result.styleGuide} />
          )}
          
          {/* Show loading for analysis if screenshot is done but style guide is pending */}
          {!analysisError && result.screenshot && !result.styleGuide && loadingStage === 'analysis' && (
            <LoadingState stage="analysis" />
          )}
        </div>
      )}
    </div>
  );
} 