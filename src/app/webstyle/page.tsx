import WebStyleForm from '@/components/WebStyleForm';

export const metadata = {
  title: 'WebStyle - Design Style Guide Generator',
  description: 'Generate design style guides from websites with AI',
};

export default function WebStylePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">WebStyle</h1>
        <p className="text-gray-600 mb-8">Generate design style guides from websites with AI</p>
        
        <WebStyleForm />
      </div>
    </main>
  );
} 