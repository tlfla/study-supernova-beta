import { Settings, Database, CheckCircle } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function Setup() {
  const handleConfigureMock = () => {
    // Set environment to use mock provider
    window.location.reload() // This would normally set the env var
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <Settings className="h-8 w-8 text-primary-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Setup Required
          </h1>

          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The application needs to be configured to connect to a data source. Currently, no valid data provider is configured.
          </p>

          <div className="space-y-6 mb-8">
            <div className="text-left bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-medium text-gray-900">Mock Data (Recommended)</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Use the built-in mock data provider for development and testing. No external dependencies required.
              </p>
              <Button onClick={handleConfigureMock} size="sm">
                Use Mock Data
              </Button>
            </div>

            <div className="text-left bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Database className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-gray-900">Supabase</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Connect to a Supabase PostgreSQL database. Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
              </p>
              <p className="text-xs text-gray-500">
                Set VITE_DATA_PROVIDER=supabase
              </p>
            </div>

            <div className="text-left bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Database className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium text-gray-900">D1 Database</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Use Cloudflare D1 for edge database. Requires D1 binding configuration in wrangler.toml.
              </p>
              <p className="text-xs text-gray-500">
                Set VITE_DATA_PROVIDER=d1
              </p>
            </div>
          </div>

          <div className="text-left text-sm text-gray-500">
            <p className="mb-2">
              <strong>Current Configuration:</strong>
            </p>
            <ul className="space-y-1 text-xs">
              <li>• Data Provider: {import.meta.env.VITE_DATA_PROVIDER || 'mock'}</li>
              <li>• Environment: {import.meta.env.MODE || 'development'}</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
