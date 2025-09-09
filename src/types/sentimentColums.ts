export type SentimentColumn = {
    id?: string;
    text: string;
    sentiment: "positive" | "neutral" | "negative";
    confidence: number;
    feedback?: {
        type: "positive" | "neutral" | "negative";
    };
}