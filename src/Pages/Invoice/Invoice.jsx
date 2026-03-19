import { useState, useEffect } from 'react'
import { FileText, Calendar, BarChart2, Search, Download, Printer } from 'lucide-react'
import invoiceService from '../../services/invoiceService'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getRupeeSymbol = () => '₹'

const Invoice = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus === 'all' ? undefined : filterStatus.toLowerCase(),
        search: searchTerm || undefined
      }
      const response = await invoiceService.getAllInvoices(params)
      if (response.success) {
        setInvoices(response.data.invoices)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      toast.error('Error fetching invoices')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvoices()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, filterStatus, pagination.page])

  const stats = {
    total: pagination.total,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    failed: invoices.filter(inv => inv.status === 'failed').length,
    totalRevenue: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
  }

  // Filter invoices
  useEffect(() => {
    let result = invoices

    // Apply search filter
    if (searchTerm) {
      result = result.filter(invoice =>
        invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(invoice => invoice.status === filterStatus)
    }

    // Apply date filter
    if (filterDate !== 'all') {
      const today = new Date()
      const last30Days = new Date(new Date().setDate(today.getDate() - 30))
      const last90Days = new Date(new Date().setDate(today.getDate() - 90))

      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.payment_date)
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
    const invoiceDiv = document.createElement('div')
    invoiceDiv.style.position = 'absolute'
    invoiceDiv.style.left = '-9999px'
    invoiceDiv.innerHTML = `
      <div id="invoice-pdf" style="width: 800px; padding: 40px; font-family: Arial, sans-serif; background: white;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <h1 style="color: #4f46e5; font-size: 32px; margin: 0;">Tax Invoice</h1>
            <p style="color: #6b7280; margin: 5px 0;">${invoice.invoice_number}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(invoice.payment_date).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <h3 style="margin-bottom: 10px;">Company:</h3>
            <p style="margin: 5px 0;"><strong>Trading Pro</strong></p>
            <p style="margin: 5px 0;">Admin Office</p>
            <p style="margin: 5px 0;">contact@tradingpro.com</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin-bottom: 10px;">Bill To:</h3>
            <p style="margin: 5px 0;"><strong>${invoice.user_id?.name || 'Customer'}</strong></p>
            <p style="margin: 5px 0;">${invoice.user_id?.email || ''}</p>
            <p style="margin: 5px 0;">${invoice.user_id?.phone || ''}</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Description</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">Price</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #d1d5db;">${invoice.subscription_id?.name || 'Subscription Plan'}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">${getRupeeSymbol()}${invoice.amount.toFixed(2)}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">${getRupeeSymbol()}${invoice.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin-left: auto; width: 300px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; font-size: 18px;">
            <span>Grand Total:</span>
            <span>${getRupeeSymbol()}${invoice.amount.toFixed(2)}</span>
          </div>
          <p style="font-size: 14px; color: #6b7280;">Payment ID: ${invoice.razorpay_payment_id}</p>
        </div>
        
        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #d1d5db; color: #6b7280; font-size: 12px; text-align: center;">
          <p>This is a computer-generated invoice.</p>
        </div>
      </div>
    `

    document.body.appendChild(invoiceDiv)

    html2canvas(invoiceDiv).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = canvas.height * imgWidth / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${invoice.invoice_number}.pdf`)
      document.body.removeChild(invoiceDiv)
    })
  }

  // Handle print
  const handlePrint = (invoice) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>Invoice ${invoice.invoice_number}</title></head>
        <body onload="window.print();window.close()">
          <div style="padding: 40px; font-family: sans-serif;">
            <h1>Tax Invoice</h1>
            <p>Invoice No: ${invoice.invoice_number}</p>
            <p>Customer: ${invoice.user_id?.name}</p>
            <p>Plan: ${invoice.subscription_id?.name}</p>
            <p>Amount: ${getRupeeSymbol()}${invoice.amount}</p>
            <p>Payment ID: ${invoice.razorpay_payment_id}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
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
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-500">Real-time subscription invoices from backend</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoice or ID..."
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{invoice.invoice_number}</div>
                      <div className="text-xs text-gray-400">{invoice.razorpay_payment_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{invoice.user_id?.name || 'Deleted User'}</div>
                      <div className="text-xs text-gray-500">{invoice.user_id?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(invoice.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleDownloadPDF(invoice)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Download PDF"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePrint(invoice)}
                          className="text-gray-600 hover:text-gray-900"
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
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPagination({ ...pagination, page: i + 1 })}
              className={`px-3 py-1 rounded ${pagination.page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && invoices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No invoices found</h3>
          <p className="text-gray-500">Try adjusting your filters or wait for new subscriptions.</p>
        </div>
      )}
    </div>
  )
}


export default Invoice