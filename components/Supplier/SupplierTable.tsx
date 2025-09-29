'use client'
import React, { useMemo } from 'react';
import { ColumnDef, DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useRouter } from 'next/navigation';


interface SupplierTableProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  suppliers: any;
  onEdit: (item:any) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const SupplierTable = ({
  onSearch,
  isLoading,
  suppliers,
  onEdit,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: SupplierTableProps) => {
  const router = useRouter();


  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      sortable: true,
      searchable: true,
    },
    {
      id: "contact",
      header: "Contact",
      accessorKey: "contact",
      sortable: true,
      searchable: true,
    },
    {
      id: "address",
      header: "Address",
      accessorKey: "address",
      sortable: true,
      searchable: false,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ( item : any) => (
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
                    router.push(`/list-suppliers/${item?._id}`)
                  }}
                >
                  View
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Supplier</p>
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
                    onEdit(item);
                  }}
                >
                  Edit
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Supplier</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      sortable: false,
      searchable: false,
    },
  ], [onEdit]);

  return (
    <div className="px-2 md:px-4 lg:px-6">
      <DataTable
        itemsPerPageOptions={[5, 10, 20, 50, 100]}
        isLoading={isLoading}
        data={suppliers}
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

export default SupplierTable;