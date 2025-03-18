import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  stage: 'screenshot' | 'upload' | 'analysis';
}

export default function LoadingState({ stage }: LoadingStateProps) {
  const getMessage = () => {
    switch (stage) {
      case 'screenshot':
        return 'Capturing screenshot...';
      case 'upload':
        return 'Uploading image...';
      case 'analysis':
        return 'Analyzing design...';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="flex items-center justify-center p-8 text-gray-600">
      <Loader2 className="animate-spin h-5 w-5 mr-2" />
      <span>{getMessage()}</span>
    </div>
  );
} 