import WebStyleForm from '@/components/WebStyleForm';

export const metadata = {
  title: 'Design Prompt Generator',
  description: 'Generate AI-powered design system prompts from any website',
};

export default function DesignPromptPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Design Prompt Generator</h1>
        <p className="text-gray-600 mb-8">Generate AI powered design system prompts from any website</p>
        
        <WebStyleForm />
      </div>
    </main>
  );
} 