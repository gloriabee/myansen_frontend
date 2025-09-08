import {
  uploadDatasetToS3,
  makeDatasetToUpload,
  TriggerModelTrainingNotebook,
} from "@/utils/modelPipeline";
import { MakeDataSet } from "@/types/AWS";
import { type SentimentColumn } from "@/types/sentimentColums";


export async function processUploadingDataSetToS3(
  sentimentColumnsData: SentimentColumn[]
) {
  // 1.make formatted dataset
  const formattedDataSet: MakeDataSet[] = sentimentColumnsData.map((item) => ({
    text: item.text,
    feedback: item.feedback?.type as "positive" | "neutral" | "negative",
  }));
  const afterFormatted = await makeDatasetToUpload(formattedDataSet);

  if (!afterFormatted) {
    return { message: " There is no dataset to upload! " };
  }

  // 2.upload the dataset to s3
  const afterUploadResult = await uploadDatasetToS3(afterFormatted);
  if (!afterUploadResult) {
    return { message: " There is no upload result! " };
  }

  //3. trigger backend api with s3 key and bucket
  const afterTriggerResult = await TriggerModelTrainingNotebook(
    afterUploadResult
  );
  if (!afterTriggerResult) {
    return { message: " There is no after trigger result! " };
  }
  console.log(">>>> After Trigger Result:", afterTriggerResult);

  return afterTriggerResult;
}

export async function fetchSentimentResultsForUser() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.log("No token: guest mode, skip DB fetch.");
    return null;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/userinput", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      console.warn("Token expired. User will be logged out.");
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
}

export const noCase =
  "<b>No results yet!</b><br> Upload a file or paste text in the 'File Upload' tab to see sentiment analysis results here</br > ";

  