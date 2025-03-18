import { Metadata } from "next";
import DesignFeedbackForm from '@/components/DesignFeedbackForm';

export const metadata: Metadata = {
  title: 'Design Feedback - Alex Christou',
  description: 'Get expert UI/UX feedback on your designs using AI',
};

export default function DesignFeedbackPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Design Feedback</h1>
        <p className="text-gray-600 mb-8">Get expert UI/UX feedback on your designs using AI</p>
        
        <DesignFeedbackForm />
      </div>
    </main>
  );
} 