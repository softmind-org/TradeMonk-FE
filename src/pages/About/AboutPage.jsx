/**
 * About Page Component
 */
import { MainLayout } from '@layouts'
import { Card } from '@components/ui'

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are dedicated to providing the best trading experience with cutting-edge technology and unparalleled support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At TradeMonk, our mission is to democratize trading by providing accessible, 
                powerful tools that help everyone make informed investment decisions. 
                We believe in transparency, security, and empowering our users with knowledge.
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To become the most trusted trading platform globally, known for innovation, 
                reliability, and customer-centric approach.
              </p>
            </div>
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">10K+</h3>
                <p className="text-blue-100">Active Traders</p>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <h4 className="text-2xl font-bold">99.9%</h4>
                  <p className="text-blue-100 text-sm">Uptime</p>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold">24/7</h4>
                  <p className="text-blue-100 text-sm">Support</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default AboutPage
