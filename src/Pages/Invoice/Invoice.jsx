import { useState, useEffect } from 'react'
import { Download, Eye, Printer, Plus, Search, Filter, Calendar, FileText, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Mock data for invoices
const initialInvoices = [
  { 
    id: 'INV-001', 
    date: '2024-01-15', 
    dueDate: '2024-02-15',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 890',
      address: '123 Main St, New York, NY 10001'
    },
    items: [
      { description: 'Enterprise Plan - Monthly', quantity: 1, price: 99.99 },
      { description: 'Additional Storage (50GB)', quantity: 2, price: 10.00 }
    ],
    subtotal: 119.99,
    tax: 9.60,
    total: 129.59,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    notes: 'Thank you for your business!'
  },
  { 
    id: 'INV-002', 
    date: '2024-01-14', 
    dueDate: '2024-02-14',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 891',
      address: '456 Oak Ave, San Francisco, CA 94107'
    },
    items: [
      { description: 'Pro Plan - Monthly', quantity: 1, price: 29.99 }
    ],
    subtotal: 29.99,
    tax: 2.40,
    total: 32.39,
    status: 'Pending',
    paymentMethod: 'PayPal',
    notes: 'Please make payment within 30 days'
  },
  { 
    id: 'INV-003', 
    date: '2024-01-13', 
    dueDate: '2024-02-13',
    customer: {
      name: 'Acme Corp',
      email: 'billing@acme.com',
      phone: '+1 234 567 892',
      address: '789 Corporate Blvd, Chicago, IL 60601'
    },
    items: [
      { description: 'Enterprise Plan - Yearly', quantity: 1, price: 999.99 },
      { description: 'Premium Support', quantity: 1, price: 199.99 },
      { description: 'Custom Domain', quantity: 2, price: 25.00 }
    ],
    subtotal: 1249.98,
    tax: 100.00,
    total: 1349.98,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    notes: 'Corporate discount applied'
  },
  { 
    id: 'INV-004', 
    date: '2024-01-12', 
    dueDate: '2024-02-12',
    customer: {
      name: 'Tech Solutions',
      email: 'accounts@techsolutions.com',
      phone: '+1 234 567 893',
      address: '321 Tech Park, Austin, TX 78701'
    },
    items: [
      { description: 'Pro Plan - Yearly', quantity: 1, price: 299.99 },
      { description: 'Additional Users (5)', quantity: 1, price: 49.99 }
    ],
    subtotal: 349.98,
    tax: 28.00,
    total: 377.98,
    status: 'Overdue',
    paymentMethod: 'Credit Card',
    notes: 'Payment reminder sent'
  },
  { 
    id: 'INV-005', 
    date: '2024-01-11', 
    dueDate: '2024-02-11',
    customer: {
      name: 'Digital Agency Inc',
      email: 'finance@digitalagency.com',
      phone: '+1 234 567 894',
      address: '654 Design Blvd, Miami, FL 33101'
    },
    items: [
      { description: 'Basic Plan - Monthly', quantity: 3, price: 9.99 }
    ],
    subtotal: 29.97,
    tax: 2.40,
    total: 32.37,
    status: 'Draft',
    paymentMethod: '',
    notes: 'Invoice in draft mode'
  },
]

const Invoice = () => {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [filteredInvoices, setFilteredInvoices] = useState(initialInvoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')

  // Calculate stats
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'Paid').length,
    pending: invoices.filter(inv => inv.status === 'Pending').length,
    overdue: invoices.filter(inv => inv.status === 'Overdue').length,
    draft: invoices.filter(inv => inv.status === 'Draft').length,
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.total, 0)
  }

  // Filter invoices
  useEffect(() => {
    let result = invoices

    // Apply search filter
    if (searchTerm) {
      result = result.filter(invoice =>
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(invoice => invoice.status === filterStatus)
    }

    // Apply date filter
    if (filterDate !== 'all') {
      const today = new Date()
      const last30Days = new Date(today.setDate(today.getDate() - 30))
      const last90Days = new Date(today.setDate(today.getDate() - 60)) // Already subtracted 30

      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.date)
        switch (filterDate) {
          case 'today':
            return invoiceDate.toDateString() === new Date().toDateString()
          case 'week':
            return invoiceDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          case 'month':
            return invoiceDate > last30Days
          case 'quarter':
            return invoiceDate > last90Days
          default:
            return true
        }
      })
    }

    setFilteredInvoices(result)
  }, [searchTerm, filterStatus, filterDate, invoices])

  // Handle download as PDF
  const handleDownloadPDF = (invoice) => {
    // Create a temporary div for the invoice
    const invoiceDiv = document.createElement('div')
    invoiceDiv.style.position = 'absolute'
    invoiceDiv.style.left = '-9999px'
    invoiceDiv.innerHTML = `
      <div id="invoice-pdf" style="width: 800px; padding: 40px; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <h1 style="color: #4f46e5; font-size: 32px; margin: 0;">Invoice</h1>
            <p style="color: #6b7280; margin: 5px 0;">${invoice.id}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${invoice.date}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${invoice.dueDate}</p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <h3 style="margin-bottom: 10px;">From:</h3>
            <p style="margin: 5px 0;"><strong>Your Company Name</strong></p>
            <p style="margin: 5px 0;">123 Business Rd</p>
            <p style="margin: 5px 0;">City, State 12345</p>
            <p style="margin: 5px 0;">contact@company.com</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin-bottom: 10px;">Bill To:</h3>
            <p style="margin: 5px 0;"><strong>${invoice.customer.name}</strong></p>
            <p style="margin: 5px 0;">${invoice.customer.email}</p>
            <p style="margin: 5px 0;">${invoice.customer.phone}</p>
            <p style="margin: 5px 0;">${invoice.customer.address}</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Description</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #d1d5db;">Quantity</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">Price</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td style="padding: 12px; border: 1px solid #d1d5db;">${item.description}</td>
                <td style="padding: 12px; text-align: center; border: 1px solid #d1d5db;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">$${item.price.toFixed(2)}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-left: auto; width: 300px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Subtotal:</span>
            <span>$${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Tax:</span>
            <span>$${invoice.tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; font-size: 18px;">
            <span>Total:</span>
            <span>$${invoice.total.toFixed(2)}</span>
          </div>
          <div style="padding: 10px; background-color: ${invoice.status === 'Paid' ? '#d1fae5' : 
          invoice.status === 'Pending' ? '#fef3c7' : 
          invoice.status === 'Overdue' ? '#fee2e2' : '#f3f4f6'}; 
          text-align: center; border-radius: 6px; margin-bottom: 20px;">
            <strong>Status: ${invoice.status}</strong>
          </div>
          ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        </div>
        
        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #d1d5db; color: #6b7280; font-size: 12px; text-align: center;">
          <p>Thank you for your business!</p>
          <p>If you have any questions, please contact us at contact@company.com</p>
        </div>
      </div>
    `
    
    document.body.appendChild(invoiceDiv)
    
    html2canvas(invoiceDiv).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = canvas.height * imgWidth / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${invoice.id}.pdf`)
      document.body.removeChild(invoiceDiv)
    })
  }

  // Handle print
  const handlePrint = (invoice) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${invoice.id} - Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 40px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 12px; border: 1px solid #ddd; }
          th { background-color: #f3f4f6; }
          .total-section { margin-left: auto; width: 300px; }
          .status { padding: 10px; text-align: center; border-radius: 6px; margin-bottom: 20px; }
          .paid { background-color: #d1fae5; }
          .pending { background-color: #fef3c7; }
          .overdue { background-color: #fee2e2; }
          .draft { background-color: #f3f4f6; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div>
            <h1 style="color: #4f46e5;">Invoice</h1>
            <p>${invoice.id}</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Date:</strong> ${invoice.date}</p>
            <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
          </div>
        </div>
        
        <div class="invoice-details">
          <div>
            <h3>From:</h3>
            <p><strong>Your Company Name</strong></p>
            <p>123 Business Rd</p>
            <p>City, State 12345</p>
            <p>contact@company.com</p>
          </div>
          <div style="text-align: right;">
            <h3>Bill To:</h3>
            <p><strong>${invoice.customer.name}</strong></p>
            <p>${invoice.customer.email}</p>
            <p>${invoice.customer.phone}</p>
            <p>${invoice.customer.address}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Subtotal:</span>
            <span>$${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Tax:</span>
            <span>$${invoice.tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; font-size: 18px;">
            <span>Total:</span>
            <span>$${invoice.total.toFixed(2)}</span>
          </div>
          <div class="status ${invoice.status.toLowerCase()}">
            <strong>Status: ${invoice.status}</strong>
          </div>
          ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>If you have any questions, please contact us at contact@company.com</p>
        </div>
        
        <button class="no-print" onclick="window.print()" style="position: fixed; top: 20px; right: 20px; padding: 10px 20px; background-color: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Print Invoice
        </button>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <Filter className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-500">Manage your invoices and payments</p>
          </div>
          <Link
            to="/invoice/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Invoice
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="pl-10 w-full border border-gray-300 rounded-lg p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{invoice.id}</div>
                    <div className="text-sm text-gray-500">{invoice.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{invoice.customer.name}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-3 w-3 mr-1" /> {invoice.customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{invoice.date}</td>
                  <td className="px-6 py-4">
                    <span className={`${new Date(invoice.dueDate) < new Date() ? 'text-red-600' : 'text-gray-500'}`}>
                      {invoice.dueDate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">${invoice.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">
                      ${invoice.subtotal.toFixed(2)} + ${invoice.tax.toFixed(2)} tax
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/invoice/view/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Download PDF"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handlePrint(invoice)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Print"
                      >
                        <Printer className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-500 mb-4">
            {invoices.length === 0 
              ? 'Start by creating your first invoice.' 
              : 'Try adjusting your filters or search term.'}
          </p>
          {invoices.length === 0 && (
            <Link
              to="/invoice/create"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Invoice
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default Invoice