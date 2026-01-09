import { Package as PackageIcon, Star } from 'lucide-react'

const Package = () => {
  const packages = [
    { id: 1, name: 'Basic Plan', price: '$9.99/month', users: 'Up to 5 users', storage: '10GB', features: ['Basic Support', 'Email Support'] },
    { id: 2, name: 'Pro Plan', price: '$29.99/month', users: 'Up to 20 users', storage: '50GB', features: ['Priority Support', '24/7 Chat', 'Advanced Analytics'] },
    { id: 3, name: 'Enterprise', price: '$99.99/month', users: 'Unlimited', storage: '500GB', features: ['Dedicated Support', 'Custom Solutions', 'SLA 99.9%'] },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Packages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <PackageIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
            </div>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-center text-gray-600">
                <span className="mr-2">👤</span> {pkg.users}
              </li>
              <li className="flex items-center text-gray-600">
                <span className="mr-2">💾</span> {pkg.storage} Storage
              </li>
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 text-green-500 mr-2" /> {feature}
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Package