"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronUp,
  Search,
  FileSpreadsheet,
  FileText,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportToExcel, exportToPdf } from "@/lib/export-utils"
import { Skeleton } from "./skeleton"

export type ColumnDef<T> = {
  id: string
  header: string
  accessorKey?: string
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
  searchable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  searchPlaceholder?: string
  itemsPerPageOptions?: number[]
  defaultItemsPerPage?: number
  tableName?: string
  renderMobileCard?: (item: T, index: number) => React.ReactNode
  onRowClick?: (item: T) => void
  showSearchBar?: boolean
  showPdfExport?: boolean
  showExcelExport?: boolean
  showPagination?: boolean
  currentPage?: number
  totalPages?: number
  totalCount?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  serialNumber?: boolean
  onSearch?: (term: string) => void
  isLoading?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  itemsPerPageOptions = [10, 25, 50, 100],
  defaultItemsPerPage = 10,
  tableName = "Data",
  onRowClick,
  showSearchBar = true,
  showPdfExport = true,
  showExcelExport = true,
  showPagination = true,
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  totalCount: externalTotalCount,
  onPageChange,
  onPageSizeChange,
  serialNumber = true,
  onSearch,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)

  const currentPage = externalCurrentPage ?? internalCurrentPage
  const totalPages = externalTotalPages ?? Math.ceil(data?.length / itemsPerPage)
  const totalCount = externalTotalCount ?? data?.length

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const finalColumns: any = useMemo(() => {
    if (!serialNumber) return columns

    return [
      {
        id: "serialNumber",
        header: "SI No.",
        cell: (_: any, index: number) => (
          <span className="ps-3 font-bold font-sans">{(currentPage - 1) * itemsPerPage + index + 1}</span>
        ),
        sortable: false,
        searchable: false,
      },
      ...columns,
    ]
  }, [columns, serialNumber, currentPage, itemsPerPage])

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data

    return data.filter((item) => {
      return finalColumns.some((column: any) => {
        if (!column.searchable) return false
        const value = column.accessorKey ? getNestedValue(item, column.accessorKey) : null
        return value !== null && value !== undefined && String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, searchTerm, finalColumns])

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData
    return [...filteredData].sort((a, b) => {
      const column: any = finalColumns.find((col: any) => col.id === sortField)
      if (!column?.accessorKey) return 0

      const valueA = getNestedValue(a, column.accessorKey)
      const valueB = getNestedValue(b, column.accessorKey)

      if (valueA === valueB) return 0
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }
      return sortDirection === "asc" ? (valueA < valueB ? -1 : 1) : valueA > valueB ? -1 : 1
    })
  }, [filteredData, sortField, sortDirection, finalColumns])

  const paginatedData = useMemo(() => {
    if (onPageChange) return data
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage, onPageChange, data])

  function getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : null), obj)
  }

  const handleExportExcel = () => exportToExcel(sortedData, finalColumns, tableName)
  const handleExportPdf = () => exportToPdf(sortedData, finalColumns, tableName)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange ? onPageChange(page) : setInternalCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size)
    onPageSizeChange?.(size)
    handlePageChange(1)
  }

  return (
    <div className="space-y-4">
      {(showSearchBar || showPdfExport || showExcelExport) && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {showSearchBar && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handlePageChange(1)
                  onSearch?.(e.target.value)
                }}
              />
            </div>
          )}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `Showing ${totalCount} items`}
            </div>
            <div className="flex gap-2">
              {showExcelExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportExcel}
                  title="Export to Excel"
                  disabled={isLoading}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Excel</span>
                </Button>
              )}
              {showPdfExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPdf}
                  title="Export to PDF"
                  disabled={isLoading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="block border rounded-lg relative">
        <Table>
          <TableHeader>
            <TableRow>
              {finalColumns.map((column: any) => (
                <TableHead
                  key={column.id}
                  className={column.sortable ? "cursor-pointer" : ""}
                  onClick={() => column.sortable && !isLoading && handleSort(column.id)}
                >
                  <div className="flex items-center gap-1">
                    {column.header} {column.sortable && getSortIcon(column.id)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
          <>
           {[...Array(itemsPerPage || 5)].map((_, i) => (
      <TableRow key={i}>
        {finalColumns.map((column: any) => (
          <TableCell key={column.id}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
    </>
            ) : paginatedData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className="text-center py-8">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData?.map((item, index) => (
                <TableRow
                  key={index}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => !isLoading && onRowClick?.(item)}
                >
                  {finalColumns.map((column: any) => (
                    <TableCell key={column.id}>
                      {column.cell
                        ? column.cell(item, index)
                        : column.accessorKey
                          ? getNestedValue(item, column.accessorKey)
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-[75px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || isLoading}
              className="hidden md:flex h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm mx-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0 || isLoading}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0 || isLoading}
              className="hidden md:flex h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}