import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Blog />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/create" element={<CreateBlog />} />
          <Route path="blog/view/:id" element={<ViewBlog />} />
          <Route path="blog/edit/:id" element={<EditBlog />} />
          <Route path="package" element={<Package />} />
          <Route path="user" element={<User />} />
          <Route path="user/details/:id" element={<UserDetails />} />
          <Route path="user/edit/:id" element={<EditUser />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="invoice/view/:id" element={<ViewInvoice />} />
          <Route path="invoice/create/:id" element={<CreateInvoice />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App