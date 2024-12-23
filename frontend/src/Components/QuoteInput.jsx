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
    <div className='p-4 m-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 '>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="quote" className="">
            Enter your quote
          </label>
          <input
            id="quote"
            placeholder="Type your quote here..."
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button 
          type="submit" 
          className="w-full text-white bg-gray-800 disabled:bg-gray-400 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          disabled={isProcessing || !quote.trim()}
        >
          {isProcessing ? "Processing..." : "Analyze Quote"}
        </button>
      </form>
    </div>
  )
}

export default QuoteInput