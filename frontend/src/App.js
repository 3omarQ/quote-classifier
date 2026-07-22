import "./App.css";
import QuoteInput from "./Components/QuoteInput";
import ProcessingStep from "./Components/ProcessingStep";
import { useState } from "react";
import Results from "./Components/Results";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([
    { label: "Cleaned Quote", text: "" },
    { label: "Without Stopwords", text: "" },
    { label: "Normalized", text: "" },
  ]);
  const [classificationResults, setClassificationResults] = useState([]);

  const setAllProcessingSteps = (data) => {
    setProcessingSteps([
      { label: "Cleaned Quote", text: data.cleaned_quote || "Processing.." },
      {
        label: "Without Stopwords",
        text: data.without_stopwords || "Processing..",
      },
      { label: "Normalized", text: data.normalized || "Processing.." },
    ]);
  };

  const emptyProcessingSteps = () => {
    setProcessingSteps([
      { label: "Cleaned Quote", text: "" },
      { label: "Without Stopwords", text: "" },
      { label: "Normalized", text: "" },
    ]);
  };

  const emptyClassificationResults = () => {
    setClassificationResults([
      { category: "Processing..", probability: "" },
      { category: "Processing..", probability: "" },
      { category: "Processing..", probability: "" },
      { category: "Processing..", probability: "" },
      { category: "Processing..", probability: "" },
    ]);
  };

  const handleQuoteSubmit = async (quote) => {
    setIsProcessing(true);
    emptyProcessingSteps();
    emptyClassificationResults();
    setProcessingSteps([
      { label: "Cleaned Quote", text: "Processing.." },
      { label: "Without Stopwords", text: "Processing.." },
      { label: "Normalized", text: "Processing.." },
    ]);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quote }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from the backend");
      }

      const data = await response.json();

      console.log(data);

      setAllProcessingSteps(data);

      setClassificationResults(
        data.all_probabilities.map((item) => ({
          category: item.category,
          probability: item.probability,
        })),
      );

      setIsProcessing(false);
    } catch (error) {
      console.error("Error submitting the quote:", error);
      toast.error("Error processing the quote. Please try again.");
      setIsProcessing(false);
    } finally {
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-fit bg-gray-50 p-4 gap-4">
      <ToastContainer className="self-center" />
      <div className="flex-col w-full md:w-1/2">
        <QuoteInput
          onQuoteSubmit={handleQuoteSubmit}
          isProcessing={isProcessing}
        ></QuoteInput>
        <ProcessingStep steps={processingSteps}></ProcessingStep>
      </div>

      <div className="flex-col w-full md:w-1/2">
        <Results results={classificationResults}></Results>
      </div>
    </div>
  );
}

export default App;
