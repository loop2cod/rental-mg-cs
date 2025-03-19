"use client";
import React, { useMemo } from "react";
import { ColumnDef, DataTable } from "../ui/data-table";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns"; // Import date-fns for date formatting
import { formatCurrency } from "@/lib/commonFunctions";

const ListPreBookings = ({
  preBookings,
  onSearch,
  isLoading,
  inventory,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: any) => {
  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        id: "customer_name",
        header: "Customer Name",
        accessorKey: "user_id.name",
        sortable: true,
        searchable: true,
      },
      {
        id: "from_date",
        header: "From Date",
        accessorKey: "from_date",
        cell: (item) => {
          const fromDate = format(new Date(item.from_date), "MMM dd, yyyy");
          return (
            <div className="text-sm">
              <span className="block">{fromDate}</span>
              <span className="text-xs text-gray-500">{item.from_time}</span>
            </div>
          );
        },
        sortable: true,
        searchable: false,
      },
      {
        id: "to_date",
        header: "To Date",
        accessorKey: "to_date",
        cell: (item) => {
          const toDate = format(new Date(item.to_date), "MMM dd, yyyy");
          return (
            <div className="text-sm">
              <span className="block">{toDate}</span>
              <span className="text-xs text-gray-500">{item.to_time}</span>
            </div>
          );
        },
        sortable: true,
        searchable: false,
      },
      {
        id: "booking_date",
        header: "Booking Date",
        accessorKey: "booking_date",
        cell: (item) => {
          const bookingDate = format(new Date(item.booking_date), "MMM dd, yyyy");
          return <span className="text-sm">{bookingDate}</span>;
        },
        sortable: true,
        searchable: false,
      },
      {
        id: "items",
        header: "Items",
        accessorKey: "booking_items",
        cell: (item) => {
          const items = item.booking_items.map((item: any) => item?.name);
          return (
            <div className="text-sm">
              {items.join(", ")}
              <span className="text-xs text-gray-500 block">
                {item.booking_items?.length} items
              </span>
            </div>
          );
        },
        sortable: true,
        searchable: false,
      },
      {
        id: "total_amount",
        header: "Total",
        accessorKey: "total_amount",
        cell: (item) => (
          <span className="text-sm font-medium">{formatCurrency(item.total_amount)}</span>
        ),
        sortable: true,
        searchable: false,
      },
      {
        id: "amount_paid",
        header: "Paid",
        accessorKey: "amount_paid",
        cell: (item) => (
          <span className="text-sm font-medium">{formatCurrency(item.amount_paid)}</span>
        ),
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
                e.stopPropagation();
              }}
              className="hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 " />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="hover:bg-gray-100"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
        ),
        sortable: false,
        searchable: false,
      },
    ],
    []
  );

  return (
    <div className="px-2 md:px-2 lg:px-4">
      <DataTable
        itemsPerPageOptions={[5, 10, 20, 50, 100]}
        isLoading={isLoading}
        data={preBookings}
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
  );
};

export default ListPreBookings;