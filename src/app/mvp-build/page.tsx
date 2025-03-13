import { Metadata } from 'next'
import EmailReveal from './EmailReveal'

export const metadata: Metadata = {
  title: 'MVP Build Service [BETA] | Alex Christou',
  description: 'Get help building your MVP - A beta service offering from Alex Christou',
}

export default function MVPBuild() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">MVP Build Service</h1>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              BETA
            </span>
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-300">
            After seeing demand from viewers, I'm trialling an MVP service. If you want to chat about your project and if I could help out - please drop me an email below:
          </p>

          <EmailReveal />
        </div>
      </div>
    </main>
  )
} 