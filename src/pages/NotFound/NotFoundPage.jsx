/**
 * NotFound (404) Page Component
 */
import { MainLayout } from '@layouts'
import { Button } from '@components/ui'

const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className="py-32 text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Button variant="primary" onClick={() => window.location.href = '/'}>
          Go Back Home
        </Button>
      </div>
    </MainLayout>
  )
}

export default NotFoundPage
