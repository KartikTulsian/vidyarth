"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import {
    Dispatch,
    SetStateAction,
    useActionState,
    useEffect,
    useState,
    useTransition,
} from "react";
import { userProfileSchoolSchema, UserProfileSchoolSchema } from "@/lib/formValidationSchema";
import { createUserWithProfileSchool, updateUserWithProfileSchool } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import { SchoolCollege } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericData = any;

type CloudinaryImageInfo = {
    secure_url: string;
    [key: string]: GenericData;
} | null;

interface CloudinaryWidget {
    close: () => void;
    // Add other methods if used, but 'close' is the essential one here
    [key: string]: GenericData;
}

const UserForm = ({
    type,
    data,
    setOpen,
}: {
    type: "create" | "update";
    data?: GenericData;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: GenericData;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger,
        clearErrors
    } = useForm<UserProfileSchoolSchema>({
        resolver: zodResolver(userProfileSchoolSchema) as Resolver<UserProfileSchoolSchema>,
        defaultValues: {
            user: {
                password: "",
                clerk_id: data?.user?.clerk_id || "", // <-- Populate clerk_id here
                email: data?.user?.email || "",
                username: "",
                is_active: true,
            },
            profile: {
                full_name: "",
                display_name: "",
                gender: "",
                phone: "",
                school_college_id: "",
                class_year: "",
                course: "",
                department: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
                country: "India",
                avatar_url: "",
                bio: "",
            },
        },
    });

    const [currentStep, setCurrentStep] = useState<'user' | 'profile'>('user');
    const [isPending, startTransition] = useTransition();
    const [colleges, setColleges] = useState<SchoolCollege[]>([]);
    const [loadingLocation, setLoadingLocation] = useState(false);
    // const [usingLocation, setUsingLocation] = useState(false);
    const [img, setImg] = useState<CloudinaryImageInfo>(
        data?.profile?.avatar_url ? { secure_url: data.profile.avatar_url } : null
    );

    const [state, formAction] = useActionState(
        type === "create" ? createUserWithProfileSchool : updateUserWithProfileSchool,
        {
            success: false,
            error: false,
        }
    );

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
                setValue("profile.latitude", latitude);
                setValue("profile.longitude", longitude);
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

    const handleNextStep = async () => {

        const fieldsToValidate = ["user.email", "user.username"]
        // const fieldsToValidate = ["profile.full_name", "profile.gender", "profile.course", "profile.department"];

        if (type === "create") {
            fieldsToValidate.push("user.password");
        }

        const isUserValid = await trigger(fieldsToValidate as (keyof UserProfileSchoolSchema)[]);

        if (isUserValid) {
            setCurrentStep('profile');
        } else {
            toast.error("Please fill in all required fields");
        }
    };

    const handlePrevStep = () => {
        setCurrentStep('user');
    };

    const router = useRouter();

    // 🔹 Reset form when editing existing user
    useEffect(() => {
        if (data) {
            reset({
                user: {
                    user_id: data.user?.user_id || "",
                    password: data.user?.password || "",
                    clerk_id: data.user?.clerk_id || "",
                    email: data.user?.email || "",
                    username: data.user?.username || "",
                    is_active: data.user?.is_active ?? true,
                },
                profile: {
                    profile_id: data.profile?.profile_id || "",
                    full_name: data.profile?.full_name || "",
                    display_name: data.profile?.display_name || "",
                    gender: data.profile?.gender || "",
                    phone: data.profile?.phone || "",
                    school_college_id: data.profile?.school_college_id || "",
                    class_year: data.profile?.class_year || "",
                    course: data.profile?.course || "",
                    department: data.profile?.department || "",
                    address: data.profile?.address || "",
                    city: data.profile?.city || "",
                    state: data.profile?.state || "",
                    pincode: data.profile?.pincode || "",
                    country: data.profile?.country || "India",
                    avatar_url: data.profile?.avatar_url || "",
                    bio: data.profile?.bio || "",

                }
            });
            setImg(
                data.profile?.avatar_url ? { secure_url: data.profile?.avatar_url } : null
            );
        }
    }, [data, reset]);



    const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

    const onSubmit = handleSubmit((formData) => {
        const payload = {
            ...formData,
            profile: {
                ...formData.profile,
                avatar_url: img?.secure_url || data.profile?.avatar_url,
            },

            ...(type === "update" && data?.user?.user_id && { user_id: data.user.user_id }),
            ...(type === "update" && data?.profile?.profile_id && { profile_id: data.profile.profile_id }),
        };

        setHasShownSuccessToast(false);

        startTransition(() => {
            formAction(payload);
        })
    });

    useEffect(() => {
        if (state.success && !hasShownSuccessToast) {
            toast(`User has been ${type === "create" ? "created" : "updated"}!`);
            setHasShownSuccessToast(true);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, type, setOpen, hasShownSuccessToast]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new User" : "Update User Profile"}
            </h1>

            {/* Step 1: User Info */}
            {currentStep === 'user' && (
                <>
                    <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
                    <div className="flex flex-wrap gap-4">
                        <InputField label="Email" name="user.email" type="email" register={register} error={errors.user?.email} readOnly />
                        <InputField label="Username" name="user.username" register={register} error={errors.user?.username} />
                        {type === "create" && (
                            <InputField label="Password" name="user.password" type="password" register={register} error={errors.user?.password} />
                        )}
                        {type === "update" && (
                            <>
                                <InputField label="Password" name="user.password" type="text" register={register} error={errors.user?.password} readOnly />
                                <InputField label="User ID" name="user.user_id" register={register} readOnly />
                                <InputField label="Clerk ID" name="user.clerk_id" register={register} readOnly />
                            </>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 mt-4"
                    >
                        Next: Personal Information
                    </button>
                </>
            )}

            {/* Step 2: Profile Info */}
            {currentStep === 'profile' && (
                <>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-medium">Personal Information</span>
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            className="text-indigo-600 text-sm hover:underline"
                        >
                            ← Back
                        </button>
                    </div>

                    <CldUploadWidget
                        uploadPreset="vidyarth"
                        onSuccess={(result: GenericData, { widget }: { widget: CloudinaryWidget }) => {
                            if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                                setImg(result.info as CloudinaryImageInfo);
                                setValue("profile.avatar_url", result.info.secure_url);
                                clearErrors("profile.avatar_url");
                                widget.close();
                            } else {
                                toast.error("Image upload failed or returned an invalid response.");
                            }
                        }}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 w-fit"
                            >
                                <UploadCloud size={18} /> Upload Profile Picture
                            </button>
                        )}
                    </CldUploadWidget>

                    {(img?.secure_url || data?.profile?.avatar_url) && (
                        <div className="relative w-fit mt-2">
                            <Image
                                src={img?.secure_url || data?.profile?.avatar_url}
                                alt="Profile Avatar"
                                width={140}
                                height={140}
                                className="rounded-md object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImg(null);
                                    setValue("profile.avatar_url", "");
                                }}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                            >
                                ❌
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4">
                        <InputField label="Full Name" name="profile.full_name" register={register} error={errors.profile?.full_name} />
                        <InputField label="Display Name" name="profile.display_name" register={register} error={errors.profile?.display_name} />
                        <InputField label="Phone Number" name="profile.phone" register={register} error={errors.profile?.phone} />
                        <InputField label="Gender" name="profile.gender" register={register} error={errors.profile?.gender} />
                        <InputField label="Course" name="profile.course" register={register} error={errors.profile?.course} />
                        <InputField label="Department" name="profile.department" register={register} error={errors.profile?.department} />
                        <InputField label="Class Year" name="profile.class_year" register={register} error={errors.profile?.class_year} />
                        <InputField label="Bio" name="profile.bio" register={register} error={errors.profile?.bio} />
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                        <h3 className="w-full text-sm font-semibold text-gray-700">Address Information</h3>
                        <InputField label="Address" name="profile.address" register={register} error={errors.profile?.address} />
                        <InputField label="City" name="profile.city" register={register} error={errors.profile?.city} />
                        <InputField label="State" name="profile.state" register={register} error={errors.profile?.state} />
                        <InputField label="Pincode" name="profile.pincode" register={register} error={errors.profile?.pincode} />
                        <InputField label="Country" name="profile.country" register={register} error={errors.profile?.country} />
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 items-end">
                        <h3 className="w-full text-sm font-semibold text-gray-700">Location</h3>
                        <InputField label="Latitude" name="profile.latitude" register={register} error={errors.profile?.latitude} readOnly />
                        <InputField label="Longitude" name="profile.longitude" register={register} error={errors.profile?.longitude} readOnly />
                        <button
                            type="button"
                            onClick={detectLocation}
                            disabled={loadingLocation}
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loadingLocation ? "Detecting..." : "Detect Location"}
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-1/2">
                        <label htmlFor="schoolCollegeId" className="text-xs text-gray-500">
                            Select School/College (Optional)
                        </label>
                        <select
                            id="schoolCollegeId"
                            {...register("profile.school_college_id")}
                            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full text-black"
                        >
                            <option value="">-- Select an Institution --</option>
                            {colleges.map(college => (
                                <option key={college.school_college_id} value={college.school_college_id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                        {errors.profile?.school_college_id && <p className="text-red-500 text-sm mt-1">{errors.profile.school_college_id.message}</p>}
                    </div>

                    {state.error && (
                        <span className="text-red-500">Something went wrong! {typeof state.error === 'string' && state.error}</span>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
                    >
                        {isPending ? "Submitting..." : (type === "create" ? "Create User" : "Update User")}
                    </button>
                </>
            )}
        </form>
    );
};

export default UserForm;
