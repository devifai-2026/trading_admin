import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Edit,
  Send,
  DollarSign,
  Package as PackageIcon
} from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Mock data for invoices
const mockInvoices = {
  'INV-001': {
    id: 'INV-001',
    invoiceNumber: 'INV-001',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 890',
      address: '123 Main St, New York, NY 10001',
      company: 'John Doe Consulting'
    },
    company: {
      name: 'Your Company Name',
      email: 'contact@company.com',
      phone: '+1 800 123 4567',
      address: '123 Business Rd, City, State 12345',
      website: 'www.company.com',
      taxId: 'TAX-123456'
    },
    items: [
      { id: 1, description: 'Enterprise Plan - Monthly Subscription', quantity: 1, price: 99.99, taxRate: 8 },
      { id: 2, description: 'Additional Storage (50GB)', quantity: 2, price: 10.00, taxRate: 8 },
      { id: 3, description: 'Priority Support Add-on', quantity: 1, price: 29.99, taxRate: 8 }
    ],
    subtotal: 149.98,
    tax: 12.00,
    total: 161.98,
    status: 'Paid',
    paymentMethod: 'Credit Card (•••• 4242)',
    paymentDate: '2024-01-16',
    notes: 'Thank you for your business! Your support helps us continue providing excellent service.',
    terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly interest.',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-16 14:20:00'
  },
  'INV-002': {
    id: 'INV-002',
    invoiceNumber: 'INV-002',
    date: '2024-01-14',
    dueDate: '2024-02-14',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 891',
      address: '456 Oak Ave, San Francisco, CA 94107',
      company: 'Smith Designs'
    },
    company: {
      name: 'Your Company Name',
      email: 'contact@company.com',
      phone: '+1 800 123 4567',
      address: '123 Business Rd, City, State 12345',
      website: 'www.company.com',
      taxId: 'TAX-123456'
    },
    items: [
      { id: 1, description: 'Pro Plan - Monthly Subscription', quantity: 1, price: 29.99, taxRate: 8 },
      { id: 2, description: 'Custom Domain Registration', quantity: 1, price: 15.00, taxRate: 8 }
    ],
    subtotal: 44.99,
    tax: 3.60,
    total: 48.59,
    status: 'Pending',
    paymentMethod: 'PayPal',
    paymentDate: '',
    notes: 'Please make payment within 30 days. Thank you for choosing our services.',
    terms: 'Payment due within 30 days.',
    createdAt: '2024-01-14 09:15:00',
    updatedAt: '2024-01-14 09:15:00'
  }
}

const ViewInvoice = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch invoice data from API
    const foundInvoice = mockInvoices[id]
    if (foundInvoice) {
      setInvoice(foundInvoice)
    } else {
      navigate('/invoice')
    }
    setIsLoading(false)
  }, [id, navigate])

  const handleDownloadPDF = () => {
    if (!invoice) return

    const invoiceDiv = document.createElement('div')
    invoiceDiv.style.position = 'absolute'
    invoiceDiv.style.left = '-9999px'
    invoiceDiv.innerHTML = `
      <div id="invoice-pdf" style="width: 800px; padding: 40px; font-family: Arial, sans-serif; background: white;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #4f46e5; padding-bottom: 20px;">
          <div>
            <h1 style="color: #4f46e5; font-size: 36px; margin: 0 0 10px 0; font-weight: bold;">INVOICE</h1>
            <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Invoice #: ${invoice.invoiceNumber}</p>
            <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Date: ${invoice.date}</p>
          </div>
          <div style="text-align: right;">
            <img src="https://via.placeholder.com/150x50/4f46e5/ffffff?text=LOGO" alt="Company Logo" style="height: 50px; margin-bottom: 10px;" />
            <p style="margin: 5px 0; font-size: 14px;"><strong>${invoice.company.name}</strong></p>
            <p style="margin: 5px 0; font-size: 12px;">${invoice.company.address}</p>
            <p style="margin: 5px 0; font-size: 12px;">${invoice.company.email} | ${invoice.company.phone}</p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div style="flex: 1;">
            <h3 style="color: #374151; margin-bottom: 15px; font-size: 16px; font-weight: bold;">BILL TO:</h3>
            <p style="margin: 5px 0; font-size: 14px;"><strong>${invoice.customer.name}</strong></p>
            ${invoice.customer.company ? `<p style="margin: 5px 0; font-size: 14px;">${invoice.customer.company}</p>` : ''}
            <p style="margin: 5px 0; font-size: 14px;">${invoice.customer.address}</p>
            <p style="margin: 5px 0; font-size: 14px;">${invoice.customer.email}</p>
            <p style="margin: 5px 0; font-size: 14px;">${invoice.customer.phone}</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <h3 style="color: #374151; margin-bottom: 15px; font-size: 16px; font-weight: bold;">INVOICE DETAILS:</h3>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; text-align: left; font-size: 14px;">
              <span style="font-weight: bold;">Invoice #:</span>
              <span>${invoice.invoiceNumber}</span>
              <span style="font-weight: bold;">Date Issued:</span>
              <span>${invoice.date}</span>
              <span style="font-weight: bold;">Due Date:</span>
              <span style="color: ${invoice.status === 'Overdue' ? '#dc2626' : '#374151'};">${invoice.dueDate}</span>
              <span style="font-weight: bold;">Status:</span>
              <span style="color: ${
                invoice.status === 'Paid' ? '#059669' :
                invoice.status === 'Pending' ? '#d97706' :
                invoice.status === 'Overdue' ? '#dc2626' : '#6b7280'
              };">${invoice.status}</span>
            </div>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb;">
          <thead>
            <tr style="background-color: #f3f4f6; border-bottom: 2px solid #4f46e5;">
              <th style="padding: 12px; text-align: left; font-weight: bold; color: #374151; font-size: 14px;">Description</th>
              <th style="padding: 12px; text-align: center; font-weight: bold; color: #374151; font-size: 14px;">Qty</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; color: #374151; font-size: 14px;">Unit Price</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; color: #374151; font-size: 14px;">Tax Rate</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; color: #374151; font-size: 14px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; font-size: 14px;">${item.description}</td>
                <td style="padding: 12px; text-align: center; font-size: 14px;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; font-size: 14px;">$${item.price.toFixed(2)}</td>
                <td style="padding: 12px; text-align: right; font-size: 14px;">${item.taxRate}%</td>
                <td style="padding: 12px; text-align: right; font-size: 14px;">$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-left: auto; width: 300px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
            <span>Subtotal:</span>
            <span>$${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
            <span>Tax (8%):</span>
            <span>$${invoice.tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; font-size: 16px; border-top: 2px solid #4f46e5; padding-top: 10px;">
            <span>TOTAL:</span>
            <span>$${invoice.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div style="margin-top: 40px; padding: 20px; background-color: ${
          invoice.status === 'Paid' ? '#d1fae5' : 
          invoice.status === 'Pending' ? '#fef3c7' : 
          invoice.status === 'Overdue' ? '#fee2e2' : '#f3f4f6'
        }; border-radius: 8px; border-left: 4px solid ${
          invoice.status === 'Paid' ? '#10b981' : 
          invoice.status === 'Pending' ? '#f59e0b' : 
          invoice.status === 'Overdue' ? '#dc2626' : '#6b7280'
        };">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="height: 8px; width: 8px; border-radius: 50%; background-color: ${
              invoice.status === 'Paid' ? '#10b981' : 
              invoice.status === 'Pending' ? '#f59e0b' : 
              invoice.status === 'Overdue' ? '#dc2626' : '#6b7280'
            }; margin-right: 10px;"></div>
            <strong style="font-size: 16px;">Invoice Status: ${invoice.status}</strong>
          </div>
          ${invoice.paymentDate ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Payment Date:</strong> ${invoice.paymentDate}</p>` : ''}
          ${invoice.paymentMethod ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>` : ''}
        </div>
        
        ${invoice.notes ? `
          <div style="margin-top: 30px;">
            <h4 style="font-size: 14px; font-weight: bold; color: #374151; margin-bottom: 10px;">Notes:</h4>
            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">${invoice.notes}</p>
          </div>
        ` : ''}
        
        ${invoice.terms ? `
          <div style="margin-top: 20px;">
            <h4 style="font-size: 14px; font-weight: bold; color: #374151; margin-bottom: 10px;">Terms & Conditions:</h4>
            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">${invoice.terms}</p>
          </div>
        ` : ''}
        
        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
          <p style="margin: 5px 0;">Thank you for your business!</p>
          <p style="margin: 5px 0;">If you have any questions about this invoice, please contact:</p>
          <p style="margin: 5px 0;"><strong>${invoice.company.name}</strong> | ${invoice.company.email} | ${invoice.company.phone}</p>
          <p style="margin: 5px 0; font-size: 10px;">Invoice generated on ${new Date().toLocaleDateString()}</p>
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

      pdf.save(`${invoice.invoiceNumber}.pdf`)
      document.body.removeChild(invoiceDiv)
    })
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${invoice.invoiceNumber} - Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: white; }
          .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 40px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb; }
          th, td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          th { background-color: #f3f4f6; font-weight: bold; color: #374151; }
          .total-section { margin-left: auto; width: 300px; }
          .status-box { margin-top: 40px; padding: 20px; border-radius: 8px; border-left: 4px solid; }
          .paid { background-color: #d1fae5; border-left-color: #10b981; }
          .pending { background-color: #fef3c7; border-left-color: #f59e0b; }
          .overdue { background-color: #fee2e2; border-left-color: #dc2626; }
          .draft { background-color: #f3f4f6; border-left-color: #6b7280; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
            .print-btn { display: none !important; }
          }
          .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #4f46e5;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
          }
        </style>
      </head>
      <body>
        <button class="print-btn no-print" onclick="window.print()">Print Invoice</button>
        
        <div class="invoice-header">
          <div>
            <h1 style="color: #4f46e5; font-size: 36px; margin: 0 0 10px 0; font-weight: bold;">INVOICE</h1>
            <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Invoice #: ${invoice.invoiceNumber}</p>
            <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Date: ${invoice.date}</p>
          </div>
          <div style="text-align: right;">
            <div style="height: 50px; width: 150px; background-color: #4f46e5; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 10px; font-size: 18px;">
              LOGO
            </div>
            <p style="margin: 5px 0; font-size: 14px;"><strong>${invoice.company.name}</strong></p>
            <p style="margin: 5px 0; font-size: 12px;">${invoice.company.address}</p>
            <p style="margin: 5px 0; font-size: 12px;">${invoice.company.email} | ${invoice.company.phone}</p>
          </div>
        </div>
        
        <div class="invoice-details">
          <div style="flex: 1;">
            <h3 style="color: #374151; margin-bottom: 15px; font-size: 16px; font-weight: bold;">BILL TO:</h3>
            <p style="margin: 5px 0; font-size: 14px;"><strong>${invoice.customer.name}</strong></p>
            ${invoice.customer.company ? `<p style="margin: 5px 0; font-size: 14px;">${invoice.customer.company}</p>` : ''}
            <p style="margin: 5px 0; font-size: 14px;">${invoice.customer.address}</p>
            <p style="margin: 5px 0; font-size: 14px;">${invoice.customer.email}</p>
            <p style="margin: 5px 0; font-size: 14px;">${invoice.customer.phone}</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <h3 style="color: #374151; margin-bottom: 15px; font-size: 16px; font-weight: bold;">INVOICE DETAILS:</h3>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; text-align: left; font-size: 14px;">
              <span style="font-weight: bold;">Invoice #:</span>
              <span>${invoice.invoiceNumber}</span>
              <span style="font-weight: bold;">Date Issued:</span>
              <span>${invoice.date}</span>
              <span style="font-weight: bold;">Due Date:</span>
              <span style="color: ${invoice.status === 'Overdue' ? '#dc2626' : '#374151'};">${invoice.dueDate}</span>
              <span style="font-weight: bold;">Status:</span>
              <span style="color: ${
                invoice.status === 'Paid' ? '#059669' :
                invoice.status === 'Pending' ? '#d97706' :
                invoice.status === 'Overdue' ? '#dc2626' : '#6b7280'
              };">${invoice.status}</span>
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr style="border-bottom: 2px solid #4f46e5;">
              <th style="text-align: left;">Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Tax Rate</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="text-align: right;">${item.taxRate}%</td>
                <td style="text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
            <span>Subtotal:</span>
            <span>$${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
            <span>Tax (8%):</span>
            <span>$${invoice.tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; font-size: 16px; border-top: 2px solid #4f46e5; padding-top: 10px;">
            <span>TOTAL:</span>
            <span>$${invoice.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="status-box ${invoice.status.toLowerCase()}">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="height: 8px; width: 8px; border-radius: 50%; background-color: ${
              invoice.status === 'Paid' ? '#10b981' : 
              invoice.status === 'Pending' ? '#f59e0b' : 
              invoice.status === 'Overdue' ? '#dc2626' : '#6b7280'
            }; margin-right: 10px;"></div>
            <strong style="font-size: 16px;">Invoice Status: ${invoice.status}</strong>
          </div>
          ${invoice.paymentDate ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Payment Date:</strong> ${invoice.paymentDate}</p>` : ''}
          ${invoice.paymentMethod ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>` : ''}
        </div>
        
        ${invoice.notes ? `
          <div style="margin-top: 30px;">
            <h4 style="font-size: 14px; font-weight: bold; color: #374151; margin-bottom: 10px;">Notes:</h4>
            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">${invoice.notes}</p>
          </div>
        ` : ''}
        
        ${invoice.terms ? `
          <div style="margin-top: 20px;">
            <h4 style="font-size: 14px; font-weight: bold; color: #374151; margin-bottom: 10px;">Terms & Conditions:</h4>
            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">${invoice.terms}</p>
          </div>
        ` : ''}
        
        <div class="footer">
          <p style="margin: 5px 0;">Thank you for your business!</p>
          <p style="margin: 5px 0;">If you have any questions about this invoice, please contact:</p>
          <p style="margin: 5px 0;"><strong>${invoice.company.name}</strong> | ${invoice.company.email} | ${invoice.company.phone}</p>
          <p style="margin: 5px 0; font-size: 10px;">Invoice generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleSendEmail = () => {
    const subject = `Invoice ${invoice.invoiceNumber} from ${invoice.company.name}`
    const body = `Dear ${invoice.customer.name},\n\nPlease find attached invoice ${invoice.invoiceNumber} dated ${invoice.date} for the amount of $${invoice.total.toFixed(2)}.\n\nYou can also view this invoice online or download a PDF copy.\n\nThank you for your business!\n\nBest regards,\n${invoice.company.name}`
    
    window.location.href = `mailto:${invoice.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice not found</h2>
        <p className="text-gray-600 mb-4">The invoice you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/invoice')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Back to Invoices
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/invoice')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Invoices
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
            <p className="text-gray-500">View and manage invoice information</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <button
              onClick={handleSendEmail}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Email
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Printer className="h-5 w-5 mr-2" />
              Print Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Invoice Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
              <p className="text-indigo-100">Invoice #: {invoice.invoiceNumber}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                {invoice.status === 'Paid' ? (
                  <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                ) : invoice.status === 'Pending' ? (
                  <Clock className="h-5 w-5 text-yellow-300 mr-2" />
                ) : invoice.status === 'Overdue' ? (
                  <XCircle className="h-5 w-5 text-red-300 mr-2" />
                ) : (
                  <FileText className="h-5 w-5 text-gray-300 mr-2" />
                )}
                <span className="font-semibold">{invoice.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Company & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">From:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{invoice.company.name}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" /> {invoice.company.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" /> {invoice.company.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" /> {invoice.company.address}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{invoice.customer.name}</p>
                {invoice.customer.company && (
                  <p className="text-sm text-gray-600 mt-1">{invoice.customer.company}</p>
                )}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" /> {invoice.customer.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" /> {invoice.customer.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" /> {invoice.customer.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Invoice Date</p>
              <p className="font-medium text-gray-900">{invoice.date}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Due Date</p>
              <p className={`font-medium ${new Date(invoice.dueDate) < new Date() && invoice.status !== 'Paid' ? 'text-red-600' : 'text-gray-900'}`}>
                {invoice.dueDate}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900">{invoice.paymentMethod || 'Not specified'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">${invoice.total.toFixed(2)}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <PackageIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.taxRate}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-full md:w-96">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-indigo-600">${invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {invoice.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">{invoice.notes}</p>
                </div>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{invoice.terms}</p>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Invoice Created</p>
                  <p className="text-sm text-gray-500">{invoice.createdAt}</p>
                </div>
              </div>
              {invoice.updatedAt !== invoice.createdAt && (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Edit className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Invoice Updated</p>
                    <p className="text-sm text-gray-500">{invoice.updatedAt}</p>
                  </div>
                </div>
              )}
              {invoice.paymentDate && (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Payment Received</p>
                    <p className="text-sm text-gray-500">{invoice.paymentDate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewInvoice