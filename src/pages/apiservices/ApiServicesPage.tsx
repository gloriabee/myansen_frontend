import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/DataTable"; 
import { columns } from "@/components/apiColumns";
import { ApiKey } from "@/types/ApiKey";


export default function ApiServicesPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const fetchApiKeys = async () => {
    //Mock data for API key table
    const data: ApiKey[] = [
      {
        id: "devkey1",
        name: "Development key 1",
        created: new Date("2025-04-26T13:26:23"),
        lastUsed: new Date("2025-04-26T13:26:23"),
      },
      
    ];
    setApiKeys(data);
  }


 
  useEffect(() => {
  
    const fetchData = async () => {
      await fetchApiKeys();
    };
    fetchData();
  
  }, []);
  return (
    <div className="grid w-full place-content-center  gap-4 mt-8">
      {/* API Key Creation Section */}
      <h1 className="text-2xl font-bold">Create New API Key</h1>
      <div className="flex gap-4 items-center place-content-end ">
        <Textarea
          className="w-96 h-30 inline-block align-baseline resize-none"
          placeholder="Key name (eg-production,testing,etc...)"
        />
        <Button className="w-32  p-2 mx-4">Generate Key</Button>
      </div>

      {/* API Keys Management Table Section */}
      <div className="container mx-auto py-5">
        <h1 className="text-2xl font-bold mb-6">API Keys Management</h1>{" "}
        <DataTable columns={columns} data={apiKeys} />
      </div>
    </div>
  );
}
