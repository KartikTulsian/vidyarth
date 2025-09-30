"use client";

import LendSellForm from '@/components/forms/LendSellForm';
import React from 'react'

export default function LendSellPage() {

  // if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-md m-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🎉 Create New Offer
      </h1>

      <LendSellForm
        type="create"
        setOpen={() => { }}
      />
    </div>
  )
}
