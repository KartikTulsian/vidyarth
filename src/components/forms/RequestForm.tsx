"use client";

import React, { Dispatch, useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { createRequest, updateRequest } from "@/lib/actions";
import { requestSchema, RequestSchema } from "@/lib/formValidationSchema";
import { SchoolCollege } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin } from "lucide-react"; // Assuming these are your icons
import InputField from "../InputField";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericData = any;

type Props = {
    type: "create" | "update";
    data?: RequestSchema;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
    relatedData?: GenericData;
};

export default function RequestForm({ type, data, setOpen }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm<RequestSchema>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            request_id: data?.request_id || undefined,
            user_id: data?.user_id || "",
            stuff_type: data?.stuff_type || "BOOK",
            description: data?.description || "",
            urgency_level: data?.urgency_level || "MEDIUM",
            search_radius_km: data?.search_radius_km || 10,
            status: data?.status || "OPEN",
            title: data?.title || "",
            subject: data?.subject || "",
            class_year: data?.class_year || "",
            needed_by_date: data?.needed_by_date
                ? new Date(data.needed_by_date).toISOString().split("T")[0]
                : "",
            rental_duration_days: data?.rental_duration_days || undefined,
            max_price: data?.max_price || undefined,
            max_rental_per_day: data?.max_rental_per_day || undefined,
            target_school_college_id: data?.target_school_college_id || "",
            location_latitude: data?.location_latitude || undefined,
            location_longitude: data?.location_longitude || undefined,
            created_at: data?.created_at || undefined,
            updated_at: data?.updated_at || undefined,
        },
    });

    const [state, formAction] = useActionState(
        type === "create" ? createRequest : updateRequest,
        { success: false, error: false }
    );
    const [isPending, startTransition] = useTransition();
    const [colleges, setColleges] = useState<SchoolCollege[]>([]);
    const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const router = useRouter();

    // Fetch colleges for dropdown
    useEffect(() => {
        fetch("/api/school-colleges")
            .then((res) => res.json())
            .then((data) => setColleges(data))
            .catch((err) => console.error(err));
    }, []);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported by your browser");
            return;
        }
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setValue("location_latitude", latitude);
                setValue("location_longitude", longitude);
                toast.success("Location detected!");
                setLoadingLocation(false);
            },
            (error) => {
                setLoadingLocation(false);
                let errorMessage = "Failed to fetch location";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied. Please enable it in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "The request to get user location timed out.";
                        break;
                }
                toast.error(errorMessage);
                console.error("Geolocation error:", error);
            }
        );
    };

    // This is the correct useEffect with the 'data' dependency
    useEffect(() => {
        if (data) {
            reset({
                request_id: data.request_id || undefined,
                user_id: data.user_id || "",
                stuff_type: data.stuff_type || "BOOK",
                description: data.description || "",
                urgency_level: data.urgency_level || "MEDIUM",
                search_radius_km: data.search_radius_km || 10,
                status: data.status || "OPEN",
                title: data.title || "",
                subject: data.subject || "",
                class_year: data.class_year || "",
                needed_by_date: data.needed_by_date
                    ? new Date(data.needed_by_date).toISOString().split("T")[0]
                    : "",
                rental_duration_days: data.rental_duration_days || undefined,
                max_price: data.max_price || undefined,
                max_rental_per_day: data.max_rental_per_day || undefined,
                target_school_college_id: data.target_school_college_id || "",
                location_latitude: data.location_latitude || undefined,
                location_longitude: data.location_longitude || undefined,
                created_at: data.created_at || undefined,
                updated_at: data.updated_at || undefined,
                expires_at: data.expires_at || undefined,
            });
        }
    }, [data, reset]); // Add 'data' and 'reset' to the dependency array

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
            toast.success(`Request ${type === "create" ? "created" : "updated"} successfully!`);
            setHasShownSuccessToast(true);
            if (type === "create") reset();
            setOpen(false);
            router.refresh();
        }

        if (state.error && !hasShownSuccessToast) {
            toast.error(
                typeof state.error === 'string' ? state.error : "Something went wrong!"
            );
        }
    }, [state.success, state.error, hasShownSuccessToast, type, reset, router, setOpen]);

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-md max-w-3xl mx-auto"
        >
            {/* Stuff Type */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Stuff Type *</label>
                <select
                    {...register("stuff_type")}
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                >
                    {["BOOK", "STATIONERY", "ELECTRONICS", "NOTES", "OTHER"].map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                {errors.stuff_type && <p className="text-red-500 text-sm">{errors.stuff_type.message}</p>}
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
                <InputField
                    label="Title"
                    name="title"
                    register={register}
                    placeholder="Optional title"
                    error={errors.title}
                />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Description *</label>
                <textarea
                    {...register("description")}
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                    rows={4}
                    placeholder="Describe your request..."
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Subject & Class Year */}
            <div className="flex flex-row flex-wrap gap-4">
                <InputField
                    label="Subject"
                    name="subject"
                    register={register}
                    placeholder="Subject"
                    error={errors.subject}
                />

                <InputField
                    label="Class/Year"
                    name="class_year"
                    register={register}
                    placeholder="Class/Year"
                    error={errors.class_year}
                />
            </div>

            {/* Urgency Level & Needed By */}
            <div className="flex flex-col gap-4">
                <label className="font-medium text-gray-700">Urgency Level</label>
                <select {...register("urgency_level")} className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none">
                    {["LOW", "MEDIUM", "HIGH", "URGENT"].map((level) => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
                <InputField
                    label="Needed By Date"
                    name="needed_by_date"
                    type="date"
                    register={register}
                    placeholder="Requirement Data"
                />
            </div>

            {/* Rental Duration & Price */}
            <div className="flex flex-row flex-wrap gap-4">
                <InputField
                    label="Rental Duration (days)"
                    type="number"
                    name="rental_duration_days"
                    register={register}
                    inputProps={{ min: 1 }}
                />
                <InputField
                    label="Max Price"
                    type="number"
                    name="max_price"
                    register={register}
                    inputProps={{ min: 0 }}
                />
            </div>

            {/* Max Rental & Search Radius */}
            <div className="flex flex-row flex-wrap gap-4">
                <InputField
                    label="Max Rental Per Day"
                    type="number"
                    name="max_rental_per_day"
                    register={register}
                    inputProps={{ min: 0 }}
                />
                <InputField
                    label="Search Radius (km)"
                    type="number"
                    name="search_radius_km"
                    register={register}
                />
            </div>

            {/* Target College */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Target College</label>
                <select {...register("target_school_college_id")} className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none">
                    <option value="">-- Select College --</option>
                    {colleges.map((college) => (
                        <option key={college.school_college_id} value={college.school_college_id}>
                            {college.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Location */}
            <div className="flex flex-row flex-wrap gap-2">
                <label className="font-medium text-gray-700">Location Coordinates</label>
                <div className="flex gap-2 items-center">
                    <InputField label="Latitude" name="location_latitude" register={register} readOnly />
                    <InputField label="Longitude" name="location_longitude" register={register} readOnly />
                    <button
                        type="button"
                        onClick={detectLocation}
                        disabled={loadingLocation}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-medium"
                    >
                        {loadingLocation ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <MapPin size={16} />
                        )}
                        Use Current Location
                    </button>

                </div>
                <InputField label="User ID" name="user_id" register={register} readOnly />
            </div>

            {/* Submit & Cancel */}
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
                    {type === "create" ? "Create Request" : "Update Request"}
                </button>
            </div>
        </form>
    );
}