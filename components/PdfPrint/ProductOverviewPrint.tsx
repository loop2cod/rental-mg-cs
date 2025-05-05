import React from "react"

interface ProductOverviewPrintProps {
  productData: any
}

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  marginBottom: "16px",
  padding: "16px",
  background: "#fff",
}

const sectionTitleStyle = {
  fontSize: "18px",
  fontWeight: 600,
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginBottom: "16px",
  fontSize: "12px",
}

const thStyle = {
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  padding: "6px 8px",
  fontWeight: 600,
  textAlign: "left" as const,
}

const tdStyle = {
  border: "1px solid #e5e7eb",
  padding: "6px 8px",
  verticalAlign: "top" as const,
}

const badgeStyle = {
  display: "inline-block",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "2px 8px",
  fontSize: "11px",
  background: "#f3f4f6",
  marginLeft: "8px",
}

const ProductOverviewPrint: React.FC<ProductOverviewPrintProps> = ({ productData }) => {
  if (!productData) return null
  const { product, orders = [] } = productData
  const totalQuantity = product.available_quantity + product.reserved_quantity
  const availablePercentage = (product.available_quantity / totalQuantity) * 100
  const totalOrderedQuantity = orders.reduce((total: number, order: any) => total + order.order_items.quantity, 0)
  const totalRevenue = orders.reduce((total: number, order: any) => total + order.total_amount, 0)

  // Helper for currency formatting
  const formatCurrency = (amount: number) =>
    amount?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }) || "₹0"

  // Helper for date range
  const formatDateRange = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    if (from.toDateString() === to.toDateString()) {
      return from.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
    if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
      return `${from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${to.getDate()}, ${to.getFullYear()}`
    }
    return `${from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${to.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        padding: "24px",
        boxSizing: "border-box",
        background: "#f3f4f6",
        minHeight: "100vh",
        maxWidth: "1122px", // A4 landscape width in px at 96dpi
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 8, fontSize: "28px", fontWeight: 700 }}>Product Overview</h1>
      <div style={{ textAlign: "center", marginBottom: 24, color: "#888" }}>
        Generated on {new Date().toLocaleDateString()}
      </div>

      {/* Quick Stats */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <div style={{ ...cardStyle, flex: 1 }}>
          <div style={{ fontSize: "13px", color: "#6b7280" }}>Total Inventory</div>
          <div style={{ fontSize: "22px", fontWeight: 700 }}>{totalQuantity} units</div>
          <div style={{ marginTop: "8px", fontSize: "12px" }}>
            <span>Available: {product.available_quantity}</span>
            <span style={{ marginLeft: "16px" }}>Reserved: {product.reserved_quantity}</span>
          </div>
          <div style={{ marginTop: "8px" }}>
            <span style={badgeStyle}>{availablePercentage.toFixed(0)}% Available</span>
          </div>
        </div>
        <div style={{ ...cardStyle, flex: 1 }}>
          <div style={{ fontSize: "13px", color: "#6b7280" }}>Total Orders</div>
          <div style={{ fontSize: "22px", fontWeight: 700 }}>{orders.length}</div>
          <div style={{ marginTop: "8px", fontSize: "12px" }}>
            Total Quantity Ordered: <span style={badgeStyle}>{totalOrderedQuantity} units</span>
          </div>
        </div>
        <div style={{ ...cardStyle, flex: 1 }}>
          <div style={{ fontSize: "13px", color: "#6b7280" }}>Total Revenue</div>
          <div style={{ fontSize: "22px", fontWeight: 700 }}>{formatCurrency(totalRevenue)}</div>
          <div style={{ marginTop: "8px", fontSize: "12px" }}>
            Unit Price: <span style={badgeStyle}>{formatCurrency(product.unit_cost)}</span>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Product Details</div>
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ flex: "0 0 180px", textAlign: "center" }}>
            <img
              src={product.images[0] || "/placeholder.svg?height=180&width=180"}
              alt={product.name}
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                marginBottom: "8px",
              }}
            />
            <div style={{ fontWeight: 600, fontSize: "13px", marginTop: "4px" }}>{product.name}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 700 }}>{product.name}</div>
              </div>
              <span style={badgeStyle}>{formatCurrency(product.unit_cost)}</span>
            </div>
            <div style={{ color: "#6b7280", marginBottom: "12px" }}>{product.description}</div>
            <div style={{ display: "flex", gap: "24px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: "6px" }}>Product Specifications</div>
                <table style={{ ...tableStyle, marginBottom: 0 }}>
                  <tbody>
                    {Object.entries(product.features).map(([key, value]: any) => (
                      <tr key={key}>
                        <td style={{ ...tdStyle, fontWeight: 500, textTransform: "capitalize", color: "#6b7280" }}>{key}</td>
                        <td style={tdStyle}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: "6px" }}>Inventory Status</div>
                <table style={{ ...tableStyle, marginBottom: 0 }}>
                  <tbody>
                    <tr>
                      <td style={{ ...tdStyle, fontWeight: 500, color: "#6b7280" }}>Available</td>
                      <td style={tdStyle}>{product.available_quantity} units</td>
                    </tr>
                    <tr>
                      <td style={{ ...tdStyle, fontWeight: 500, color: "#6b7280" }}>Reserved</td>
                      <td style={{ ...tdStyle, color: "#dc2626" }}>{product.reserved_quantity} units</td>
                    </tr>
                    <tr>
                      <td style={{ ...tdStyle, fontWeight: 500, color: "#6b7280" }}>Total</td>
                      <td style={tdStyle}>{totalQuantity} units</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Information */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Recent Orders</div>
        <div style={{ color: "#6b7280", marginBottom: "8px" }}>
          Showing all {orders.length} orders for this product
        </div>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "#888" }}>
            No orders found for this product
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Order Date</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Delivery Period</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <React.Fragment key={order._id}>
                  <tr>
                    <td style={tdStyle}>{order._id.substring(order._id.length - 8)}</td>
                    <td style={tdStyle}>{new Date(order.order_date).toLocaleDateString()}</td>
                    <td style={tdStyle}>{order.order_items.quantity}</td>
                    <td style={tdStyle}>{formatCurrency(order.total_amount)}</td>
                    <td style={tdStyle}>{order.status}</td>
                    <td style={tdStyle}>{formatDateRange(order.from_date, order.to_date)}</td>
                  </tr>
                  {/* Expanded Order Details */}
                  <tr>
                    <td style={{ ...tdStyle, background: "#f9fafb", padding: "16px" }} colSpan={6}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "16px" }}>
                          <div style={{ fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                            Shipping Information
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px" }}>
                              <div style={{ fontWeight: 500, marginBottom: "4px" }}>Delivery Address</div>
                              <div style={{ color: "#6b7280" }}>{order.address}</div>
                            </div>

                            <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px" }}>
                              <div style={{ fontWeight: 500, marginBottom: "8px" }}>Delivery Period</div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                  <div style={{ fontSize: "10px", color: "#6b7280" }}>From</div>
                                  <div>{new Date(order.from_date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                  })}</div>
                                </div>
                                <div style={{ color: "#6b7280" }}>→</div>
                                <div>
                                  <div style={{ fontSize: "10px", color: "#6b7280" }}>To</div>
                                  <div>{new Date(order.to_date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                  })}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "16px" }}>
                          <div style={{ fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                            Payment Summary
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "#6b7280" }}>Product</span>
                                <span style={{ fontWeight: 500 }}>{order.order_items.name}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "#6b7280" }}>Unit Price</span>
                                <span>{formatCurrency(order.order_items.price)}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#6b7280" }}>Quantity</span>
                                <span>{order.order_items.quantity} units</span>
                              </div>
                            </div>

                            <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "#6b7280" }}>Subtotal</span>
                                <span>{formatCurrency(order.sub_total)}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "#6b7280" }}>Discount</span>
                                <span>-{formatCurrency(order.discount || 0)}</span>
                              </div>
                              <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "8px", paddingTop: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
                                  <span>Total</span>
                                  <span style={{ fontSize: "16px" }}>{formatCurrency(order.total_amount)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: 16 }}>
          <strong>Total Orders:</strong> {orders.length} &nbsp; | &nbsp;
          <strong>Total Quantity Ordered:</strong> {totalOrderedQuantity} &nbsp; | &nbsp;
          <strong>Total Revenue:</strong> {formatCurrency(totalRevenue)}
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 32, color: "#888", fontSize: 10 }}>
        Generated by Rental Management System
      </div>
    </div>
  )
}

export default ProductOverviewPrint