import React from 'react'
import { useNavigate } from 'react-router-dom';

const Ready = () => {
  const navigate = useNavigate();
  return (
    <div className='py-28 bg-primary_yellow text-white flex flex-col justify-center items-center'>
<h1 className='text-5xl font-semibold py-2'>Ready to Optimize Your Solar Workflow?</h1>
<h2 className='text-xl opacity-85 pb-2'>Start using our AI-powered assistant today to streamline your solar hot water system sales process.</h2>
<div className='flex gap-4'>
    <button onClick={() => navigate('/system-advisor')} className='bg-orange-500 px-5 py-3 hover:opacity-90  rounded-xl'>Start Triaging</button>
    <button onClick={() => navigate('/system-sizing')} className='bg-orange-500 px-5 py-3 hover:opacity-90  rounded-xl'>Try System Sizing</button>

</div>

    </div>
  )
}

export default Ready