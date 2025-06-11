export type SentimentColumn = {
    text: string;
    sentiment: "positive" | "neutral" | "negative";
    confidence: number;
    feedback?: {
        type: "positive" | "neutral" | "negative";
    };
}