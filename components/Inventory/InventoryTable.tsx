"use client"

import { Edit, Trash2, Loader2, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "../ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/commonFunctions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const wasSearchingRef = useRef(false)
  const previousDebouncedTermRef = useRef("")

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Trigger search when debounced term changes
  useEffect(() => {
    if (onSearch && debouncedSearchTerm !== previousDebouncedTermRef.current) {
      onSearch(debouncedSearchTerm)
      previousDebouncedTermRef.current = debouncedSearchTerm
    }
  }, [debouncedSearchTerm, onSearch])


  // Restore focus after re-render when searching (only when actually searching, not pagination)
  useEffect(() => {
    if (wasSearchingRef.current && searchInputRef.current && !isLoading) {
      const input = searchInputRef.current
      const cursorPosition = searchTerm.length
      
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        input.focus()
        input.setSelectionRange(cursorPosition, cursorPosition)
        wasSearchingRef.current = false
      }, 0)
    }
  }, [searchTerm, isLoading]) // Removed inventory dependency to prevent pagination triggers

  const handleDelete = (id: string) => {
    setDeletingId(id)
    onDelete(id)
    setDeletingId(null)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    wasSearchingRef.current = true // Set flag when user types
  }

  const getStockColor = (available: number, total: number) => {
    const ratio = available / total
    if (ratio === 0) return "bg-red-100 text-red-700"
    if (ratio < 0.2) return "bg-orange-100 text-orange-700"
    return "bg-green-100 text-green-700"
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="p-2 animate-pulse">
            <div className="w-full aspect-[5/7] bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded mb-1 w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-2">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {inventory?.map((item: any) => (
          <Card key={item._id} className="p-2 hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="relative w-full mb-1 rounded overflow-hidden bg-gray-50 aspect-[5/7]">
              <img
                src={item?.images?.[0] || "/placeHolder.jpg"}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
              <Badge 
                variant="secondary" 
                className="absolute top-0.5 left-0.5 text-[10px] font-mono px-1 py-0"
              >
                {item?.code || "N/A"}
              </Badge>
            </div>

            {/* Content */}
            <div className="space-y-1">
              <h3 className="font-medium text-xs leading-tight truncate" title={item?.name}>
                {item?.name}
              </h3>
              
              <p className="text-[10px] text-gray-500 truncate">
                {item?.categoryName || "Uncategorized"}
              </p>

              {/* Price & Stock */}
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-semibold">{formatCurrency(item?.unit_cost || 0)}</span>
                <Badge 
                  className={`px-1 py-0 text-[9px] ${getStockColor(item?.available_quantity || 0, item?.inventoryQuantity || 0)}`}
                  variant="outline"
                >
                  {item?.available_quantity || 0}/{item?.inventoryQuantity || 0}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-0.5 pt-0.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-6 text-[10px] px-1"
                  onClick={() => router.push(`/list-inventory/overview/${item._id}`)}
                >
                  <Eye className="h-2.5 w-2.5 mr-0.5" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-1"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-2.5 w-2.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-1 text-red-600 hover:text-red-700"
                      disabled={deletingId === item._id}
                    >
                      {deletingId === item._id ? (
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-2.5 w-2.5" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{item?.name}&quot;? This action will:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Permanently remove the product from inventory</li>
                          <li>Remove all associated data</li>
                          <li>This cannot be undone</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete Product
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Simple Pagination */}
      {totalPages && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage! - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-xs px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage! + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}