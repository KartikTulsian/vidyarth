"use client";

import { createTrade, updateTrade } from "@/lib/actions";
import { tradeSchema, TradeSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { Dispatch, useActionState, useEffect, useTransition, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "@/components/InputField";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericData = any;

export default function TradeForm({
  type,
  data,
  setOpen,
}: {
  type: "create" | "update";
  data?: GenericData;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  relatedData?: GenericData;
  id?: string;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TradeSchema>({
    resolver: zodResolver(tradeSchema) as Resolver<TradeSchema>,
    defaultValues: {
      trade_id: data?.trade_id || undefined,
      offer_id: data?.offer_id,
      borrower_id: data?.borrower_id,
      lender_id: data?.lender_id,
      start_date: '',
      end_date: '',
      actual_return_date: data?.actual_return_date ? new Date(data.actual_return_date).toISOString().split('T')[0] : '',
      agreed_price: data?.agreed_price || undefined,
      security_deposit: data?.security_deposit || undefined,
      late_fee: data?.late_fee || undefined,
      borrower_notes: data?.borrower_notes || '',
      lender_notes: data?.lender_notes || '',
      status: data?.status || "PENDING",
      pickup_code: data?.pickup_code || undefined,
      return_code: data?.return_code || undefined,
      borrower_rating: data?.borrower_rating || undefined,
      lender_rating: data?.lender_rating || undefined,
      created_at: data?.created_at || undefined,
      updated_at: data?.updated_at || undefined,
    },
  });

  const [state, formAction] = useActionState(
    type === "create" ? createTrade : updateTrade,
    { success: false, error: false }
  );

  const [isPending, startTransition] = useTransition();
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  // Prefill required hidden IDs from props/data
  useEffect(() => {
    setValue("offer_id", data.offer_id);
    setValue("lender_id", data.lender_id);
    setValue("borrower_id", data.borrower_id);
  }, [data, setValue]);

  const onSubmit = handleSubmit((formData) => {
    const payload = {
      ...formData,
    };

    setHasShownSuccessToast(false);
    startTransition(() => {
      formAction(payload);
      
    });
  });

  useEffect(() => {
    if (state.success && !hasShownSuccessToast) {
      toast.success(`Trade has been ${type === "create" ? "created" : "updated"} successfully!`);
      setHasShownSuccessToast(true);
      if (type === "create") reset();
      setOpen(false);
      router.refresh();
    }
    if (state.error && !hasShownSuccessToast) {
      toast.error(typeof state.error === "string" ? state.error : "Something went wrong!");
    }
  }, [state, router, setOpen, type, reset, hasShownSuccessToast]);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {type === "create" ? "Create Trade" : "Update Trade"}
        </h1>
      </div>

      {/* Hidden IDs (readonly shown) */}
      <div className="flex flex-row flex-wrap gap-4">
        <InputField
          label="Offer ID"
          name="offer_id"
          register={register}
          defaultValue={data?.offer_id}
          error={errors.offer_id}
          readOnly
        />
        <InputField
          label="Lender ID"
          name="lender_id"
          register={register}
          defaultValue={data?.lender_id}
          error={errors.lender_id}
          readOnly
        />
        <InputField
          label="Borrower ID"
          name="borrower_id"
          register={register}
          defaultValue={data?.borrower_id}
          error={errors.borrower_id}
          readOnly
        />
      </div>

      {/* Dates */}
      <div className="flex flex-row flex-wrap gap-4">
        <InputField
          label="Start Date"
          name="start_date"
          type="date"
          register={register}
          defaultValue={data?.start_date}
          error={errors.start_date}
        />
        <InputField
          label="End Date"
          name="end_date"
          type="date"
          register={register}
          defaultValue={data?.end_date}
          error={errors.end_date}
        />
        <InputField
          label="Actual Return Date"
          name="actual_return_date"
          type="date"
          register={register}
          defaultValue={data?.actual_return_date}
          error={errors.actual_return_date}
        />
      </div>

      {/* Prices */}
      <div className="flex flex-row flex-wrap gap-4">
        <InputField
          label="Agreed Price"
          name="agreed_price"
          type="number"
          register={register}
          defaultValue={data?.agreed_price}
          error={errors.agreed_price}
          placeholder="Enter agreed price"
        />
        <InputField
          label="Security Deposit"
          name="security_deposit"
          type="number"
          register={register}
          defaultValue={data?.security_deposit}
          error={errors.security_deposit}
          placeholder="Enter security deposit"
        />
        <InputField
          label="Late Fee"
          name="late_fee"
          type="number"
          register={register}
          defaultValue={data?.late_fee}
          error={errors.late_fee}
          placeholder="Enter late fee (if any)"
        />
      </div>

      {/* Notes */}
      <div className="flex flex-row flex-wrap gap-4">
        <InputField
          label="Borrower Notes"
          name="borrower_notes"
          type="text"
          register={register}
          defaultValue={data?.borrower_notes}
          error={errors.borrower_notes}
          placeholder="Optional notes from borrower"
        />
        <InputField
          label="Lender Notes"
          name="lender_notes"
          type="text"
          register={register}
          defaultValue={data?.lender_notes}
          error={errors.lender_notes}
          placeholder="Optional notes from lender"
        />
      </div>

      {/* Codes */}
      <div className="flex flex-row flex-wrap gap-4">
        <InputField
          label="Pickup Code"
          name="pickup_code"
          register={register}
          defaultValue={data?.pickup_code}
          error={errors.pickup_code}
          placeholder="Pickup verification code"
        />
        <InputField
          label="Return Code"
          name="return_code"
          register={register}
          defaultValue={data?.return_code}
          error={errors.return_code}
          placeholder="Return verification code"
        />
      </div>

      {/* Ratings */}
      <div className="flex flex-row flex-wrap gap-4">
        <InputField
          label="Borrower Rating"
          name="borrower_rating"
          type="number"
          register={register}
          defaultValue={data?.borrower_rating}
          error={errors.borrower_rating}
          placeholder="1-5"
        />
        <InputField
          label="Lender Rating"
          name="lender_rating"
          type="number"
          register={register}
          defaultValue={data?.lender_rating}
          error={errors.lender_rating}
          placeholder="1-5"
        />
      </div>

      {/* Status Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select
          {...register("status")}
          defaultValue={data?.status || "PENDING"}
          className="p-2 border rounded-md text-sm"
        >
          <option value="PENDING">PENDING</option>
          <option value="ACCEPTED">ACCEPTED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="OVERDUE">OVERDUE</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : type === "create" ? "Submit Trade" : "Update Trade"}
        </button>
      </div>
    </form>
  );
}
