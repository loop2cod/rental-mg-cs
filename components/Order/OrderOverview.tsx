'use client'
import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Printer } from 'lucide-react'
import { OrderCustomerInfoCard } from './OrderCustomerInfoCard'
import { OrderDetailsCard } from './OrderDetailsCard'
import { OrderPaymentSummaryCard } from './OrderPaymentSummaryCard'
import { OrderOutsourcedItemsDetailsTable } from './OrderOutsourcedItemsDetailsTable'
import { OrderItemsDetailsTable } from './OrderItemsDetailsTable'
import { OrderDispatchHistory } from './OrderDispatchHistory'

const OrderOverview = ({ data, loading,fetchOrder }: any) => {

  const handleDispatchSuccess = () => {
    fetchOrder()
  }

  const handlePrintBill = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const billContent = generateThermalBillContent(data)
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - Order ${data?.order_id}</title>
          <style>
            ${getThermalPrintStyles()}
          </style>
        </head>
        <body>
          ${billContent}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const generateThermalBillContent = (orderData: any) => {
    const allItems = [
      ...(orderData.order_items || []).map((item: any) => ({ ...item, type: 'product' })),
      ...(orderData.outsourced_items || []).map((item: any) => ({ ...item, type: 'outsourced' }))
    ]

    return `
      <div class="bill-container">
        <div class="header">
          <img src="/logo.png" alt="Company Logo" class="logo" />
          <div class="company-info">
            <div>Payyanur, Kerala, India</div>
            <div>Phone: +91 9847400022</div>
          </div>
        </div>
        
        <div class="separator">================================</div>
        
        <div class="order-info">
          <div class="row">
            <span>Order ID:</span>
            <span>${orderData?.order_id}</span>
          </div>
          <div class="row">
            <span>Date:</span>
            <span>${orderData?.created_at ? new Date(orderData.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</span>
          </div>
          <div class="row">
            <span>Status:</span>
            <span>${orderData?.status?.toUpperCase()}</span>
          </div>
        </div>
        
        <div class="separator">================================</div>
        
        <div class="customer-info">
          <div><strong>CUSTOMER DETAILS</strong></div>
          <div>${orderData?.user?.name || 'N/A'}</div>
          <div>${orderData?.user?.mobile || 'N/A'}</div>
        </div>
        
        <div class="separator">================================</div>
        
        <div class="items-section">
          <div><strong>ITEMS</strong></div>
          ${allItems.map((item: any) => {
            const quantity = item.quantity || 0;
            const unitPrice = item.unit_price || item.price || 0;
            const total = quantity * unitPrice;
            
            return `
            <div class="item">
              <div class="item-name">${item.product_name || item.name || 'Unknown Item'}</div>
              <div class="item-details">
                <span>Qty: ${quantity}</span>
                <span>Rate: ₹${unitPrice.toFixed(2)}</span>
                <span>Total: ₹${total.toFixed(2)}</span>
              </div>
            </div>
          `}).join('')}
        </div>
        
        <div class="separator">================================</div>
        
        <div class="totals">
          <div class="row">
            <span>Subtotal:</span>
            <span>₹${(orderData?.total_amount || 0).toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Discount:</span>
            <span>-₹${(orderData?.discount || 0).toFixed(2)}</span>
          </div>
          <div class="row total-row">
            <span><strong>Total:</strong></span>
            <span><strong>₹${((orderData?.total_amount || 0) - (orderData?.discount || 0)).toFixed(2)}</strong></span>
          </div>
          <div class="row">
            <span>Paid:</span>
            <span>₹${(orderData?.amount_paid || 0).toFixed(2)}</span>
          </div>
          <div class="row balance-row">
            <span><strong>Balance:</strong></span>
            <span><strong>₹${((orderData?.total_amount || 0) - (orderData?.amount_paid || 0)).toFixed(2)}</strong></span>
          </div>
        </div>
        
        <div class="separator">================================</div>
        
        <div class="footer">
          <div>Thank you for your business!</div>
          <div>Visit us again</div>
        </div>
      </div>
    `
  }

  const getThermalPrintStyles = () => {
    return `
      @media print {
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
        }
      }
      
      body {
        font-family: 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.2;
        margin: 0;
        padding: 10px;
        width: 80mm;
        font-weight: bold;
        color: #000;
      }
      
      .bill-container {
        width: 100%;
        max-width: 80mm;
      }
      
      .header {
        text-align: center;
        margin-bottom: 10px;
      }
      
      .logo {
        width: 70%;
        height: auto;
        margin: 0 auto;
        display: block;
      }
      
      .header h1 {
        font-size: 16px;
        font-weight: extra-bold;
        margin: 0 0 5px 0;
      }
      
      .company-info {
        font-size: 16px;
        line-height: 1.3;
      }
      
      .separator {
        text-align: center;
        margin: 8px 0;
        font-weight: extra-bold;
      }
      
      .order-info, .customer-info, .totals {
        margin: 8px 0;
      }
      
      .row {
        display: flex;
        justify-content: space-between;
        margin: 2px 0;
      }
      
      .customer-info div {
        margin: 1px 0;
      }
      
      .items-section {
        margin: 8px 0;
      }
      
      .item {
        margin: 5px 0;
        border-bottom: 1px dashed #ccc;
        padding-bottom: 3px;
      }
      
      .item-name {
        font-weight: extra-bold;
        margin-bottom: 2px;
      }
      
      .item-details {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
      }
      
      .total-row, .balance-row {
        border-top: 1px solid #000;
        padding-top: 2px;
        margin-top: 5px;
      }
      
      .footer {
        text-align: center;
        margin-top: 10px;
        font-size: 14px;
      }
      
      .footer div {
        margin: 1px 0;
      }
    `
  }


  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return <div className="text-center py-8">No order data available</div>
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Overview</h1>
          <p className="text-muted-foreground">Order ID: {data?.order_id}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={data?.status === 'inreturn' ? 'default' : 'outline'}>
              {data?.status}
            </Badge>
          </div>
          <Button onClick={handlePrintBill} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Bill
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OrderCustomerInfoCard customer={data?.user} />
        <OrderDetailsCard booking={data} />
        <OrderPaymentSummaryCard booking={data} onPaymentUpdate={fetchOrder} />
      </div>

      <div className="space-y-4">
      {data?.order_items?.length > 0 && (
          <OrderItemsDetailsTable 
            items={data?.order_items} 
            dispatchItems={data?.dispatch_items}
            orderId={data?._id}
            onDispatchSuccess={handleDispatchSuccess}
          />
        )}
        {data?.outsourced_items?.length > 0 && (
          <OrderOutsourcedItemsDetailsTable 
            items={data?.outsourced_items} 
            dispatchItems={data?.outsourced_dispatch_items}
            orderId={data?._id}
            onDispatchSuccess={handleDispatchSuccess}
          />
        )}
      </div>
    </div>
  )
}

export default OrderOverview