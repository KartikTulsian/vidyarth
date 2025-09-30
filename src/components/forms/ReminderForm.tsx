"use client";

import React, { Dispatch, useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { reminderSchema, ReminderSchema } from "@/lib/formValidationSchema";
import { createReminder, updateReminder } from "@/lib/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericData = any;

type Props = {
    type: "create" | "update";
    data?: ReminderSchema;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
    relatedData?: GenericData;
};

export default function ReminderForm({ type, data, setOpen }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ReminderSchema>({
        resolver: zodResolver(reminderSchema),
        defaultValues: {
            reminder_id: data?.reminder_id || undefined,
            trade_id: data?.trade_id || "",
            title: data?.title || "",
            message: data?.message || "",
            due_date: data?.due_date
                ? new Date(data.due_date).toISOString().split("T")[0]
                : "",
            type: data?.type || "CUSTOM",
            is_sent: data?.is_sent || false,
            is_dismissed: data?.is_dismissed || false,
        },
    });

    const [state, formAction] = useActionState(
        type === "create" ? createReminder : updateReminder,
        { success: false, error: false }
    );

    const [isPending, startTransition] = useTransition();
    const [hasShownToast, setHasShownToast] = useState(false);

    const onSubmit = handleSubmit((formData) => {
        const payload = {
            ...formData,
        };

        setHasShownToast(false);
        startTransition(() => {
            formAction(payload);
        });
    });

    useEffect(() => {
        if (state.success && !hasShownToast) {
            toast.success(`Reminder ${type === "create" ? "created" : "updated"} successfully!`);
            setHasShownToast(true);
            if (type === "create") reset();
            setOpen(false);
        }

        if (state.error && !hasShownToast) {
            toast.error(typeof state.error === "string" ? state.error : "Something went wrong!");
        }
    }, [state, type, reset, setOpen, hasShownToast]);


    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-md max-w-3xl mx-auto"
        >
            {/* Title */}
            <InputField
                label="Title"
                name="title"
                register={register}
                placeholder="Reminder Title"
                error={errors.title}
            />

            {/* Message */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Message *</label>
                <textarea
                    {...register("message")}
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                    rows={4}
                    placeholder="Reminder message"
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            {/* Due Date */}
            <InputField
                label="Due Date"
                name="due_date"
                type="date"
                register={register}
                error={errors.due_date}
            />

            {/* Type */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Type *</label>
                <select
                    {...register("type")}
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                >
                    {["RETURN_DUE", "PICKUP_DUE", "OFFER_EXPIRY", "PAYMENT_DUE", "CUSTOM"].map((t) => (
                        <option key={t} value={t}>
                            {t.replace("_", " ")}
                        </option>
                    ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

            {/* Trade ID (optional) */}
            <InputField
                label="Related Trade ID"
                name="trade_id"
                register={register}
                placeholder="Optional trade ID"
                error={errors.trade_id}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 p-2 border rounded bg-gray-200 hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 p-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {type === "create" ? "Create Reminder" : "Update Reminder"}
                </button>
            </div>
        </form>
    );
}
