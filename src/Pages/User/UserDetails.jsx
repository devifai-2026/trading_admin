import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Globe, 
  MapPin, 
  Package, 
  Shield,
  FileText,
  MessageSquare,
  CreditCard,
  CheckCircle,
  XCircle,
  Edit,
  Download,
  IndianRupee
} from 'lucide-react'

// Mock data for users
const mockUsers = {
  1: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    role: 'Admin',
    status: 'Active',
    joinDate: '2024-01-15',
    lastLogin: '2024-02-20 14:30:00',
    package: {
      name: 'Enterprise',
      price: '₹8,299/month',
      features: [
        'Unlimited Users',
        '500GB Storage',
        'Dedicated Support',
        'Custom Solutions',
        'SLA 99.9%',
        'Advanced Analytics'
      ],
      billingCycle: 'Monthly',
      nextBillingDate: '2024-03-20',
      subscriptionId: 'SUB-789012'
    },
    postsWritten: 45,
    comments: 128,
    bio: 'Senior developer with 8+ years of experience in web development. Specializes in React, Node.js, and cloud architecture.',
    location: 'New York, USA',
    website: 'https://johndoe.dev',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    socialLinks: {
      twitter: '@johndoe',
      github: 'johndoe',
      linkedin: 'in/johndoe'
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  2: {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234 567 891',
    role: 'Editor',
    status: 'Active',
    joinDate: '2024-01-14',
    lastLogin: '2024-02-19 09:15:00',
    package: {
      name: 'Pro Plan',
      price: '₹2,499/month',
      features: [
        'Up to 20 Users',
        '50GB Storage',
        'Priority Support',
        '24/7 Chat Support',
        'Advanced Analytics'
      ],
      billingCycle: 'Monthly',
      nextBillingDate: '2024-03-19',
      subscriptionId: 'SUB-789013'
    },
    postsWritten: 23,
    comments: 56,
    bio: 'Content creator and technical writer specializing in frontend technologies. Passionate about UX/UI design.',
    location: 'San Francisco, USA',
    website: 'https://janesmith.blog',
    skills: ['JavaScript', 'CSS', 'UI/UX', 'Technical Writing'],
    socialLinks: {
      twitter: '@janesmith',
      github: 'janesmith',
      linkedin: 'in/janesmith'
    },
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  3: {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 234 567 892',
    role: 'Author',
    status: 'Inactive',
    joinDate: '2024-01-13',
    lastLogin: '2024-02-01 16:45:00',
    package: {
      name: 'Basic Plan',
      price: '₹799/month',
      features: [
        'Up to 5 Users',
        '10GB Storage',
        'Basic Support',
        'Email Support'
      ],
      billingCycle: 'Monthly',
      nextBillingDate: '2024-03-01',
      subscriptionId: 'SUB-789014'
    },
    postsWritten: 12,
    comments: 34,
    bio: 'Freelance writer focusing on technology tutorials and guides. Enjoys breaking down complex topics for beginners.',
    location: 'Chicago, USA',
    website: 'https://bobjohnson.com',
    skills: ['Technical Writing', 'Research', 'Content Strategy'],
    socialLinks: {
      twitter: '@bobjohnson',
      github: 'bobjohnson',
      linkedin: 'in/bobjohnson'
    },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch user data from API
    const foundUser = mockUsers[id]
    if (foundUser) {
      setUser(foundUser)
    } else {
      navigate('/user')
    }
    setIsLoading(false)
  }, [id, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
        <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/user')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Back to Users
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button and header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/user')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Users
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-500">View and manage user information</p>
          </div>
        
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end -mt-16">
                <div className="flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                      <p className="text-gray-600">{user.bio}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{user.postsWritten}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{user.comments}</div>
                  <div className="text-sm text-gray-500">Comments</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-500">Engagement</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a href={user.website} className="font-medium text-indigo-600 hover:text-indigo-800">
                        {user.website}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{user.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {user.socialLinks && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Profiles</h3>
                  <div className="flex space-x-4">
                    {user.socialLinks.twitter && (
                      <a
                        href={`https://twitter.com/${user.socialLinks.twitter.replace('@', '')}`}
                        className="text-blue-400 hover:text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Twitter
                      </a>
                    )}
                    {user.socialLinks.github && (
                      <a
                        href={`https://github.com/${user.socialLinks.github}`}
                        className="text-gray-700 hover:text-gray-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    )}
                    {user.socialLinks.linkedin && (
                      <a
                        href={`https://linkedin.com/${user.socialLinks.linkedin}`}
                        className="text-blue-700 hover:text-blue-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Published new article</p>
                  <p className="text-sm text-gray-500">"Advanced React Patterns"</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Commented on post</p>
                  <p className="text-sm text-gray-500">"Great insights on performance optimization!"</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Role updated</p>
                  <p className="text-sm text-gray-500">Changed from Author to Editor</p>
                  <p className="text-xs text-gray-400">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Package Details & Info */}
        <div className="space-y-6">
          {/* Package Details Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Package Details</h3>
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xl font-bold ${
                  user.package.name === 'Enterprise' ? 'text-purple-600' :
                  user.package.name === 'Pro Plan' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {user.package.name}
                </span>
                <span className="text-lg font-semibold text-gray-900">{user.package.price}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{user.package.billingCycle} subscription</p>
              
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-gray-900">Package Features:</h4>
                <ul className="space-y-1">
                  {user.package.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subscription ID:</span>
                  <span className="text-sm font-medium">{user.package.subscriptionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Next Billing:</span>
                  <span className="text-sm font-medium">{user.package.nextBillingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
                Upgrade Package
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                View Invoice History
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">User ID:</span>
                <span className="text-sm font-medium">#{user.id.toString().padStart(6, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Joined:</span>
                <span className="text-sm font-medium">{user.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Login:</span>
                <span className="text-sm font-medium">{user.lastLogin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Role:</span>
                <span className={`text-sm font-medium ${
                  user.role === 'Admin' ? 'text-purple-600' :
                  user.role === 'Editor' ? 'text-blue-600' :
                  user.role === 'Author' ? 'text-green-600' :
                  'text-gray-600'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Billing Information</h3>
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Method:</span>
                <span className="text-sm font-medium">Visa •••• 4242</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Billing Email:</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Spent:</span>
                <span className="text-sm font-medium">₹49,799.64</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Update Payment Method
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                Reset Password
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                Send Email
              </button>
              <button className="w-full border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50">
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails