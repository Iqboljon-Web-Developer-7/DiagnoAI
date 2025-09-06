import React from 'react'

const loading = () => {
  return (
    <div className='min-h-screen flex flex-col space-y-8 bg-slate-50'>
      <div className='w-full h-64 bg-gray-200 animate-pulse mt-28'></div>
      <div className='flex flex-col items-center space-y-4'>
        <div className='h-8 w-48 bg-gray-200 animate-pulse rounded'></div>
        <div className='h-4 w-96 bg-gray-200 animate-pulse rounded'></div>
      </div>
    </div>
  )
}

export default loading