import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/DataTable"; 
import { columns } from "@/components/apiColumns";
import { ApiKey } from "@/types/ApiKey";
import { ToastAction } from "@/components/ui/toast"; 
import { useToast } from "@/hooks/use-toast";


export default function ApiServicesPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState<string>("");
  const { toast } = useToast();


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

  // Function to handle key generation (mocked)
  const handleGenerateKey = () => {
    // Logic to generate a new API key
    console.log("API Key generated");
    if (newKeyName.trim() === "") {
      toast({
        variant: "destructive",
        title: "Uh oh! Empty Key Name",
        description: "Please write something as key name.",
        className: "w-96 text-justify",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      created: new Date(),
      lastUsed: new Date(),
    };
    setApiKeys((prevKeys) => [...prevKeys, newKey]);
    setNewKeyName("");
    toast({
      title: "API Key Created",
      description: `New API key "${newKey.name}" has been created successfully.`,
      className: "w-96 text-justify",
    });

  

  };
  return (
    <div className="grid w-full place-content-center  gap-4 mt-8">
      {/* API Key Creation Section */}
      <h1 className="text-2xl font-bold">Create New API Key</h1>
      <div className="flex gap-4 items-center place-content-end ">
        <Textarea
          className="w-96 h-30 inline-block align-baseline resize-none"
          placeholder="Key name (eg-production,testing,etc...)"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
        />
        <Button
          className="w-32  p-2 mx-4"
        
          onClick={handleGenerateKey}
        >
          Generate Key
        </Button>
      </div>
     

      {/* API Keys Management Table Section */}
      <div className="container mx-auto py-5">
        <h1 className="text-2xl font-bold mb-6">API Keys Management</h1>{" "}
        <DataTable columns={columns} data={apiKeys} noCase={"No Key Generated yet!"} itemsPerPage={3} />
      </div>
    </div>
  );
}
