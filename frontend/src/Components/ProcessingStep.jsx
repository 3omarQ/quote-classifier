import React from 'react'

function ProcessingStep({ steps }) {
  return (
    <div className='p-4 m-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 space-y-6'>
        {steps.map((step,index)=>(
    
            <div className='p-4'>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {step.label}
                </h3>
                <p className="text-sm">{step.text || "Waiting for input..."}</p>
            </div>
    
        ))}

    </div>
  )
}

export default ProcessingStep