import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  Receipt,
  Menu,
  X,
  Search,
  Bell,
  UserCircle,
  LogOut,
  BookOpen,
  TrendingUp
} from 'lucide-react'

const DashboardLayout = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const navigation = [
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Package', href: '/package', icon: Package },
    { name: 'User', href: '/user', icon: Users },
    { name: 'Invoice', href: '/invoice', icon: Receipt },
    { name: 'Course', href: '/course', icon: BookOpen },
    { name: 'Trade', href: '/trade', icon: TrendingUp },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center ml-4 lg:ml-0">
                <LayoutDashboard className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">Blog Dashboard</span>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search..."
                />
              </div>

              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>

              <div className="flex items-center">
                <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                  <UserCircle className="h-8 w-8 text-gray-400" />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 pt-16 lg:block lg:translate-x-0 transition-transform duration-300"
           style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="h-full overflow-y-auto">
          <nav className="px-4 py-6">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    end
                  >
                    <Icon className={`mr-3 h-5 w-5 flex-shrink-0`} />
                    {item.name}
                  </NavLink>
                )
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default DashboardLayout