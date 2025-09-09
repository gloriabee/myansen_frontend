import { DataTable } from "@/components/DataTable";
import { useLocation } from "react-router-dom";
import { sentimentColumns } from "@/components/sentimentColumns";
import { type SentimentColumn } from "@/types/sentimentColums";
import { Button } from "@/components/ui/button";
import { icons } from "@/components/icons";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const location = useLocation();
  const { sentimentResult } = location.state || {};
  const [sentimentData, setSentimentData] = useState<SentimentColumn[]>([]);

  useEffect(() => {
    if (sentimentResult) {
      const newEntry: SentimentColumn = {
        text: sentimentResult.text,
        sentiment: sentimentResult.predicted_label.toLowerCase(),
        confidence: sentimentResult.predicted_confidence ?? 0,
      };

      // Prevent duplication (only add if it's not already in the list)
      setSentimentData((prev) => {
        const exists = prev.some(
          (item) =>
            item.text === newEntry.text &&
            item.sentiment === newEntry.sentiment &&
            item.confidence === newEntry.confidence
        );
        if (exists) {
          return prev;
        }
        return [newEntry, ...prev];
      });
    }
  }, [sentimentResult]);

  const noCase =
    "<b>No results yet!</b><br> Upload a file or paste text in the 'File Upload' tab to see sentiment analysis results here</br>";

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
      <DataTable
        columns={sentimentColumns}
        data={sentimentData}
        noCase={noCase}
        itemsPerPage={3}
      />
    </>
  );
}
