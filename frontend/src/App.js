import './App.css';
import QuoteInput from './Components/QuoteInput';
import ProcessingStep from './Components/ProcessingStep'
import{useState} from "react";
import Results from './Components/Results';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([
    { label: "Cleaned Quote", text: "" },
    { label: "Without Stopwords", text: "" },
    { label: "Normalized", text: "" },
  ]);
  const [classificationResults, setClassificationResults] = useState([]);

  const handleQuoteSubmit = async (quote) => {
    setIsProcessing(true);
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

      console.log(data)
  
      setProcessingSteps([
        { label: "Cleaned Quote", text: data.cleaned_quote || "N/A" },
        { label: "Without Stopwords", text: data.without_stopwords || "N/A" },
        { label: "Normalized", text: data.normalized || "N/A" },
      ]);
  
      setClassificationResults(
        data.all_probabilities.map((item) => ({
          category: item.category,
          probability: item.probability,
        }))
      );
    } catch (error) {
      console.error("Error submitting the quote:", error);
      toast.error("Error processing the quote. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex h-full bg-gray-50">
      <div className='flex-col h-full w-1/2  '>
        <QuoteInput onQuoteSubmit={handleQuoteSubmit} isProcessing={isProcessing}></QuoteInput>
        <ProcessingStep steps={processingSteps}></ProcessingStep>
      </div>

      <div className='flex-col h-full w-1/2  '>
        <Results results={classificationResults}></Results>
      </div>
    </div>
  );
}

export default App;
