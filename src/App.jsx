import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import Blog from './Pages/Blog/Blog'
import Package from './Pages/Package/Package'
import User from './Pages/User/User'
import Invoice from './Pages/Invoice/Invoice'
import ViewBlog from './Pages/Blog/ViewBlog'
import EditBlog from './Pages/Blog/EditBlog'
import CreateBlog from './Pages/Blog/CreateBlog'
import UserDetails from './Pages/User/UserDetails'
import EditUser from './Pages/User/EditUser'
import ViewInvoice from './Pages/Invoice/ViewInvoice'
import CreateInvoice from './Pages/Invoice/CreateInvoice'
import AddPackage from './Pages/Package/AddPackage'
import EditPackage from './Pages/Package/EditPackage'
import Login from './Pages/Auth/Login/Login'
import { useState, useEffect } from 'react'
import Course from './Pages/Course/Course'
import AddCourse from './Pages/Course/AddCourse'
import EditCourse from './Pages/Course/EditCourse'
import ViewCourse from './Pages/Course/ViewCourse'

// Dummy user credentials
const DUMMY_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'password123'
}

// Key for localStorage
const AUTH_KEY = 'dashboard_auth'

function App() {
  // Initialize auth state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY)
    return savedAuth ? JSON.parse(savedAuth) : false
  })

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(isAuthenticated))
  }, [isAuthenticated])

  const handleLogin = (email, password) => {
    // Check against dummy credentials
    if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
      const userData = {
        isAuthenticated: true,
        email: email,
        timestamp: new Date().toISOString()
      }
      setIsAuthenticated(userData)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    // Clear all localStorage items related to auth
    localStorage.removeItem(AUTH_KEY)
  }

  // Check if token is still valid (optional: add expiration check)
  const isTokenValid = () => {
    if (!isAuthenticated || !isAuthenticated.isAuthenticated) return false
    
    // Optional: Check if token is expired (24 hours)
    if (isAuthenticated.timestamp) {
      const loginTime = new Date(isAuthenticated.timestamp)
      const currentTime = new Date()
      const hoursDiff = (currentTime - loginTime) / (1000 * 60 * 60)
      
      if (hoursDiff > 24) {
        handleLogout()
        return false
      }
    }
    
    return true
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isTokenValid() ? (
            <Navigate to="/" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
        
        <Route path="/" element={
          isTokenValid() ? (
            <DashboardLayout onLogout={handleLogout} userEmail={isAuthenticated.email} />
          ) : (
            <Navigate to="/login" replace />
          )
        }>
          <Route index element={<Navigate to="/blog" replace />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/create" element={<CreateBlog />} />
          <Route path="blog/view/:id" element={<ViewBlog />} />
          <Route path="blog/edit/:id" element={<EditBlog />} />
          <Route path="package" element={<Package />} />
          <Route path="package/add" element={<AddPackage />} />
          <Route path="package/edit/:id" element={<EditPackage />} />
          <Route path="user" element={<User />} />
          <Route path="user/details/:id" element={<UserDetails />} />
          <Route path="user/edit/:id" element={<EditUser />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="invoice/view/:id" element={<ViewInvoice />} />
          <Route path="invoice/create" element={<CreateInvoice />} />
          <Route path="course" element={<Course />} />
          <Route path="course/add" element={<AddCourse />} />
          <Route path="course/edit/:id" element={<EditCourse />} />
          <Route path="course/view/:id" element={<ViewCourse />} />
        </Route>

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App