import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Package, 
  Shield,
  Calendar,
  X,
  Trash2
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
      price: '$99.99/month',
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
    bio: 'Senior developer with 8+ years of experience in web development.',
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
      price: '$29.99/month',
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
    bio: 'Content creator and technical writer specializing in frontend technologies.',
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
      price: '$9.99/month',
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
    bio: 'Freelance writer focusing on technology tutorials and guides.',
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

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    // In a real app, you would fetch user data from API
    const foundUser = mockUsers[id]
    if (foundUser) {
      setUser(foundUser)
      setSkills(foundUser.skills || [])
      
      // Reset form with user data
      reset({
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role,
        status: foundUser.status,
        bio: foundUser.bio,
        location: foundUser.location,
        website: foundUser.website,
        package: foundUser.package.name,
        twitter: foundUser.socialLinks?.twitter || '',
        github: foundUser.socialLinks?.github || '',
        linkedin: foundUser.socialLinks?.linkedin || '',
      })
    } else {
      navigate('/user')
    }
    setIsLoading(false)
  }, [id, navigate, reset])

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const onSubmit = (data) => {
    const updatedUser = {
      ...user,
      ...data,
      skills: skills,
      socialLinks: {
        twitter: data.twitter,
        github: data.github,
        linkedin: data.linkedin
      }
    }
    
    // In a real app, you would save to an API here
    console.log('User updated:', updatedUser)
    alert('User updated successfully!')
    navigate('/user')
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // In a real app, you would delete from API
      console.log('User deleted:', user.id)
      alert('User deleted successfully!')
      navigate('/user')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
        <p className="text-gray-600 mb-4">The user you're trying to edit doesn't exist.</p>
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
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
            <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
            <p className="text-gray-500">Update user information and permissions</p>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Delete User
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className={`w-full border rounded-lg p-3 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder="Tell us about yourself"
                  {...register('bio')}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className={`w-full border rounded-lg p-3 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    className={`w-full border rounded-lg p-3 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+1 234 567 890"
                    {...register('phone', { required: 'Phone is required' })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="City, Country"
                    {...register('location')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="https://example.com"
                    {...register('website')}
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
              <div className="flex mb-3">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded-l-lg p-3"
                  placeholder="Add a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-4 hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Profiles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="@username"
                    {...register('twitter')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="username"
                    {...register('github')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="in/username"
                    {...register('linkedin')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-3"
                    {...register('role', { required: 'Role is required' })}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Author">Author</option>
                    <option value="Subscriber">Subscriber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-3"
                    {...register('status', { required: 'Status is required' })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-3"
                    {...register('package', { required: 'Package is required' })}
                  >
                    <option value="Enterprise">Enterprise - $99.99/month</option>
                    <option value="Pro Plan">Pro Plan - $29.99/month</option>
                    <option value="Basic Plan">Basic Plan - $9.99/month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
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
                  <span className="text-sm text-gray-500">Posts Written:</span>
                  <span className="text-sm font-medium">{user.postsWritten}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Comments:</span>
                  <span className="text-sm font-medium">{user.comments}</span>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Current Package</h2>
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${
                    user.package.name === 'Enterprise' ? 'text-purple-600' :
                    user.package.name === 'Pro Plan' ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {user.package.name}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{user.package.price}</span>
                </div>
                
                <div className="space-y-1 mb-4">
                  {user.package.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <span className="h-1 w-1 rounded-full bg-gray-400 mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subscription ID:</span>
                    <span className="text-sm font-medium">{user.package.subscriptionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Next Billing:</span>
                    <span className="text-sm font-medium">{user.package.nextBillingDate}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View Package Details →
              </button>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/user')}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditUser