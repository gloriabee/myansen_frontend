export type PreSignPutObjResponse = {
    url: string,
    key: string,
    bucket: string,
}

export type MakeDataSet = {
    text: string;
    feedback:  "positive" | "neutral" | "negative";
    
}

export type TriggerModelRequest = {
    key : string;
    bucket: string;
}