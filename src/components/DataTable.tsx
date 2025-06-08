
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  noCase?: string; // Optional prop for no data case
}

export function DataTable<TData, TValue>({
  columns,
  data,
  noCase = "No data available", 
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center w-[200px]">
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
            
              let sentimentScore: number = row.getValue("confidence") as number;
              const shouldHighlight = sentimentScore <= 0.6; 
              let text: string = row.getValue("text") as string;


              return (
              
              <TableRow
                key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={shouldHighlight ? "bg-yellow-50 hover:bg-yellow-100" : ""}
                 
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-4 ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <span dangerouslySetInnerHTML={{ __html: noCase }} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
