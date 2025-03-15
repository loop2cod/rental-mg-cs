import type { ColumnDef } from "@/components/ui/data-table"

// Helper function to get nested values using dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((prev, curr) => {
    return prev ? prev[curr] : null
  }, obj)
}

function convertToCSV<T>(data: T[], columns: ColumnDef<T>[]): string {
    // Create header row
    const header = columns
      .filter((col) => col.id !== "actions" && col.id !== "image") // Exclude action and image columns
      .map((col) => col.header)
      .join(",")
  
    // Create data rows
    const rows = data
      .map((item) => {
        return columns
          .filter((col) => col.id !== "actions" && col.id !== "image") // Exclude action and image columns
          .map((col) => {
            if (col.accessorKey) {
              const value = getNestedValue(item, col.accessorKey)
              if (col.id === "features" && typeof value === "object") {
                // Format features as a comma-separated list
                return Object.entries(value)
                  .map(([key, val]) => `${key}: ${val}`)
                  .join(", ")
              }
              // Handle values that might contain commas
              return typeof value === "string" && value.includes(",") ? `"${value}"` : value
            }
            return ""
          })
          .join(",")
      })
      .join("\n")
  
    return `${header}\n${rows}`
  }

// Export to Excel (CSV)
export function exportToExcel<T>(data: T[], columns: ColumnDef<T>[], fileName: string): void {
  const csv = convertToCSV(data, columns)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${fileName}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


export function exportToPdf<T>(data: T[], columns: ColumnDef<T>[], fileName: string): void {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups to export as PDF")
      return
    }
  
    // Create HTML content with a professional layout
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #333; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; color: #333; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${fileName}</h1>
        <table>
          <thead>
            <tr>
              ${columns
                .filter((col) => col.id !== "actions" && col.id !== "image")
                .map((col) => `<th>${col.header}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (item) => `
              <tr>
                ${columns
                  .filter((col) => col.id !== "actions" && col.id !== "image")
                  .map((col) => {
                    if (col.accessorKey) {
                      const value = getNestedValue(item, col.accessorKey)
                      if (col.id === "features" && typeof value === "object") {
                        // Format features as a comma-separated list
                        const features = Object.entries(value)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(", ")
                        return `<td>${features}</td>`
                      }
                      return `<td>${value}</td>`
                    }
                    return "<td></td>"
                  })
                  .join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        <div class="footer">Generated on ${new Date().toLocaleDateString()}</div>
      </body>
      </html>
    `
  
    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print()
    }
  }

