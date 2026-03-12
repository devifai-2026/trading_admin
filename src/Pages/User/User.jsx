import { useState } from 'react'
import { UserCheck, UserX, Mail, Phone, Eye, Edit, Trash2, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

// Mock data for users
const initialUsers = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    phone: '+1 234 567 890', 
    role: 'Admin', 
    status: 'Active',
    joinDate: '2024-01-15',
    lastLogin: '2024-02-20',
    package: 'Enterprise',
    packageExpiry: '2024-12-31',
    postsWritten: 45,
    comments: 128,
    bio: 'Senior developer with 8+ years of experience in web development.',
    location: 'New York, USA',
    website: 'https://johndoe.dev'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    phone: '+1 234 567 891', 
    role: 'Editor', 
    status: 'Active',
    joinDate: '2024-01-14',
    lastLogin: '2024-02-19',
    package: 'Pro Plan',
    packageExpiry: '2024-11-30',
    postsWritten: 23,
    comments: 56,
    bio: 'Content creator and technical writer specializing in frontend technologies.',
    location: 'San Francisco, USA',
    website: 'https://janesmith.blog'
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    phone: '+1 234 567 892', 
    role: 'Author', 
    status: 'Inactive',
    joinDate: '2024-01-13',
    lastLogin: '2024-02-01',
    package: 'Basic Plan',
    packageExpiry: '2024-10-31',
    postsWritten: 12,
    comments: 34,
    bio: 'Freelance writer focusing on technology tutorials and guides.',
    location: 'Chicago, USA',
    website: 'https://bobjohnson.com'
  },
  { 
    id: 4, 
    name: 'Alice Brown', 
    email: 'alice@example.com', 
    phone: '+1 234 567 893', 
    role: 'Subscriber', 
    status: 'Active',
    joinDate: '2024-01-12',
    lastLogin: '2024-02-18',
    package: 'Pro Plan',
    packageExpiry: '2024-09-30',
    postsWritten: 0,
    comments: 89,
    bio: 'Digital marketing specialist interested in tech trends.',
    location: 'Austin, USA',
    website: 'https://alicebrown.digital'
  },
]

const User = () => {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPackage, setFilterPackage] = useState('all')

  // Handle delete
  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="font-semibold text-gray-800">Delete this user?</p>
        <p className="text-sm text-gray-600">The user will be permanently removed from the system. This cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setUsers(users.filter(user => user.id !== id));
              toast.success('User deleted successfully');
            }}
            className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        minWidth: '320px',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #fee2e2'
      }
    });
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    // Role filter
    const matchesRole = filterRole === 'all' || user.role === filterRole
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    
    // Package filter
    const matchesPackage = filterPackage === 'all' || user.package === filterPackage

    return matchesSearch && matchesRole && matchesStatus && matchesPackage
  })

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(user => user.status === 'Active').length,
    inactive: users.filter(user => user.status === 'Inactive').length,
    admins: users.filter(user => user.role === 'Admin').length,
    editors: users.filter(user => user.role === 'Editor').length,
    authors: users.filter(user => user.role === 'Author').length,
    subscribers: users.filter(user => user.role === 'Subscriber').length,
  }

  // Get unique values for filters
  const roles = ['all', ...new Set(users.map(user => user.role))]
  const statuses = ['all', ...new Set(users.map(user => user.status))]
  const packages = ['all', ...new Set(users.map(user => user.package))]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Inactive Users</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-500">Manage your blog users and permissions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 w-full border border-gray-300 rounded-lg p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={filterPackage}
              onChange={(e) => setFilterPackage(e.target.value)}
            >
              {packages.map(pkg => (
                <option key={pkg} value={pkg}>
                  {pkg === 'all' ? 'All Packages' : pkg}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-800 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">Joined {user.joinDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" /> {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2" /> {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'Editor' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'Author' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${
                        user.package === 'Enterprise' ? 'text-purple-600' :
                        user.package === 'Pro Plan' ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {user.package}
                      </span>
                      <span className="text-xs text-gray-500">
                        Expires: {user.packageExpiry}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/user/details/${user.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/user/edit/${user.id}`}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Edit User"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete User"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {users.length === 0 
                  ? 'No users in the system.' 
                  : 'Try adjusting your filters or search term.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default User