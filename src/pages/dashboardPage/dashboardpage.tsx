import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { icons } from "@/components/icons";
import { sentimentColumns } from "@/components/ui/sentimentColumns";
import { type SentimentColumn } from "@/types/sentimentColums";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { handleExport } from "@/utils/exportFile";

export default function DashboardPage() {
  const location = useLocation();

  const apiResponse: any[] = useMemo(
    () => location.state?.apiResponse?.results || [],
    [location.state]
  );

  const [sentimentColumnsData, setSentimentColumnsData] = useState<
    SentimentColumn[]
  >([]);

  async function fetchSentimentResultsForUser() {
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

      return res;
    } catch (err) {
      console.error("Error fetching user data:", err);
      return null;
    }
  }

  // Function to fetch all sentiment results for the user from DB
  const loadData = async () => {
    try {
      let rawData: any[] = [];

      if (apiResponse && apiResponse.length > 0) {
        console.log("Using passed API response (guest or user session)");
        rawData = apiResponse;
      } else {
        const responseData = await fetchSentimentResultsForUser();
        if (responseData?.results?.length > 0) {
          rawData = responseData.results;
          console.log(">>> Loaded sentiment results from DB.");
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

      const columnsData: SentimentColumn[] = rawData.map((item: any) => ({
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

  const noCase =
    "<b>No results yet!</b><br> Upload a file or paste text in the 'File Upload' tab to see sentiment analysis results here</br > ";

  return (
    <>
      <div className="mx-3 py-5 flex justify-between">
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
            className="outline text-teal-600 hover:bg-teal-600 hover:text-white ml-4"
          >
            <icons.loop className="mr-2" />
            Retrain Model
          </Button>
        </div>
      </div>

      <div>
        <DataTable
          columns={sentimentColumns}
          data={sentimentColumnsData}
          noCase={noCase}
          itemsPerPage={3}
        />
      </div>
    </>
  );
}
