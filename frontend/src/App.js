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
  const [classificationResults, setClassificationResults] = useState([
    { class: "Technology", probability: 0 },
    { class: "Science", probability: 0 },
    { class: "Philosophy", probability: 0 },
    { class: "Art", probability: 0 },
  ]);

  const handleQuoteSubmit = async (quote) => {
    setIsProcessing(true);
    try {
      // Here you would make the actual API calls to your Python backend
      // For now, we'll simulate the processing with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate processing steps
      setProcessingSteps([
        { label: "Cleaned Quote", text: quote.toLowerCase() },
        { label: "Without Stopwords", text: quote.split(" ").filter(word => word.length > 3).join(" ") },
        { label: "Lemmatized", text: quote.split(" ").map(word => word.replace(/ing$/, "")).join(" ") },
      ]);
      // Simulate classification results
      setClassificationResults([
        { class: "Technology", probability: Math.random() },
        { class: "Science", probability: Math.random() },
        { class: "Philosophy", probability: Math.random() },
        { class: "Art", probability: Math.random() },
      ]);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="flex h-screen items-center">
      <div className='flex-col h-screen w-1/2 bg-gray-50 '>
        <QuoteInput onQuoteSubmit={handleQuoteSubmit} isProcessing={isProcessing}></QuoteInput>
        <ProcessingStep steps={processingSteps}></ProcessingStep>
      </div>

      <div className='flex-col h-screen w-1/2'>
        <Results results={classificationResults}></Results>
      </div>
    </div>
  );
}

export default App;
