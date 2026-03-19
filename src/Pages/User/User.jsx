import { useState, useEffect } from 'react'
import { UserCheck, UserX, Mail, Phone, Eye, Edit, Trash2, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import userService from '../../services/userService'

// Native date formatter
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});



const User = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPackage, setFilterPackage] = useState('all')

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers();
        if (response.success) {
          setUsers(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error(error.message || 'Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return dateFormatter.format(new Date(dateString));
    } catch (e) {
      return 'N/A';
    }
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
    const matchesPackage = filterPackage === 'all' || 
      (user.subscription?.name === filterPackage) || 
      (filterPackage === 'None' && !user.subscription)

    return matchesSearch && matchesRole && matchesStatus && matchesPackage
  })

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(user => user.isPhoneVerified).length,
    inactive: users.filter(user => !user.isPhoneVerified).length,
    admins: users.filter(user => user.role === 'admin').length,
    editors: users.filter(user => user.role === 'editor').length,
    authors: users.filter(user => user.role === 'author').length,
    subscribers: users.filter(user => user.role === 'user').length,
  }

  // Get unique values for filters
  const roles = ['all', ...new Set(users.map(user => user.role || 'user'))]
  const statuses = ['all', 'Verified', 'Unverified']
  const packages = ['all', 'None', ...new Set(users.filter(u => u.subscription).map(user => user.subscription.name))]

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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
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
                        <div className="text-sm text-gray-500">Joined {formatDate(user.createdAt)}</div>
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
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${
                        user.isSubscribed ? 'text-purple-600' : 'text-gray-400'
                      }`}>
                        {user.subscription?.name || 'None'}
                      </span>
                      {user.isSubscribed && (
                        <span className="text-xs text-gray-500">
                          Expires: {formatDate(user.subscriptionExpiry)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.isPhoneVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isPhoneVerified ? 'Verified' : 'Unverified'}
                    </span>
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