import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  stage: 'screenshot' | 'analysis';
}

export default function LoadingState({ stage }: LoadingStateProps) {
  const message = stage === 'screenshot' 
    ? 'Capturing website screenshot...' 
    : 'Analyzing design and generating style guide...';
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-4" />
      <p className="text-gray-600 text-center">
        {message}<br />
        <span className="text-sm text-gray-500">This may take a few seconds</span>
      </p>
    </div>
  );
} 