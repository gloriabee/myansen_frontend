
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ApiKey } from "@/types/ApiKey";

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "created",
    header: "Created",
    // Add a custom cell renderer for date formatting
    cell: ({ row }) => {
      const date = row.getValue("created") as Date;
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(date);
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "lastUsed",
    header: "Last Used",
    // Add a custom cell renderer for date formatting
    cell: ({ row }) => {
      const date = row.getValue("lastUsed") as Date;
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(date);
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const apiKey = row.original;
   
      const handleRevoke = () => {
        console.log(`Revoking key: ${apiKey.name} (ID: ${apiKey.id})`);
        alert(`Key "${apiKey.name}" would be revoked now!`);
      };

      return (
        <Button
          variant="link"
          onClick={handleRevoke}
          className="text-red-500 hover:text-red-600 px-0 cursor-pointer"
        >
          Revoke
        </Button>
      );
    },
  },
];
