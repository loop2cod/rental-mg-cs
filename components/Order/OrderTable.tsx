'use client'
import React, { useMemo } from 'react'
import { ColumnDef, DataTable } from '../ui/data-table';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { Edit, View, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/commonFunctions'
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
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
} from '../ui/alert-dialog';

const OrderTable = ({
    onSearch,
    isLoading,
    orders,
    currentPage,
    totalPages,
    totalCount,
    onPageChange,
    onPageSizeChange,
    onDelete,
}: any) => {
    const router = useRouter();

    const columns: ColumnDef<any>[] = useMemo(() => [
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
            id: "user",
            header: "Customer",
            accessorKey: "user.name",
            sortable: true,
            searchable: true,
            cell: (item) => (
                <div>
                    <div className="font-medium">{item.user.name}</div>
                    <div className="text-sm text-gray-500">{item.user.mobile}</div>
                </div>
            ),
        },
        {
            id: "items",
            header: "Items",
            cell: (item) => (
                <div>
                    <div className="font-medium">Products: {item.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</div>
                    <div className="text-sm">Outsourced: {item.outsourced_items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</div>
                </div>
            ),
            sortable: false,
        },
        {
            id: "amount",
            header: "Amount",
            accessorKey: "total_amount",
            cell: (item) => formatCurrency(item?.total_amount),
            sortable: true,
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
            id: "status",
            header: "Status",
            accessorKey: "status",
            cell: (item) => {
                const status = item?.status;
                let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
                let className = "";
                
                switch (status?.toLowerCase()) {
                    case "pending":
                        variant = "outline";
                        className = "bg-yellow-100 text-yellow-800 border-yellow-300";
                        break;
                    case "confirmed":
                    case "active":
                        variant = "default";
                        className = "bg-blue-100 text-blue-800 border-blue-300";
                        break;
                    case "completed":
                    case "delivered":
                    case "success":
                        variant = "secondary";
                        className = "bg-green-100 text-green-800 border-green-300";
                        break;
                    case "cancelled":
                    case "failed":
                        variant = "destructive";
                        className = "bg-red-100 text-red-800 border-red-300";
                        break;
                    case "inreturn":
                    case "returned":
                        variant = "secondary";
                        className = "bg-purple-100 text-purple-800 border-purple-300";
                        break;
                    case "processing":
                    case "in_progress":
                        variant = "default";
                        className = "bg-orange-100 text-orange-800 border-orange-300";
                        break;
                    default:
                        variant = "outline";
                        className = "bg-gray-100 text-gray-800 border-gray-300";
                }
                
                return <Badge variant={variant} className={className}>{status}</Badge>;
            },
            sortable: true,
        },
        {
            id: "order_date",
            header: "Order Date",
            accessorKey: "order_date",
            cell: (item) => new Date(item?.order_date).toLocaleDateString(),
            sortable: true,
        },
        {
            id: "actions",
            header: "Actions",
            cell: (item) => (
                <div className="flex justify-start gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/order/details/${item._id}`);
                                    }}
                                >
                                    View
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View Order</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/order/update/${item._id}`);
                                    }}
                                >
                                    Edit
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit Order</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 hover:bg-red-50 text-red-600 hover:text-red-700"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this order? This action will:
                                        <ul className="list-disc list-inside mt-2 space-y-1">
                                            <li>Permanently delete the order</li>
                                            <li>Restore inventory quantities</li>
                                        </ul>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => {
                                            if (onDelete) {
                                                onDelete(item._id);
                                            }
                                        }}
                                    >
                                        Delete Order
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                </div>
            ),
            sortable: false,
            searchable: false,
        },
    ], [router, onDelete]);

    return (
        <div className="px-2 md:px-4 lg:px-6">
            <DataTable
                itemsPerPageOptions={[5, 10, 20, 50, 100]}
                isLoading={isLoading}
                data={orders}
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

export default OrderTable;