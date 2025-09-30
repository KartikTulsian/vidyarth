import React from 'react'

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>

        {/* Text */}
        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}

