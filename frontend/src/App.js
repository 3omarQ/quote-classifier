import "./App.css";
import QuoteInput from "./Components/QuoteInput";
import ProcessingStep from "./Components/ProcessingStep";
import { useState, useRef, useEffect } from "react";
import Results from "./Components/Results";
import Footer from "./Components/Footer";
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
  const [showColdStartMsg, setShowColdStartMsg] = useState(false);
  const processingRef = useRef(null);
  const resultsRef = useRef(null);

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

  // Pre-warm the backend on page load so Render's free tier wakes up
  useEffect(() => {
    fetch("https://quote-classifier-coft.onrender.com/", {
      method: "GET",
    }).catch(() => {});
  }, []);

  const handleQuoteSubmit = async (quote) => {
    setIsProcessing(true);
    setShowColdStartMsg(false);
    emptyProcessingSteps();
    emptyClassificationResults();
    setProcessingSteps([
      { label: "Cleaned Quote", text: "Processing.." },
      { label: "Without Stopwords", text: "Processing.." },
      { label: "Normalized", text: "Processing.." },
    ]);

    processingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    const coldStartTimer = setTimeout(() => setShowColdStartMsg(true), 3000);

    try {
      const response = await fetch(
        "https://quote-classifier-coft.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quote }),
        },
      );

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

      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setIsProcessing(false);
    } catch (error) {
      console.error("Error submitting the quote:", error);
      toast.error("Error processing the quote. Please try again.");
      setIsProcessing(false);
    } finally {
      clearTimeout(coldStartTimer);
      setShowColdStartMsg(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <ToastContainer />
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <QuoteInput
          onQuoteSubmit={handleQuoteSubmit}
          isProcessing={isProcessing}
        />

        {showColdStartMsg && (
          <p className="text-sm text-gray-500 -mt-4">
            First request can take up to 30s — this app runs on free hosting
            that sleeps when idle. Hang tight!
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div ref={processingRef} className="w-full md:w-1/2">
            <ProcessingStep steps={processingSteps} />
          </div>
          <div ref={resultsRef} className="w-full md:w-1/2">
            <Results results={classificationResults} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;
