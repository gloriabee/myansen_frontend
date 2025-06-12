import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { icons } from "@/components/icons";
import { sentimentColumns } from "@/components/sentimentColumns";
import { type SentimentColumn } from "@/types/sentimentColums";

import { useState } from "react";



export default function DashboardPage() { 

    // Mock data for sentiment analysis
    const sentimentData: SentimentColumn[] = [
      {
        text: "ဒီ မျက်နှာသစ်ဆေးသုံးပီးထဲကမျက်နှာက ကြည်ပီး glow လာတာ တော်တော် အဆင်ပြေပီး ဈေးလဲ တော်တယ်ဈေးလဲ တော်တယ်",
        sentiment: "positive",
        confidence: 0.95,
      },
      {
        text: "ဒီခေါင်းလျှော်ရည်လေး ဘယ်မှာဝယ်လို့ရမလဲရှင့် ညွှန်းပေးပါအုံး",
        sentiment: "neutral",
        confidence: 0.45,
      },
      {
        text: "I hate waiting for updates.",
        sentiment: "negative",
        confidence: 0.85,
      },
      {
        text: "ဒီ ဈေးလဲ တော်တယ်ဈေးလဲ တော်တယ်",
        sentiment: "positive",
        confidence: 0.95,
      },
      {
        text: " ဘယ်မှာဝယ်လို့ရမလဲရှင့် ညွှန်းပေးပါအုံး",
        sentiment: "neutral",
        confidence: 0.45,
      },
      {
        text: "I hate waiting for updates.",
        sentiment: "negative",
        confidence: 0.85,
      },
      {
        text: " ဘယ်မှာဝယ်လို့ရမလဲရှင့် ညွှန်းပေးပါအုံး",
        sentiment: "neutral",
        confidence: 0.45,
      },
      {
        text: "I hate waiting for updates.",
        sentiment: "negative",
        confidence: 0.85,
      },
      {
        text: " ဘယ်မှာဝယ်လို့ရမလဲရှင့် ညွှန်းပေးပါအုံး",
        sentiment: "neutral",
        confidence: 0.45,
      },
      {
        text: "I hate waiting for updates.",
        sentiment: "negative",
        confidence: 0.85,
      },
      {
        text: " ဘယ်မှာဝယ်လို့ရမလဲရှင့် ညွှန်းပေးပါအုံး",
        sentiment: "neutral",
        confidence: 0.45,
      },
      {
        text: "I hate waiting for updates.",
        sentiment: "negative",
        confidence: 0.85,
      },
      {
        text: " ဘယ်မှာဝယ်လို့ရမလဲရှင့် ညွှန်းပေးပါအုံး",
        sentiment: "neutral",
        confidence: 0.45,
      },
      {
        text: "I hate waiting for updates.",
        sentiment: "negative",
        confidence: 0.85,
      },
      {
        text: " ဘယ်မှာဝယ်လို့ရမလဲရှင့် ညွှန်းပေးပါအုံး",
        sentiment: "neutral",
        confidence: 0.45,
      },
      {
        text: "I hate waiting for updates.",
        sentiment: "negative",
        confidence: 0.85,
      },
      {
        text: " ဘယ်မှာဝယ်လို့ရမလဲရှင့် ညွှန်းပေးပါအုံး",
        sentiment: "neutral",
        confidence: 0.45,
      },
      {
        text: "I hate waiting for updates.",
        sentiment: "negative",
        confidence: 0.85,
      },
      {
        text: " ဘယ်မှာဝယ်လို့ရမလဲရှင့် ညွှန်းပေးပါအုံး",
        sentiment: "neutral",
        confidence: 0.45,
      },
      {
        text: "I hate waiting for updates.",
        sentiment: "negative",
        confidence: 0.85,
      },
    ];


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
            data={sentimentData}
            noCase={noCase}
            itemsPerPage={3}
          />
        </div>
      </>
    );
}