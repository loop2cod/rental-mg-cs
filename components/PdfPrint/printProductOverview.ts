import React from "react"
import ReactDOMServer from "react-dom/server"
import ProductOverviewPrint from "../PdfPrint/ProductOverviewPrint"

export function printProductOverview(productData: any) {
  // Create a container div
  const container = document.createElement("div")
  container.style.position = "fixed"
  container.style.left = "-9999px"
  document.body.appendChild(container)

  // Render the component to a string
  const htmlString = ReactDOMServer.renderToString(
    React.createElement(ProductOverviewPrint, { productData })
  )
  container.innerHTML = htmlString

  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Please allow popups to print")
    document.body.removeChild(container)
    return
  }

  // Copy styles from the main document
  let styles = ""
  Array.from(document.styleSheets).forEach((styleSheet: any) => {
    try {
      if (styleSheet.cssRules) {
        Array.from(styleSheet.cssRules).forEach((rule: any) => {
          styles += rule.cssText
        })
      }
    } catch (e) {
      // Ignore CORS issues
    }
  })

  printWindow.document.open()
  printWindow.document.write(`
    <html>
      <head>
        <title>Product Overview</title>
        <style>
          @page { size: A4 landscape; margin: 1cm; }
          body { font-family: Arial, sans-serif; }
          ${styles}
        </style>
      </head>
      <body>
        ${container.innerHTML}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
      document.body.removeChild(container)
    }, 500)
  }
}