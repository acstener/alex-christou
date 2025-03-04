'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Download, Copy, AlertCircle } from 'lucide-react';

export default function WebStyleForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    screenshot?: string;
    styleGuide?: string;
    metadata?: any;
  } | null>(null);
  const [error, setError] = useState<{
    message: string;
    details?: any;
  } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);
    setResult(null);

    try {
      console.log('Submitting request for URL:', url);
      
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API error response:', data);
        setDebugInfo(JSON.stringify(data, null, 2));
        throw new Error(data.error || 'Failed to process website');
      }

      if (!data.success || !data.screenshot) {
        console.error('Invalid API response:', data);
        setDebugInfo(JSON.stringify(data, null, 2));
        throw new Error('Invalid response from server');
      }

      console.log('API success response:', data);
      setResult(data);
    } catch (err) {
      console.error('Error in form submission:', err);
      setError({
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
        details: err
      });
    } finally {
      setIsLoading(false);
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

      {result?.screenshot && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Website Screenshot</h3>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
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
    </div>
  );
} 