import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { icons } from "@/components/icons";
import { sentimentColumns } from "@/components/ui/sentimentColumns";
import { type SentimentColumn } from "@/types/sentimentColums";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  processUploadingDataSetToS3,
  fetchSentimentResultsForUser,
  noCase
} from "@/utils/dashboardPageUtils";
import { ProgressGame } from "@/components/ui/progress";
import { handleExport } from "@/utils/exportFile";
import { Badge } from "@/components/ui/badge";
import { v4 as uuid } from "uuid";




export default function DashboardPage() {
  const location = useLocation();
  const [collectedFeedback, setCollectedFeedback] = useState(0);
  const [submitedRowId, setSubmitedRowId] = useState<string | null>(null);
  const targetFeedback = 100; 

  const progress = Math.min(
    100,
    Math.round((collectedFeedback / targetFeedback) * 100)
  );

  const apiResponse: any[] = useMemo(
    () => location.state?.apiResponse?.results || [],
    [location.state]
  );

  const [sentimentColumnsData, setSentimentColumnsData] = useState<
    SentimentColumn[]
  >([]);



  // Function to fetch all sentiment results for the user from DB
 const loadData = async () => {
    try {
      let rawData: any[] = [];

      if (apiResponse && apiResponse.length > 0) {
        //console.log("Using passed API response (guest or user session)");
        rawData = apiResponse;
      } else {
        const responseData = await fetchSentimentResultsForUser();
        if (responseData?.results?.length > 0) {
          rawData = responseData.results;
         // console.log(">>> Loaded sentiment results from DB.");
        } else {
          const guestResult = localStorage.getItem("guest_result");
          if (guestResult) {
            const parsed = JSON.parse(guestResult);
            rawData = parsed.results || [];
          } else {
            console.log("No data found for user or guest.");
          }
        }
      }
      //grab colums data
      const columnsData: SentimentColumn[] = rawData.map((item: any) => ({
        id: item.id?.toString() ?? uuid(),
        text: item.text,
        sentiment:
          item.predicted_label?.toLowerCase?.() ??
          item.sentiment?.toLowerCase?.() ??
          "neutral",
        confidence: item.confidence,
        feedback: {
          type:
            item.predicted_label?.toLowerCase?.() ??
            item.sentiment?.toLowerCase?.() ??
            "neutral",
        },
      }));

      setSentimentColumnsData(columnsData);

    } catch (err: any) {
      console.error("Failed to load sentiment data:", err);
      setSentimentColumnsData([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [apiResponse]);

 
  // Handle feedback submission from DataTable
  const handleSubmitFeedback = useCallback((id: string, value: string) => {
    setSubmitedRowId(id);
    setCollectedFeedback((prev) => prev + 1);
    setSentimentColumnsData((prevData) =>
      prevData.map((item) =>      
        item.id === id
          ? { ...item, feedback: { type: value as "positive" | "neutral" | "negative" } }
          : item
      )
    );

    
  }, []); 
   
  useEffect(() => {
    console.log("SentimentColumnsData changed:", sentimentColumnsData);
  }, [sentimentColumnsData]);

 
const columns = useMemo(
  () => sentimentColumns(handleSubmitFeedback),
  [handleSubmitFeedback]
);
  

  return (
    <>
      <div className="mx-3 py-5 flex justify-between">
         {/* <pre>
          {JSON.stringify(
            sentimentColumnsData.map((item) => ({
              id: item.id?.toString() ?? uuid(),
              text: item.text,
              feedback: item.feedback?.type,
            })),
            null,
            2
          )}
        </pre>  */}
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Sentiment Dashboard
        </h2>
        <div>
          <Button
            onClick={() => handleExport(sentimentColumnsData)}
            className="bg-teal-700 text-white hover:bg-teal-600"
          >
            <icons.export className="mr-2" />
            Export Data
          </Button>
          <Button
            variant="outline"
            className="outline relative text-teal-600 hover:bg-teal-600 hover:text-white ml-4"
            onClick={() => processUploadingDataSetToS3(sentimentColumnsData)}
            disabled={collectedFeedback < targetFeedback}
          >
            <icons.loop className="mr-2" />
            Retrain Model
            {collectedFeedback >= targetFeedback && (
              <Badge className="h-3 min-w-3 rounded-full px-1 font-mono tabular-nums bg-red-600 border-red-600  animate-pulse pointer-events-none absolute right-0 top-0 -translate-x-1/2 -translate-y-1/2 "></Badge>
            )}
          </Button>
        </div>
      </div>
      <div className="mx-3 mb-4 bg-[#e5fffc] items-center p-2 px-5 pt-3 rounded-xl">
        <div className="flex justify-between">
          <h4 className="mb-1">Feedback collected: {collectedFeedback}</h4>
          <small>Goal: {targetFeedback}</small>
        </div>
        <ProgressGame
          value={progress}
          className="mb-5 w-[100%]"
          showPercent={false}
          targetGoal={targetFeedback}
          customMaker={"🥳"}
        />
      </div>

      <div>
        <DataTable
          columns={columns}
          data={sentimentColumnsData}
          noCase={noCase}
          itemsPerPage={3}
        />
      </div>
    </>
  );
}


