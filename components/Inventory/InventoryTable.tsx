"use client"

import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
import { Badge } from "../ui/badge"
import { useMemo } from "react"

interface InventoryTableProps {
  onSearch?: (term: string) => void
  inventory: any
  onEdit: (item: any) => void
  onDelete: (id: string) => void
  currentPage?: number
  totalPages?: number
  totalCount?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function InventoryTable({
  onSearch,
  inventory,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: InventoryTableProps) {
  // Define columns for the data table using useMemo
  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      id: "image",
      header: "Image",
      cell: (item: any) => (
        <div className="h-12 w-12 relative rounded-md overflow-hidden">
          <img
            src={item?.images?.[0] || "/placeHolder.jpg"}
            alt={item?.name}
            className="object-cover"
          />
        </div>
      ),
      sortable: false,
      searchable: false,
    },
    {
      id: "name",
      header: "Product",
      accessorKey: "name",
      sortable: true,
      searchable: true,
      cell: (item: any) => (
        <span className="underline decoration-secondary-foreground decoration-2 underline-offset-4 cursor-pointer">
          {item?.name}
        </span>
      ),
    },
    {
      id: "categoryName",
      header: "Category",
      accessorKey: "categoryName",
      sortable: true,
      searchable: true,
    },
    {
      id: "features",
      header: "Features",
      accessorKey: "features",
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item?.features &&
            Object.entries(item?.features).map(([key, value]: any) => (
              <Badge key={key} variant="outline" className="capitalize">
                {key}: {value}
              </Badge>
            ))}
        </div>
      ),
      sortable: false,
      searchable: false,
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "unit_cost",
      cell: (item: any) => `₹${item?.unit_cost.toFixed(2)}`,
      sortable: true,
      searchable: false,
    },
    {
      id: "quantity",
      header: "Quantity",
      accessorKey: "inventoryQuantity",
      sortable: true,
      searchable: false,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex justify-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item._id)
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
      sortable: false,
      searchable: false,
    },
  ], [onEdit, onDelete])

  return (
    <div className="px-2 md:px-2 lg:px-4">
      <DataTable
        itemsPerPageOptions={[2, 5, 10, 20, 50, 100]}
        data={inventory}
        columns={columns}
        serialNumber={true}
        showSearchBar={true}
        showPdfExport={true}
        showExcelExport={true}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSearch={onSearch}
      />
    </div>
  )
}