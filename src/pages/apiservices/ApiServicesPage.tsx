import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/apiColumns";
import { ApiKey } from "@/types/ApiKey";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function ApiServicesPage() {
  const navigate = useNavigate();
  //const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState<string>("");
  const { toast } = useToast();
  let tokenRef = useRef<string | null>(null);

  //fetching all API keys from the backend
  const fetchApiKeys = async () => {
    tokenRef.current = localStorage.getItem("access_token");

    if (!tokenRef) {
      console.log("No access token found. Redirecting to login.");
      navigate("/login");
      setApiKeys([]);
      throw new Error("Authentication required.");
    }
    const res = await fetch("http://127.0.0.1:8000/api_key", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenRef.current}`,
      },
    });
    const data = await res.json();

    if (res.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      navigate("/login");
      throw new Error(
        "Unauthorized: Access token expired or invalid. Redirecting to login."
      );
    }
    console.log(">>>>fetch API from DB :", data);
    setApiKeys(data.data);
    return data.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchApiKeys();
    };
    fetchData();
  }, []);

  //Calling backend API key creation function
  const callAPI = async (data: any) => {
    console.log("Calling API with data:", data);
    tokenRef.current = localStorage.getItem("access_token");

    if (!tokenRef) {
      console.log("No access token found. Redirecting to login.");
      navigate("/login");
      throw new Error("Authentication required.");
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/api_key_creation", {
        method: "POST",
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

      return res;
    } catch (error) {
      console.error("API call failed:", error);
      toast({
        variant: "destructive",
        title: "API Call Failed",
        description: "An error occurred while processing your request.",
      });
    }
  };

  // Function to handle key generation (mocked)
  const handleGenerateKey = async () => {
    const newKey = {
      key_name: newKeyName,
      public_key: "",
      hash_key: "",
      created_at: "",
      lastused_at: "",
      account_status: "",
    };
    // Logic to generate a new API key
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

    //call API to create new key
    const res = await callAPI(newKey);
    if (!res) {
      throw new Error("No response received from the API.");
    }
    const result = await res.json();
    console.log("Generated Key Response ", result);
    if (res.status == 409) {
      toast({
        variant: "destructive",
        title: `Key name "${newKeyName}" already exists.`,
        description: `Please choose a different name.`,
        className: "w-96 text-justify",
      });
      return;
    }
    if (!result || !result.data || !result.data.key_name) {
      toast({
        variant: "destructive",
        title: "API Key Creation Failed",
        description: "Failed to create API key. Please try again.",
        className: "w-96 text-justify",
      });
      return;
    }

    // Update the new key with the response data
    newKey.key_name = result.data.key_name;
    newKey.created_at = result.data.created_at;
    newKey.lastused_at = result.data.lastused_at;
    newKey.public_key = result.data.public_key;
    console.log("New API Key Created:", result.data.key_name);
    setApiKeys((prevKeys) => [...prevKeys, newKey]);
    setNewKeyName("");

    toast({
      title: "API Key Created",
      description: (
    <span title={newKey.public_key} style={{wordBreak: "break-all"}}>
      {newKey.public_key}
    </span>
  ),
      className: "w-120 text-justify p-4 m-2",
      action: <ToastAction altText="Copy" onClick={() => navigator.clipboard.writeText(newKey.public_key)}>Copy</ToastAction>,

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
        <Button className="w-32  p-2 mx-4" onClick={handleGenerateKey}>
          Generate Key
        </Button>
      </div>

      {/* API Keys Management Table Section */}
      <div className="container mx-auto py-5">
        <h1 className="text-2xl font-bold mb-6">API Keys Management</h1>{" "}
        <DataTable
          columns={columns}
          data={apiKeys}
          noCase={"No Key Generated yet!"}
          itemsPerPage={3}
          onFetchData={fetchApiKeys}
        />
      </div>
    </div>
  );
}
