import { Metadata } from 'next'
import EmailReveal from './EmailReveal'

export const metadata: Metadata = {
  title: 'MVP Build Service | Alex Christou',
  description: 'Get your product built and launched within a week - guaranteed',
}

export default function MVPBuild() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">MVP Build Service</h1>
          
          <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
            <p>
              You're frustrated with AI dev tools that promised the world but aren't working out.
            </p>
            
            <p>
              You're in a state of constant debugging. You fix one thing, another breaks.
              Sure - you've built parts, but stumped on how you can keep the product moving forward.
            </p>

            <p>
              You want to get your product out to the world. Building was meant to be a breeze with AI - but you just can't get it to do what you want..
            </p>

            <p>
              But what if you could? What if you could bring your exact idea to life - into users hands' by next week..
              You can focus on doing what you do best..
            </p>

            <p>
              It's true - people get stuck in the build trap for months (it's happened to me..)
              But you don't have to.
            </p>

            <p>
              Bring your ideas to life with my MVP build service.
            </p>

            <p>
              Kickstart with your sketches, designs and ideas. Get your live product within 1 week of kickoff (or your money back).
              Bring your product to life with full confidence.
            </p>

            <p>
              I have slots open. Drop me an email: alex@stener.co.uk and let's get things moving.
            </p>

            <p>
              You'll be enjoying your fully built product in no time.
            </p>

            <p>
              All the best,<br />
              @mvp-build
            </p>
          </div>

          <EmailReveal />
        </div>
      </div>
    </main>
  )
} 