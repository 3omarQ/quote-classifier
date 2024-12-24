import React from 'react'


function Results({ results }) {
  return (
    <div className='p-4 m-4 bg-white border border-gray-200  shadow-md p-8 '>
        <h2 className="text-xl font-semibold mb-6">Classification Results (top 5 guesses)</h2>
        <div className="space-y-6">
        {results.map((result, index) => (
          <div key={index} className="space-y-2 fade-in">
            <div className="flex justify-between text-md">
              <span className="font-medium">{result.category}</span>
              <span className="text-muted-foreground">
                {(result.probability * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4 ">
            <div className="bg-gray-600 h-2  dark:bg-gray-300" style={{ width: `${result.probability*100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Results