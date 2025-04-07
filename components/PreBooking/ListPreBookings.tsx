"use client";
import React, { useMemo, useState } from "react";
import { ColumnDef, DataTable } from "../ui/data-table";
import { Button } from "../ui/button";
import { BookUp2Icon, Edit, View, X } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/commonFunctions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useRouter } from "next/navigation";
import { patch} from "@/utilities/AxiosInterceptor";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CancelBookingDialog } from "./CancelBookingDialog";


interface ApiResponseType {
  success: boolean;
  data?: any;
  message?: string;
  errors?: any;
}
const ListPreBookings = ({
  preBookings,
  fetchPreBookings,
  itemsPerPage,
  searchTerm,
  onSearch,
  isLoading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: any) => {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = async (remarks: string) => {
    if (!selectedBookingId) return;
    
    setIsCancelling(true);
    try {
      const response = await patch<ApiResponseType>(
        `${API_ENDPOINTS.BOOKING.CANCEL}/${selectedBookingId}`,
        { remarks },
        { withCredentials: true }
      );
      if (response.success) {
      setIsDialogOpen(false);
      fetchPreBookings(currentPage, itemsPerPage, searchTerm);
      }
    } catch (error) {
      console.error("Failed to cancel booking", error);
      // Handle error - show error message
    } finally {
      setIsCancelling(false);
    }
  };

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
              <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/pre-booking/${item._id}`);
                  }}
                >
                  <View className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  View Booking
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/order/${item._id}`);
                  }}
                >
                  <BookUp2Icon className="h-4 w-4" />
                  <span className="sr-only">Make Order</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                Make Order
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/list-pre-bookings/${item._id}`);
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Booking</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
    
          <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBookingId(item._id);
                      setIsDialogOpen(true);
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cancel Booking</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
         <CancelBookingDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCancelBooking={handleCancelBooking}
        isCancelling={isCancelling}
      />
    </div>
  );
};

export default ListPreBookings;