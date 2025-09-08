import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ApiKey } from "@/types/ApiKey";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const columns: ColumnDef<ApiKey>[] = [
  {
    id: "key_name",
    accessorKey: "key_name",
    header: "Name",
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created",
    // Add a custom cell renderer for date formatting
    cell: ({ row }) => {
      const dateString = row.getValue("created_at") as string;

      if (!dateString) {
        return <span>N/A</span>;
      }

      let date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Check for "Invalid Date"
        console.warn(
          "Invalid date string received for created_at:",
          dateString
        );
        return <span className="text-red-500">Invalid Date Format</span>;
      }

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
    id: "lastused_at",
    accessorKey: "lastused_at",
    header: "Last Used",
    // Add a custom cell renderer for date formatting
    cell: ({ row }) => {
      const dateString = row.getValue("lastused_at") as string;
      if (!dateString) {
        return <span>N/A</span>;
      }
      let date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Check for "Invalid Date"
        console.warn(
          "Invalid date string received for created_at:",
          dateString
        );
        return <span className="text-red-500">Invalid Date Format</span>;
      }
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
    cell: (props) => {
      const apiKey = props.row.original;
      const onApiKeysUpdated = (
        props.table.options.meta as { onApiKeysUpdated: () => Promise<void> }
      ).onApiKeysUpdated;

      const data = {
        key_name: apiKey.key_name,
        public_key: apiKey.public_key,
        hash_key: apiKey.hash_key,
      };
      const { toast } = useToast();
      const navigate = useNavigate();

      let tokenRef = useRef<string | null>(null);
      tokenRef.current = localStorage.getItem("access_token");

      if (!tokenRef) {
        console.log("No access token found. Redirecting to login.");
        navigate("/login");
        throw new Error("Authentication required.");
      }

      const handleRevoke = async () => {
        // Logic to revoke the API key
        // This could involve an API call to your backend service

        try {
          const res = await fetch("http://127.0.0.1:8000/api_key_delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenRef.current}`,
            },
            body: JSON.stringify(data),
          });
          if (res.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            navigate("/login");
            throw new Error(
              "Unauthorized: Access token expired or invalid. Redirecting to login."
            );
          }
          if (res.ok || res.status === 200) {
            console.log("API key revoked successfully");
            toast({
              className: "w-[400px] text-left",
              variant: "default",
              title: "API Key Revoked!!",
              description: "API Key is deleted.",
              duration: 2000,
            });
            if (onApiKeysUpdated) {
              await onApiKeysUpdated();
            } else {
              console.warn(
                "onApiKeysUpdated function not available in DataTable column meta."
              );
            }
          } else {
            console.error("Failed to revoke API key:", res.statusText);
            toast({
              className: "w-[400px] text-left",
              variant: "destructive",
              title: "API Key Revoke Failed!!",
              description: "Failed to revoke API key. Please try again.",
              duration: 2000,
            });
          }
        } catch (error) {
          console.error("Error revoking API key:", error);
          toast({
            className: "w-[400px] text-left",
            variant: "destructive",
            title: "API Key Revoke Failed!!",
            description: "Failed to revoke API key. Please try again.",
            duration: 2000,
          });
        }
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
