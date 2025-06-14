import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Dropzone from "@/components/ui/dropzone";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";



export default function HomePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("textOnly");
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Function to handle file contents within multiple files 
const handlefileConents = async (files: File[]): Promise<string[]> => {
  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsText(file);
    });
  };

  const fileReadPromises = files.map(readFile);
  return Promise.all(fileReadPromises); 
};

  //Calling backend API Function
  const callAPI = async (data: any) => { 
    console.log("Calling API with data:", data);
    try { 
      const res = await fetch("http://127.0.0.1:8000/userinput", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await res.json();
      console.log("API response:", result);
    }
    catch (error) {
      console.error("API call failed:", error);
      toast({
        variant: "destructive",
        title: "API Call Failed",
        description: "An error occurred while processing your request.",
      });
    }
  }

  const handleAnalyze = async () => { 
    setIsLoading(true);

  // Validate content and files
  if (!content && files.length === 0) {
    toast({
      className: "w-[400px] text-left",
      variant: "destructive",
      title: "No content provided",
      description: "Please enter text or upload files to analyze.",
    });
    setIsLoading(false);
    return;
  }
   let fileContents: string[] = [];
      if (files.length > 0) {
        fileContents = await handlefileConents(files); 
      }
    
    // Simulate an API call
    await callAPI({ text:content, uploadedFiles: fileContents});

    // Removed redundant `if (isLoading)` check.
    
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  return (
    <>
      <div className="grid w-full place-content-center gap-4 mt-8 mb-4">
        <Tabs
          defaultValue={activeTab}
          className="w-[400px]"
          onValueChange={(changeTab) => {
            setActiveTab(changeTab);
            if (changeTab === "textOnly") {
              setFiles([]);
            } else if (changeTab === "uploadFiles") {
              setContent("");
            }
          }}
        >
          <TabsList>
            <TabsTrigger value="textOnly">Enter Text</TabsTrigger>
            <TabsTrigger value="uploadFiles">Upload File</TabsTrigger>
          </TabsList>
          <TabsContent value="textOnly">
            <Textarea
              className="w-full h-48"
              placeholder="Type your message here."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="uploadFiles">
            <Dropzone
              dropZoneClassName="h-48"
              accept={{ "text/csv": [".csv"], "text/plain": [".txt"] }}
              maxSize={10 * 1024 * 1024} // 10 MB
              initialFiles={files}
              onDropAccepted={(acceptedFiles) => {
                acceptedFiles
                  .map((file) => file.name)
                  .join(", ");
                setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
              }}

              onDropRejected={(fileRejections) => {
                const errorMessage = fileRejections
                  .map(
                    (file) =>
                      `File ${file.file.name} was rejected because it exceeds the maximum size.`
                  )
                  .join(" ");
                toast({
                  className: "w-[400px] text-left",
                  variant: "destructive",
                  title: "File Upload Error",
                  description: errorMessage,
                });
              }}
              disabled={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Button onClick={handleAnalyze} className="mb-2">Analyze</Button>
    </>
  );
}
