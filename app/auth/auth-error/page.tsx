export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="mt-2">
          There was an error with the authentication process. Please try again or contact support if the problem persists.
        </p>
        <a 
          href="/login" 
          className="mt-4 inline-block rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Return to Login
        </a>
      </div>
    </div>
  )
} 