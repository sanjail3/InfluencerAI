import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  return (
    <section className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(129,_8,_172,_0.4),_black)]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Image Section */}
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Sign up visual"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
        </aside>

        {/* Form Section */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="w-full max-w-xl lg:max-w-3xl">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-gray-100">
                Join Our Community
              </h1>
              <p className="mt-3 text-lg text-gray-300">
                Create your account to get started
              </p>
            </div>

            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none w-full",
                  headerTitle: "text-2xl font-bold text-gray-100",
                  headerSubtitle: "text-gray-300",
                  formFieldLabel: "text-gray-300 font-medium",
                  formFieldInput:
                    "bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-100",
                  socialButtonsBlockButton:
                    "bg-gray-800/50 border-gray-700 text-gray-100 hover:bg-gray-700/50",
                  socialButtonsBlockButtonText: "text-gray-100",
                  dividerLine: "bg-gray-700",
                  dividerText: "text-gray-300",
                  footerActionText: "text-gray-300",
                  footerActionLink: "text-purple-400 hover:text-purple-300",
                  formButtonPrimary:
                    "bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors",
                },
              }}
              signInUrl="/sign-in"
              forceRedirectUrl="/dashboard"
            />

            <p className="mt-8 text-center text-gray-300">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </section>
  )
}