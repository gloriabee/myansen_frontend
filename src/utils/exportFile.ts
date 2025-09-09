interface ExportRow {
  text: string;
  sentiment: string;
  confidence: number;
}
export const handleExportCSV = (data: ExportRow[]) => {
  const csvHeader = ["Text", "Sentiment", "Confidence(%)"];
  const csvRows = data.map((item) => {
    const confidence = Math.round(item.confidence * 100);
    return [item.text, item.sentiment, confidence.toString()];
  });

  const csvContent = [csvHeader, ...csvRows]
    .map((row) =>
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `sentiment_results_${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleExportExcel = async (data: ExportRow[]) => {
  const XLSX = await import("xlsx");

  const worksheetData = data.map((item) => ({
    Text: item.text,
    Sentiment: item.sentiment,
    "Confidence(%)": Math.round(item.confidence * 100),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sentiment Results");
  XLSX.writeFile(
    workbook,
    `sentiment_results_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};
