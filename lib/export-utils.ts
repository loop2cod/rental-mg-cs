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
  
  // Generate PDF content for all table types
  function generatePdfContent<T>(data: T[], columns: ColumnDef<T>[], title: string): string {
    const filteredColumns = columns.filter(col => col.id !== 'actions' && col.id !== 'image')
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: A4; margin: 1cm; }
          body { font-family: Arial, sans-serif; font-size: 10px; }
          h1 { text-align: center; margin: 0 0 10px 0; font-size: 16px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .nowrap { white-space: nowrap; }
          .footer { text-align: center; margin-top: 10px; font-size: 9px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
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
                    case 'unit_cost':
                      return `<td class="text-right">${formatCurrency(item[col.id])}</td>`
                    case 'quantity':
                    case 'inventoryQuantity':
                      return `<td class="text-right">${item[col.id] || 0}</td>`
                      
                    // Order/Booking table columns
                    case 'customer_name':
                    case 'user':
                      return `<td>${cellFormatters.contactInfo(item.user_id?.name, item.user_id?.mobile)}</td>`
                    case 'from_date':
                      return `<td class="nowrap">${cellFormatters.dateWithTime(item.from_date, item.from_time)}</td>`
                    case 'to_date':
                      return `<td class="nowrap">${cellFormatters.dateWithTime(item.to_date, item.to_time)}</td>`
                    case 'booking_date':
                    case 'order_date':
                      return `<td class="nowrap">${formatDate(item[col.id])}</td>`
                    case 'items':
                      const products = item.booking_items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
                      const outsourced = item.outsourced_items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
                      return `<td>Products: ${products}<br>Outsourced: ${outsourced}</td>`
                    case 'total_amount':
                    case 'amount_paid':
                      return `<td class="text-right">${formatCurrency(item[col.id])}</td>`
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
        <div class="footer">Generated on ${formatDate(new Date())}</div>
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
            return `"${item.name || '-'}"`
          case 'categoryName':
            return `"${item.categoryName || '-'}"`
          case 'features':
            return `"${cellFormatters.features(item.features)}"`
          case 'price':
          case 'unit_cost':
            return formatCurrency(item.unit_cost||0)
          case 'quantity':
          case 'inventoryQuantity':
            return item.inventoryQuantity || 0
            
          // Order/Booking table columns
          case 'customer_name':
          case 'user':
            return `"${cellFormatters.contactInfo(item.user_id?.name, item.user_id?.mobile)}"`
          case 'from_date':
            return `"${cellFormatters.dateWithTime(item.from_date, item.from_time)}"`
          case 'to_date':
            return `"${cellFormatters.dateWithTime(item.to_date, item.to_time)}"`
          case 'booking_date':
          case 'order_date':
            return `"${formatDate(item[col.id])}"`
          case 'items':
            const products = item.booking_items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
            const outsourced = item.outsourced_items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0
            return `"Products: ${products}, Outsourced: ${outsourced}"`
          case 'total_amount':
          case 'amount_paid':
            return formatCurrency(item[col.id])
          case 'status':
            return `"${item.status || '-'}"`
            
          // Supplier table columns
          case 'contact':
            return `"${item.contact || '-'}"`
          case 'address':
            return `"${item.address || '-'}"`
            
          // Default case
          default:
            if (col.accessorKey) {
              const value = getNestedValue(item, col.accessorKey)
              return typeof value === 'string' ? `"${value}"` : value
            }
            return '""'
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