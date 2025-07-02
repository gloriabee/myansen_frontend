import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Dropzone from "@/components/ui/dropzone";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { LoaderCircle, Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

import {
  breakMyanmarSyllables,
  countMyanmarSyllables,
} from "@/utils/breakSyllable";
import { isMyanmarText } from "@/utils/checkMyanmar";

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const tokenRef = useRef<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>("textOnly");
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    tokenRef.current = token;
    console.log("Token", token);
  }, []);

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

  const callAPI = async (data: any) => {
    const token = tokenRef.current;

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("http://127.0.0.1:8000/userinput", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (res.status === 401) {
        if (token) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/login");
          throw new Error("Unauthorized: Token expired or invalid.");
        } else {
          // Guest access - do not redirect
          const guestResult = await res.json();
          localStorage.setItem("guest_result", JSON.stringify(guestResult));
          navigate("/dashboard");
          return;
        }
      }

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await res.json();
      console.log("API response:", result);

      if (token) {
        navigate("/dashboard", { state: { apiResponse: result } });
      } else {
        localStorage.setItem("guest_result", JSON.stringify(result));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast({
        variant: "destructive",
        title: "API Call Failed",
        description: "An error occurred while processing your request.",
      });
    }
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    toast({
      className: "w-[400px] text-left",
      variant: "default",
      title: "File Deleted",
      description: "The file has been successfully deleted.",
      duration: 2000,
    });
  };

  //Analyze text function
  const handleAnalyze = async () => {
    setIsLoading(true);
    console.log(">>>> Break Myaname Syllables", breakMyanmarSyllables(content));
    console.log(
      ">>>> Count Myanmar Syllables:::",
      countMyanmarSyllables(content)
    );
    if (!content && files.length === 0) {
      toast({
        className: "w-[400px] text-left",
        variant: "destructive",
        title: "No content provided",
        description: "Please enter text or upload files to analyze.",
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }
    let fileContents: string[] = [];
    let analyzeContents: string[] = [];

    //Check file contents is Myanmar text or not
    if ((files.length > 0 && files.length <= 20) || content.length > 0) {
      fileContents = await handlefileConents(files);
      for (const fileContent of fileContents) {
        console.log(">>File Content:", fileContent);
        console.log(">>>isMyanmarText:", isMyanmarText(fileContent));

        if (!isMyanmarText(fileContent)) {
          toast({
            className: "w-[400px] text-left",
            variant: "destructive",
            title: "Language Unavailable",
            description: "Please Enter only Myanmar text in files",
            duration: 2000,
          });
          setIsLoading(false);
          return;
        } else {
          analyzeContents.push(fileContent);
        }
      }
      console.log(">>>End of File Content");
      //Call API
    } else {
      toast({
        className: "w-[400px] text-left",
        variant: "destructive",
        title: "Exceeds Content",
        description: "“Too much files!System accepts maximum 20 files.",
        duration: 2000,
      });
      setIsLoading(false);
      return;
    }

    //Check text content is Myanmar text or not
    if (content) {
      if (isMyanmarText(content)) {
        //count Myanmar syllables
        if (countMyanmarSyllables(content) > 100) {
          toast({
            className: "w-[400px] text-left",
            variant: "destructive",
            title: "Exceeds Content",
            description: "Maximum Characters is 100",
            duration: 2000,
          });
          setIsLoading(false);
          return;
        } else {
          setContent(content.trim());
        }
      } else {
        toast({
          className: "w-[400px] text-left",
          variant: "destructive",
          title: "Language Unavailable",
          description: "Please Enter only Myanmar text",
          duration: 2000,
        });
        setIsLoading(false);
        return;
      }
    }

    // Prepare data for API call
    const data = {
      text: content,
      uploadedFiles: analyzeContents,
    };
    console.log(">>>Data to be sent to API:", data);

    //Input API call
    await callAPI(data);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col gap-4 justify-center items-center mt-8 mb-4">
          <div className="rounded-lg w-[400px] flex items-center justify-center gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="border-dashed border-2 border-gray-200 rounded-lg w-[400px] h-48 flex flex-col items-center justify-center gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center justify-center m-7">
            <LoaderCircle className="animate-spin h-6 w-6 text-black" />
            <span className="ml-2 text-2xl">Analyzing...</span>
          </div>
        </div>
      ) : (
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
                  maxSize={10 * 1024 * 1024}
                  initialFiles={files}
                  onDeletedfile={handleDeleteFile}
                  onDropAccepted={(acceptedFiles) => {
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
          <Button onClick={handleAnalyze} className="mb-2">
            <Send />
            Analyze
          </Button>
        </>
      )}
    </>
  );
}
