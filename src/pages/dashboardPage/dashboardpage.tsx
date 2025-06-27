import { DataTable } from "@/components/DataTable";

import { icons } from "@/components/icons";
import { sentimentColumns } from "@/components/ui/sentimentColumns";
import { type SentimentColumn } from "@/types/sentimentColums";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const apiResponse: any[] = useMemo(
    () => location.state?.apiResponse?.results || [],
    [location.state]
  );
  // Use state to manage the data displayed in the dashboard
  const [sentimentColumnsData, setSentimentColumnsData] = useState<
    SentimentColumn[]
  >([]);

  async function fetchSentimentResultsForUser() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.log("No access token found. Redirecting to login.");
      navigate("/login");
      throw new Error("Authentication required.");
    }

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
      navigate("/login");
      throw new Error(
        "Unauthorized: Access token expired or invalid. Redirecting to login."
      );
    }

    return res;
  }

  //Loading data
  const loadData = async () => {
    try {
      let rawData: any[] = [];

      if (apiResponse && apiResponse.length > 0) {
        // If data was passed via navigation state, use it directly
        rawData = apiResponse;
        console.log("Using initial API response from navigation state.");
        console.log("====Raw Data:", rawData);
        const columnsData: SentimentColumn[] = rawData.map((item: any) => ({
          text: item.text,
          sentiment: item.predicted_label.toString().toLowerCase(),
          confidence: item.confidence,
          feedback: item.predicted_label.toString().toLowerCase()
            ? { type: item.predicted_label.toString().toLowerCase() }
            : { type: "neutral" },
        }));
        setSentimentColumnsData(columnsData);
      } else {
        // fetch data from the backend (database)
        console.log("Fetching sentiment results from API...");
        const response = await fetchSentimentResultsForUser();
        const data = await response.json();
        rawData = data.results;
        console.log("====Raw Data:", rawData);
        const columnsData: SentimentColumn[] = rawData.map((item: any) => ({
          text: item.text,
          sentiment: item.sentiment,
          confidence: item.confidence,
          feedback: item.sentiment
            ? { type: item.sentiment }
            : { type: "neutral" },
        }));
        setSentimentColumnsData(columnsData);
      }
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
          <Button className="bg-teal-700 text-white hover:bg-teal-600">
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
