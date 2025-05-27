import { Button } from "@/components/ui/button";

export default function TestMLOpsPage() {
    const handleClick = () => {
        console.log("Click!");
        
      fetch("http://localhost:8000/retrain", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({message: "Retraining the model with feedback data on progress."}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Model retraining response:", data);
        })
        .catch(error => {
            console.error("Error retraining model:", error);
        });
      
        
    }
    return (
      <div className="flex flex-col justify-center justify-items-center m-6">
        <h1 className="text-4xl font-bold m-2">Test MLOps</h1>
        <p>This page is for testing MLOps functionality.</p>
        <div className="m-8">
          <Button onClick={handleClick}>Retrain Model</Button>
        </div>
      </div>
    );
    
}