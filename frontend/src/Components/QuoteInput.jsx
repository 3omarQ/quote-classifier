import React from 'react';
import { useState } from "react";



function QuoteInput({ onQuoteSubmit, isProcessing }) {
  const [quote, setQuote] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (quote.trim()) {
      onQuoteSubmit(quote);
    }
  };
  return (
    <div className='p-4 m-4 bg-white border border-gray-200 shadow-md p-8 '>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="quote" className="text-lg">
            Enter your quote (in arabic)
          </label>
          <textarea
            id="quote"
            placeholder="Arabic quote.."
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full p-4 text-gray-900 border border-gray-300  bg-gray-50 text-lg"
          />
        </div>
        <button 
          type="submit" 
          className="w-full text-white bg-gray-800 disabled:bg-gray-400 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-black text-md px-5 py-2.5 me-2 mb-2"
          disabled={isProcessing || !quote.trim()}
        >
          {isProcessing ? "Processing..." : "Predict"}
        </button>
      </form>
    </div>
  )
}

export default QuoteInput