import React from 'react'

function ProcessingStep({ steps }) {
  return (
    <div className='m-4 bg-white border border-gray-200  shadow-md p-8 space-y-6  max-h-[500px] overflow-y-auto'>
        {steps.map((step,index)=>(
    
            <div className='p-4' key={index}>
                <h3 className=" text-gray-500 mb-2">
                    {step.label}
                </h3>
                <p className="text-lg break-words">{step.text || "Waiting for input..."}</p>
            </div>
    
        ))}

    </div>
  )
}

export default ProcessingStep