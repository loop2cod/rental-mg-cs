"use client"

import Image from "next/image"
import { Edit, Trash2, Loader2, Eye, EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type ColumnDef } from "@/components/ui/data-table"
import { Badge } from "../ui/badge"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/commonFunctions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InventoryTableProps {
  onSearch?: (term: string) => void
  isLoading: boolean
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
  isLoading,
  inventory,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: InventoryTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Handle delete with loading state
  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

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
        <span
         className="decoration-secondary-foreground decoration-2 underline-offset-4">
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
      cell: (item: any) => `${formatCurrency(item?.unit_cost||0)}`,
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
      id: "available",
      header: "Available",
      accessorKey: "available_quantity",
      sortable: true,
      searchable: false,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex justify-start gap-2">
             <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
             <Button
            variant="ghost"
            size="lg"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/list-inventory/overview/${item._id}`)
            }}
          >
            <EyeIcon className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              View Product
            </p>
          </TooltipContent>
          </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="lg"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Edit Product
            </p>
          </TooltipContent>
          </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
          <Tooltip>
          <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="lg"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(item._id)
            }}
            disabled={deletingId === item._id}
          >
            {deletingId === item._id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Delete Product
            </p>
          </TooltipContent>
          </Tooltip>
          </TooltipProvider>
        </div>
      ),
      sortable: false,
      searchable: false,
    },
  ], [onEdit, handleDelete, deletingId])

  return (
    <div className="px-2 md:px-2 lg:px-4">
      <DataTable
        itemsPerPageOptions={[5, 10, 20, 50, 100]}
        isLoading={isLoading}
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