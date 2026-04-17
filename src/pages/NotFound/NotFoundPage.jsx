/**
 * NotFound (404) Page Component
 */
import { Button } from '@components/ui'

const NotFoundPage = () => {
  return (
    <div className="py-32 text-center bg-background min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-semibold text-white mt-4 mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/'}>
        Go Back Home
      </Button>
    </div>
  )
}

export default NotFoundPage

