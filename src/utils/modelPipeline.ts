import { PreSignPutObjResponse, MakeDataSet,TriggerModelRequest } from "@/types/AWS";
import { v4 as uuidv4 } from "uuid";





const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const API_VERSION = "/api/v1/"

//get text and feeback to make dataset
export  async function makeDatasetToUpload(formattedData: MakeDataSet[]){

  //making formatted dataset into csv file 
  const headerRows = ["text","label"]
  const rows = formattedData.map((item)=>[item.text,item.feedback])
  const csvStrings = [headerRows, ...rows].map((row)=>row.map(val => `"${val}"`).join(",")).join("\n");  
  const DataSetName = `${JSON.parse(localStorage.getItem('user')?? 'undefined').email}+${new Date().toISOString()}+${uuidv4()}`;

  const formattedFile: File = new File([csvStrings], DataSetName ,{type: "text/csv"});

  return formattedFile;


}
async function fetchPresignedUrl(file: File): Promise<PreSignPutObjResponse> { 
    const url = new URL(`${API_BASE_URL}${API_VERSION}upload/presigned_url`);
    console.log(">> Calling URL:", url.toString());
    
     const form = new FormData();
        form.append("file", file); 
    const presign_url = await fetch(url, {
        method: "POST",
        body: form
    });
    if (!presign_url.ok) {
    const errText = await presign_url.text(); 
    console.error("S3 error:", errText);
    throw new Error(
      `S3 upload failed: ${presign_url.text()} ${presign_url.status} ${
        presign_url.statusText
      }. ${errText}`
    );
}
    const data: PreSignPutObjResponse = await presign_url.json();
   return data; 
}


export async function uploadDatasetToS3(file?: File) {
    console.log("Upload to S3 clicked - implement your logic here");
    console.log(">>> uploaded file:", file)
    if (!file){
       new Error("No file existed to upload!")
       return;
    }
    
    const { url, key, bucket }: PreSignPutObjResponse = await fetchPresignedUrl(file);
    
    //put file to S3
    const uploadtoS3 = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
    });
    if (uploadtoS3.ok)
    { console.log("Uploaded!"); }
    else {
        const errText = await uploadtoS3.text();
        console.error("S3 PUT error:", errText);
        throw new Error(
        `S3 upload failed: ${uploadtoS3.status} ${uploadtoS3.statusText}`
        );
    }
    
    return { key, bucket };
}

export async function TriggerModelTrainingNotebook(s3Data: TriggerModelRequest){

 const triggerResult= await fetch("http://127.0.0.1:8000/retrainmodel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(s3Data)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error retraining model:", error);
        });
      
      return triggerResult
}
