import type { ColumnDef } from "@/components/ui/data-table"
import { format, parse } from "date-fns"
import { formatCurrency } from "./commonFunctions"


  function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null
    }, obj)
  }
  
  // Format time in 12-hour format
  function formatTime(timeString: string): string {
    if (!timeString) return '-'
    try {
      return format(parse(timeString, 'HH:mm', new Date()), 'hh:mm a')
    } catch {
      return timeString
    }
  }
  
  // Format date consistently
  function formatDate(dateString: string | Date): string {
    if (!dateString) return '-'
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString
      return format(date, 'MMM dd, yyyy')
    } catch {
      return String(dateString)
    }
  }
  
  
  // Common cell formatters
  const cellFormatters = {
    // For Order/Booking tables
    dateWithTime: (date: string, time: string) => {
      return `${formatDate(date)}\n${formatTime(time)}`
    },
    
    // For Inventory table
    features: (features: Record<string, any>) => {
      return Object.entries(features || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    },
    
    // For tables with contact info
    contactInfo: (name: string, mobile: string) => {
      return `${name}\n${mobile}`
    }
  }
  
  // Determine if landscape orientation is needed based on column count
  function needsLandscapeOrientation(columns: ColumnDef<any>[]): boolean {
    const filteredColumns = columns.filter(col => col.id !== 'actions' && col.id !== 'image')
    return filteredColumns.length > 6
  }
  
  // Generate PDF content for all table types
  function generatePdfContent<T>(data: T[], columns: ColumnDef<T>[], title: string): string {
    const filteredColumns = columns.filter(col => col.id !== 'actions' && col.id !== 'image')
    const isLandscape = needsLandscapeOrientation(columns)
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          @page { 
            size: A4 ${isLandscape ? 'landscape' : 'portrait'}; 
            margin: 0.5cm;
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 10px;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          h1 { 
            margin: 0;
            font-size: 18px;
            color: #333;
          }
          .subtitle {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
          }
          th { 
            background-color: #f5f5f5; 
            font-weight: bold;
            color: #333;
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9;
          }
          .text-right { 
            text-align: right; 
          }
          .text-center { 
            text-align: center; 
          }
          .nowrap { 
            white-space: nowrap; 
          }
          .footer { 
            text-align: center; 
            margin-top: 20px; 
            font-size: 9px; 
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          .page-break {
            page-break-after: always;
          }
          @media print {
            tr { page-break-inside: avoid; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div class="subtitle">Generated on ${formatDate(new Date())}</div>
        </div>
        <table>
          <thead>
            <tr>
              ${filteredColumns.map(col => `<th class="${['price', 'total_amount', 'amount_paid'].includes(col.id as string) ? 'text-right' : ''}">${col.header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map((item: any, index) => `
              <tr>
                ${filteredColumns.map(col => {
                  // Handle serial number if present
                  if (col.id === 'serialNumber') {
                    return `<td class="text-center">${index + 1}</td>`
                  }
                  
                  // Handle image column if present
                  if (col.id === 'image') {
                    return '<td></td>' // Images aren't printable in PDF
                  }
                  
                  // Handle different table types
                  switch (col.id) {
                    // Inventory table columns
                    case 'name':
                      return `<td>${item.name || '-'}</td>`
                    case 'categoryName':
                      return `<td>${item.categoryName || '-'}</td>`
                    case 'features':
                      return `<td>${cellFormatters.features(item.features)}</td>`
                    case 'price':
                      return `<td class="text-right">${formatCurrency(item.unit_cost || 0)}</td>`
                    case 'unit_cost':
                      return `<td class="text-right">${formatCurrency(item.unit_cost || 0)}</td>`
                    case 'quantity':
                      return `<td class="text-right">${item.inventoryQuantity || 0}</td>`
                    case 'inventoryQuantity':
                      return `<td class="text-right">${item.inventoryQuantity || 0}</td>`
                      
                    // Order/Booking table columns
                    case 'customer_name':
                    case 'user':
                      return `<td>${cellFormatters.contactInfo(item.user?.name || item.user_id?.name, item.user?.mobile || item.user_id?.mobile)}</td>`
                    case 'from_date':
                      return `<td class="nowrap">${cellFormatters.dateWithTime(item.from_date, item.from_time)}</td>`
                    case 'to_date':
                      return `<td class="nowrap">${cellFormatters.dateWithTime(item.to_date, item.to_time)}</td>`
                    case 'booking_date':
                    case 'order_date':
                      return `<td class="nowrap">${formatDate(item[col.id])}</td>`
                    case 'items':
                      const products = (item.order_items || item.booking_items)?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
                      const outsourced = item.outsourced_items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
                      return `<td>Products: ${products}<br>Outsourced: ${outsourced}</td>`
                    case 'total_amount':
                    case 'amount_paid':
                      return `<td class="text-right">${formatCurrency(item[col.id] || 0)}</td>`
                    case 'status':
                      return `<td>${item.status || '-'}</td>`
                      
                    // Supplier table columns
                    case 'contact':
                      return `<td>${item.contact || '-'}</td>`
                    case 'address':
                      return `<td>${item.address || '-'}</td>`
                      
                    // Default case
                    default:
                      if (col.accessorKey) {
                        const value = getNestedValue(item, col.accessorKey)
                        return `<td>${value || '-'}</td>`
                      }
                      return '<td>-</td>'
                  }
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <div>Page 1 of 1</div>
          <div>Generated by Rental Management System</div>
        </div>
      </body>
      </html>
    `
  }
  
  // Generate CSV content for all table types
  function generateCsvContent<T>(data: T[], columns: ColumnDef<T>[]): string {
    const filteredColumns = columns.filter(col => col.id !== 'actions' && col.id !== 'image')
    
    // Create header row
    const header = filteredColumns
      .map(col => `"${col.header}"`)
      .join(',')
    
    // Create data rows
    const rows = data.map((item: any, index) => {
      return filteredColumns.map(col => {
        // Handle serial number if present
        if (col.id === 'serialNumber') {
          return index + 1
        }
        
        // Handle different table types
        switch (col.id) {
          // Inventory table columns
          case 'name':
            return `"${(item.name || '-').replace(/"/g, '""')}"`
          case 'categoryName':
            return `"${(item.categoryName || '-').replace(/"/g, '""')}"`
          case 'features':
            return `"${cellFormatters.features(item.features).replace(/"/g, '""')}"`
          case 'price':
            return `"${formatCurrency(item.unit_cost || 0)}"`
          case 'unit_cost':
            return `"${formatCurrency(item.unit_cost || 0)}"`
          case 'quantity':
            return `"${item.inventoryQuantity || 0}"`
          case 'inventoryQuantity':
            return `"${item.inventoryQuantity || 0}"`
            
          // Order/Booking table columns
          case 'customer_name':
          case 'user':
            const customerName = item.user?.name || item.user_id?.name || '-'
            const customerMobile = item.user?.mobile || item.user_id?.mobile || '-'
            return `"${customerName} - ${customerMobile}"`
          case 'from_date':
            return `"${formatDate(item.from_date)} ${formatTime(item.from_time)}"`
          case 'to_date':
            return `"${formatDate(item.to_date)} ${formatTime(item.to_time)}"`
          case 'booking_date':
          case 'order_date':
            return `"${formatDate(item[col.id])}"`
          case 'items':
            const products = (item.order_items || item.booking_items)?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
            const outsourced = item.outsourced_items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
            return `"Products: ${products} | Outsourced: ${outsourced}"`
          case 'total_amount':
          case 'amount_paid':
            return `"${formatCurrency(item[col.id] || 0)}"`
          case 'amount':
            return `"${formatCurrency(item.total_amount || 0)}"`
          case 'status':
            return `"${(item.status || '-').replace(/"/g, '""')}"`
            
          // Supplier table columns
          case 'contact':
            return `"${(item.contact || '-').replace(/"/g, '""')}"`
          case 'address':
            return `"${(item.address || '-').replace(/"/g, '""')}"`
            
          // Default case
          default:
            if (col.accessorKey) {
              const value = getNestedValue(item, col.accessorKey)
              if (value === null || value === undefined) {
                return '"-"'
              }
              return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : `"${value}"`
            }
            return '"-"'
        }
      }).join(',')
    }).join('\n')
  
    return `${header}\n${rows}`
  }
  
  // Export to Excel (CSV)
  export function exportToExcel<T>(data: T[], columns: ColumnDef<T>[], fileName: string): void {
    const csv = generateCsvContent(data, columns)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${fileName}_${format(new Date(), 'yyyyMMdd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  // Export to PDF
  export function exportToPdf<T>(data: T[], columns: ColumnDef<T>[], fileName: string): void {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to export as PDF')
      return
    }
  
    const htmlContent = generatePdfContent(data, columns, fileName)
  
    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }