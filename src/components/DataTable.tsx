
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useMemo} from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noCase?: string; // Optional prop for no data case
  itemsPerPage?: number; 
}

export function DataTable<TData, TValue>({
  columns,
  data,
  noCase = "No data available", 
  itemsPerPage = 3, // Default items per page
}: DataTableProps<TData, TValue>) {

  //Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
 
  //Slice the data for pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage; // 0
    return data.slice(startIndex, startIndex + itemsPerPage);//(0,3)=> [0,1,2]
  }, [data, currentPage, itemsPerPage]);

  //Table Setup
   const table = useReactTable({
     data: paginatedData,
     columns,
     getCoreRowModel: getCoreRowModel(),
   });
  //Function for changing page number
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    } else setCurrentPage(1);
  };

  //function to display page numbers
  const displayPage = () => {
    let pages = [];
    const maxPage = 3;
    if (totalPages <= maxPage) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i); //1,2,3
      }
      return pages;
    } else {
// Removed unnecessary console.log statement

      const startPage = Math.max(1, currentPage - 1); //1
      const endPage = Math.min(totalPages, startPage + maxPage - 1); //3
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center w-[200px]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                let sentimentScore: number = row.getValue(
                  "confidence"
                ) as number;
                const shouldHighlight = sentimentScore <= 0.6;
                let text: string = row.getValue("text") as string;

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={
                      shouldHighlight ? "bg-yellow-50 hover:bg-yellow-100" : ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4 ">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span dangerouslySetInnerHTML={{ __html: noCase }} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-5 flex justify-end mb-3">
        <PaginationContent className="flex">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                handlePageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {displayPage().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={() => {
                  handlePageChange(page);
                }}
                className={currentPage === page ? "bg-teal-600 text-white" : ""}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {/* Show ellipsis if there are more pages */}
          {totalPages > 3 && currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => {
                handlePageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
