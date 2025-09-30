import { Resolver, useForm } from "react-hook-form";
import {
    stuffOfferSchema,
    StuffOfferSchema,
} from "@/lib/formValidationSchema";
import { Dispatch, useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputField from "../InputField";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { createStuffWithOffer, updateStuffWithOffer } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ImageIcon, ArrowRight, ArrowLeft, Package, Loader2, MapPin, X } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericData = any;

export default function LendSellForm({
    type,
    data,
    setOpen,
}: {
    type: "create" | "update";
    data?: GenericData;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
    relatedData?: GenericData;
}) {
    const [currentStep, setCurrentStep] = useState<'stuff' | 'offer'>('stuff');
    const [loadingLocation, setLoadingLocation] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        trigger,
        clearErrors
    } = useForm<StuffOfferSchema>({
        resolver: zodResolver(stuffOfferSchema) as Resolver<StuffOfferSchema>,
        mode: 'onChange',
        defaultValues: {
            stuff: {
                stuff_id: data?.stuff?.stuff_id || undefined,
                title: data?.stuff?.title || "",
                subtitle: data?.stuff?.subtitle || "",
                description: data?.stuff?.description || "",
                type: data?.stuff?.type || "BOOK",
                condition: data?.stuff?.condition || "GOOD",
                original_price: data?.stuff?.original_price || 0,
                author: data?.stuff?.author || "",
                publisher: data?.stuff?.publisher || "",
                edition: data?.stuff?.edition || "",
                isbn: data?.stuff?.isbn || "",
                publication_year: data?.stuff?.publication_year || undefined,
                book_type: data?.stuff?.book_type || undefined,
                brand: data?.stuff?.brand || "",
                model: data?.stuff?.model || "",
                stationery_type: data?.stuff?.stationery_type || undefined,
                language: data?.stuff?.language || "English",
                subject: data?.stuff?.subject || "",
                genre: data?.stuff?.genre || "",
                class_suitability: data?.stuff?.class_suitability || "",
                quantity: data?.stuff?.quantity || 1,
                images: data?.stuff?.images || [],
                tags: data?.stuff?.tags || [],
                created_at: data?.stuff?.created_at || undefined,
                updated_at: data?.stuff?.updated_at || undefined,
            },
            offer: {
                offer_id: data?.offer?.offer_id || undefined,
                offer_type: data?.offer?.offer_type || "LEND",
                price: data?.offer?.price || undefined,
                rental_price_per_day: data?.offer?.rental_price_per_day || undefined,
                rental_period_days: data?.offer?.rental_period_days || undefined,
                security_deposit: data?.offer?.security_deposit || undefined,
                exchange_item_description: data?.offer?.exchange_item_description || "",
                exchange_item_value: data?.offer?.exchange_item_value || undefined,
                availability_start: data?.offer?.availability_start
                    ? new Date(data.offer.availability_start).toISOString().split("T")[0]
                    : "",
                availability_end: data?.offer?.availability_end
                    ? new Date(data.offer.availability_end).toISOString().split("T")[0]
                    : "",
                quantity_available: data?.offer?.quantity_available || 1,
                pickup_address: data?.offer?.pickup_address || "",
                latitude: data?.offer?.latitude || undefined,
                longitude: data?.offer?.longitude || undefined,
                city: data?.offer?.city || "",
                state: data?.offer?.state || "",
                pincode: data?.offer?.pincode || "",
                visibility_scope: data?.offer?.visibility_scope || "PUBLIC",
                terms_conditions: data?.offer?.terms_conditions || "",
                special_instructions: data?.offer?.special_instructions || "",
                created_at: data?.offer?.created_at || undefined,
                updated_at: data?.offer?.updated_at || undefined,
            },
        },
    });

    const watchedStuffType = watch("stuff.type");
    const watchedOfferType = watch("offer.offer_type");

    const [images, setImages] = useState<string[]>(data?.stuff?.images || []);
    const [tags, setTags] = useState<string[]>(data?.stuff?.tags || []);
    const [newTag, setNewTag] = useState("");

    const router = useRouter();

    const [state, formAction] = useActionState(
        type === "create" ? createStuffWithOffer : updateStuffWithOffer,
        {
            success: false,
            error: false,
        }
    );

    const [isPending, startTransition] = useTransition();
    const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported by your browser");
            return;
        }
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setValue("offer.latitude", latitude);
                setValue("offer.longitude", longitude);
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
        const fieldsToValidate = ["stuff.title", "stuff.type", "stuff.condition", "stuff.original_price"];

        if (watchedStuffType === "BOOK") {
            fieldsToValidate.push("stuff.author");
        }

        const isStuffValid = await trigger(fieldsToValidate as GenericData);

        if (isStuffValid) {
            setCurrentStep('offer');
        } else {
            toast.error("Please fill in all required fields");
        }
    };

    const handlePrevStep = () => {
        setCurrentStep('stuff');
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
            const updatedTags = [...tags, newTag.trim()];
            setTags(updatedTags);
            setValue("stuff.tags", updatedTags);
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        setValue("stuff.tags", updatedTags);
    };

    const onSubmit = handleSubmit((formData) => {
        console.log("Form submitted with data:", formData);

        const payload = {
            ...formData,
            stuff: {
                ...formData.stuff,
                images: images,
                tags: tags,
            },
            ...(type === "update" && data?.stuff_id && { stuff_id: data.stuff_id }),
            ...(type === "update" && data?.offer_id && { offer_id: data.offer_id }),
        };

        setHasShownSuccessToast(false);

        startTransition(() => {
            formAction(payload);
        });
    });

    useEffect(() => {
        if (state.success && !hasShownSuccessToast) {
            toast.success(
                `Item has been ${type === "create" ? "created" : "updated"} successfully!`
            );
            setHasShownSuccessToast(true);

            if (type === "create") {
                reset();
                setImages([]);
                setTags([]);
                setCurrentStep('stuff');
            }

            setOpen(false);
            router.refresh();
        }

        if (state.error && !hasShownSuccessToast) {
            toast.error(
                typeof state.error === 'string' ? state.error : "Something went wrong!"
            );
        }
    }, [state.success, state.error, hasShownSuccessToast, type, reset, router, setOpen]);

    useEffect(() => {
        setValue("stuff.images", images);
    }, [images, setValue]);

    useEffect(() => {
        setValue("stuff.tags", tags);
    }, [tags, setValue]);

    // Clear conditional fields when type changes
    useEffect(() => {
        if (watchedStuffType === "BOOK") {
            setValue("stuff.brand", "");
            setValue("stuff.model", "");
            setValue("stuff.stationery_type", undefined);
        } else if (watchedStuffType === "STATIONERY") {
            setValue("stuff.author", "");
            setValue("stuff.publisher", "");
            setValue("stuff.edition", "");
            setValue("stuff.isbn", "");
            setValue("stuff.publication_year", undefined);
            setValue("stuff.book_type", undefined);
        } else {
            setValue("stuff.author", "");
            setValue("stuff.publisher", "");
            setValue("stuff.edition", "");
            setValue("stuff.isbn", "");
            setValue("stuff.publication_year", undefined);
            setValue("stuff.book_type", undefined);
            setValue("stuff.brand", "");
            setValue("stuff.model", "");
            setValue("stuff.stationery_type", undefined);
        }

        clearErrors("stuff.author");
        clearErrors("stuff.brand");
    }, [watchedStuffType, setValue, clearErrors]);


    return (
        <form
            className="flex flex-col gap-8 bg-white shadow-lg rounded-2xl p-6"
            onSubmit={onSubmit}
        >
            {/* Header with Progress */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {type === "create" ? "List Your Item" : "Update Your Item"}
                    </h1>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {type === "update" && (<X size={24} className="text-gray-500" />)}
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500 ${currentStep === "stuff" ? "w-1/2" : "w-full"
                                }`}
                        />
                    </div>
                    <span className="text-sm font-medium text-gray-600 min-w-max">
                        Step {currentStep === "stuff" ? "1" : "2"} of 2
                    </span>
                </div>
            </div>



            {/* STEP 1: STUFF DETAILS */}
            {currentStep === 'stuff' && (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                        <Package className="text-blue-600" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800">Item Details</h2>
                    </div>

                    {/* Basic Information */}
                    <div className="flex flex-wrap gap-6">
                        <InputField
                            label="Title *"
                            name="stuff.title"
                            register={register}
                            error={errors?.stuff?.title}
                            placeholder="e.g., Advanced Physics Textbook"
                        />

                        <InputField
                            label="Subtitle"
                            name="stuff.subtitle"
                            register={register}
                            error={errors?.stuff?.subtitle}
                            placeholder="Optional subtitle"
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-500">Item Type *</label>
                            <select
                                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                {...register("stuff.type")}
                            >
                                <option value="BOOK">Book</option>
                                <option value="STATIONERY">Stationery</option>
                                <option value="ELECTRONICS">Electronics</option>
                                <option value="NOTES">Notes</option>
                                <option value="OTHER">Other</option>
                            </select>
                            {errors?.stuff?.type && (
                                <p className="text-xs text-red-500">{errors.stuff.type.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-500">Condition *</label>
                            <select
                                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                {...register("stuff.condition")}
                            >
                                <option value="NEW">New</option>
                                <option value="LIKE_NEW">Like New</option>
                                <option value="GOOD">Good</option>
                                <option value="FAIR">Fair</option>
                                <option value="POOR">Poor</option>
                            </select>
                            {errors?.stuff?.condition && (
                                <p className="text-xs text-red-500">{errors.stuff.condition.message}</p>
                            )}
                        </div>

                        <InputField
                            label="Original Price *"
                            name="stuff.original_price"
                            type="number"
                            register={register}
                            error={errors?.stuff?.original_price}
                            placeholder="0"
                        />

                        <InputField
                            label="Quantity"
                            name="stuff.quantity"
                            type="number"
                            register={register}
                            error={errors?.stuff?.quantity}
                            placeholder="1"
                        />
                    </div>

                    {/* Conditional Fields Based on Type */}
                    {watchedStuffType === "BOOK" && (
                        <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                                Book Details
                            </h3>
                            <div className="flex flex-row gap-4">
                                <InputField
                                    label="Author *"
                                    name="stuff.author"
                                    register={register}
                                    error={errors?.stuff?.author}
                                    placeholder="Author name"
                                />

                                <InputField
                                    label="Publisher"
                                    name="stuff.publisher"
                                    register={register}
                                    error={errors?.stuff?.publisher}
                                    placeholder="Publisher name"
                                />

                                <InputField
                                    label="Edition"
                                    name="stuff.edition"
                                    register={register}
                                    error={errors?.stuff?.edition}
                                    placeholder="e.g., 3rd Edition"
                                />
                            </div>
                            <div className="flex flex-row gap-4">
                                <InputField
                                    label="ISBN"
                                    name="stuff.isbn"
                                    register={register}
                                    error={errors?.stuff?.isbn}
                                    placeholder="ISBN number"
                                />

                                <InputField
                                    label="Publication Year"
                                    name="stuff.publication_year"
                                    type="number"
                                    register={register}
                                    error={errors?.stuff?.publication_year}
                                    placeholder="e.g., 2023"
                                />

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs text-gray-500">Book Type</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        {...register("stuff.book_type")}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="TEXTBOOK">Textbook</option>
                                        <option value="REFERENCE">Reference</option>
                                        <option value="NOVEL">Novel</option>
                                        <option value="JOURNAL">Journal</option>
                                        <option value="MAGAZINE">Magazine</option>
                                        <option value="WORKBOOK">Workbook</option>
                                        <option value="GUIDE">Guide</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {watchedStuffType === "STATIONERY" && (
                        <div className="space-y-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                                Stationery Details
                            </h3>
                            <div className="flex flex-col gap-4">
                                <InputField
                                    label="Brand"
                                    name="stuff.brand"
                                    register={register}
                                    error={errors?.stuff?.brand}
                                    placeholder="Brand name"
                                />

                                <InputField
                                    label="Model"
                                    name="stuff.model"
                                    register={register}
                                    error={errors?.stuff?.model}
                                    placeholder="Model name/number"
                                />

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs text-gray-500">Stationery Type</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        {...register("stuff.stationery_type")}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="WRITING">Writing</option>
                                        <option value="DRAWING">Drawing</option>
                                        <option value="CALCULATION">Calculation</option>
                                        <option value="STORAGE">Storage</option>
                                        <option value="CRAFT">Craft</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Common Metadata */}
                    <div className="flex flex-row gap-6">
                        <InputField
                            label="Language"
                            name="stuff.language"
                            register={register}
                            error={errors?.stuff?.language}
                            placeholder="e.g., English"
                        />

                        <InputField
                            label="Subject"
                            name="stuff.subject"
                            register={register}
                            error={errors?.stuff?.subject}
                            placeholder="e.g., Physics, Mathematics"
                        />

                        <InputField
                            label="Genre"
                            name="stuff.genre"
                            register={register}
                            error={errors?.stuff?.genre}
                            placeholder="e.g., Fiction, Academic"
                        />

                        <InputField
                            label="Class Suitability"
                            name="stuff.class_suitability"
                            register={register}
                            error={errors?.stuff?.class_suitability}
                            placeholder="e.g., Class 12, 1st Year"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-500">Description</label>
                        <textarea
                            className="border border-gray-300 p-4 rounded-xl text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            {...register("stuff.description")}
                            rows={4}
                            placeholder="Describe your item in detail..."
                        />
                        {errors?.stuff?.description && (
                            <p className="text-xs text-red-500">{errors.stuff.description.message}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="text-xs text-gray-500">Item Images</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                            <CldUploadWidget
                                uploadPreset="vidyarth"
                                options={{ multiple: true, resourceType: "image", maxFiles: 5 }}
                                onSuccess={(result: GenericData) => {
                                    if (result?.info && "secure_url" in result.info) {
                                        setImages(prev => [...prev, result.info.secure_url]);
                                    }
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
                                    >
                                        <ImageIcon size={20} />
                                        Upload Images
                                    </button>
                                )}
                            </CldUploadWidget>
                            <p className="text-xs text-gray-500 mt-2">Upload up to 5 images</p>
                        </div>

                        {/* Image Preview */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((url, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="relative w-full h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                                            <Image src={url} alt={`Item ${idx + 1}`} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                        {idx === 0 && (
                                            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                        <label className="text-xs text-gray-500">Tags</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Add a tag..."
                                className="flex-1 border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                            >
                                Add
                            </button>
                        </div>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2: OFFER DETAILS */}
            {currentStep === 'offer' && (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                        <Package className="text-purple-600" size={24} />
                        <h2 className="text-xl font-semibold text-gray-800">Offer Details</h2>
                    </div>

                    {/* Offer Type */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-500">What would you like to do? *</label>
                            <div className="flex flex-row gap-3">
                                {[
                                    { value: "SELL", label: "Sell", desc: "Sell permanently" },
                                    { value: "LEND", label: "Lend", desc: "Lend for free" },
                                    { value: "RENT", label: "Rent", desc: "Rent for money" },
                                    { value: "SHARE", label: "Share", desc: "Share freely" },
                                    { value: "EXCHANGE", label: "Exchange", desc: "Trade for item" }
                                ].map((option) => (
                                    <label key={option.value} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            value={option.value}
                                            {...register("offer.offer_type")}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 rounded-xl border-2 text-center transition-all hover:shadow-md ${watchedOfferType === option.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                            <div className="font-semibold text-sm">{option.label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors?.offer?.offer_type && (
                                <p className="text-xs text-red-500">{errors.offer.offer_type.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Pricing Based on Offer Type */}
                    <div className="space-y-6">
                        {watchedOfferType === "SELL" && (
                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                <h3 className="text-lg font-semibold text-green-800 mb-4">Selling Details</h3>
                                <div className="flex flex-row gap-4">
                                    <InputField
                                        label="Selling Price *"
                                        name="offer.price"
                                        type="number"
                                        register={register}
                                        error={errors?.offer?.price}
                                        placeholder="Enter selling price"
                                    />
                                    <InputField
                                        label="Quantity Available"
                                        name="offer.quantity_available"
                                        type="number"
                                        register={register}
                                        error={errors?.offer?.quantity_available}
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        )}

                        {watchedOfferType === "RENT" && (
                            <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                                <h3 className="text-lg font-semibold text-orange-800 mb-4">Rental Details</h3>
                                <div className="flex flex-row gap-4">
                                    <InputField
                                        label="Rental Price per Day *"
                                        name="offer.rental_price_per_day"
                                        type="number"
                                        register={register}
                                        error={errors?.offer?.rental_price_per_day}
                                        placeholder="Daily rental price"
                                    />
                                    <InputField
                                        label="Max Rental Period (days)"
                                        name="offer.rental_period_days"
                                        type="number"
                                        register={register}
                                        error={errors?.offer?.rental_period_days}
                                        placeholder="Maximum rental days"
                                    />
                                    <InputField
                                        label="Security Deposit"
                                        name="offer.security_deposit"
                                        type="number"
                                        register={register}
                                        placeholder="Security deposit amount"
                                    />
                                    <InputField
                                        label="Quantity Available"
                                        name="offer.quantity_available"
                                        type="number"
                                        register={register}
                                        error={errors?.offer?.quantity_available}
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        )}

                        {watchedOfferType === "EXCHANGE" && (
                            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                                <h3 className="text-lg font-semibold text-purple-800 mb-4">Exchange Details</h3>
                                <div className="flex flex-row flex-wrap gap-4">
                                    <InputField
                                        label="What do you want in exchange? *"
                                        name="offer.exchange_item_description"
                                        register={register}
                                        error={errors?.offer?.exchange_item_description}
                                        placeholder="Describe what you want in exchange"
                                    />
                                    <InputField
                                        label="Estimated Value"
                                        name="offer.exchange_item_value"
                                        type="number"
                                        register={register}
                                        error={errors?.offer?.exchange_item_value}
                                        placeholder="Estimated value"
                                    />
                                    <InputField
                                        label="Quantity Available"
                                        name="offer.quantity_available"
                                        type="number"
                                        register={register}
                                        error={errors?.offer?.quantity_available}
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        )}

                        {(watchedOfferType === "LEND" || watchedOfferType === "SHARE") && (
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                                    {watchedOfferType === "LEND" ? "Lending Details" : "Sharing Details"}
                                </h3>
                                <div className="flex flex-row gap-4">
                                    <InputField
                                        label="Quantity Available"
                                        name="offer.quantity_available"
                                        type="number"
                                        register={register}
                                        error={errors?.offer?.quantity_available}
                                        placeholder="1"
                                    />
                                    {watchedOfferType === "LEND" && (
                                        <InputField
                                            label="Security Deposit (Optional)"
                                            name="offer.security_deposit"
                                            type="number"
                                            register={register}
                                            placeholder="Security deposit amount"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Availability Dates */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Availability</h3>
                        <div className="flex flex-row gap-4">
                            <InputField
                                label="Available From"
                                name="offer.availability_start"
                                type="date"
                                register={register}
                                error={errors?.offer?.availability_start}
                            />
                            <InputField
                                label="Available Until"
                                name="offer.availability_end"
                                type="date"
                                register={register}
                                error={errors?.offer?.availability_end}
                            />
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Pickup Location</h3>
                        <div className="flex flex-row flex-wrap gap-4">
                            <InputField
                                label="Pickup Address"
                                name="offer.pickup_address"
                                register={register}
                                error={errors?.offer?.pickup_address}
                                placeholder="Where can buyers pickup the item?"
                            />

                            <div className="md:col-span-2 flex gap-3">
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

                            <InputField
                                label="City"
                                name="offer.city"
                                register={register}
                                error={errors?.offer?.city}
                                placeholder="City"
                            />

                            <InputField
                                label="State"
                                name="offer.state"
                                register={register}
                                error={errors?.offer?.state}
                                placeholder="State"
                            />

                            <InputField
                                label="Pincode"
                                name="offer.pincode"
                                register={register}
                                error={errors?.offer?.pincode}
                                placeholder="Pincode"
                            />
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Visibility</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-500">Who can see this listing?</label>
                            <div className="flex flex-row gap-3">
                                {[
                                    { value: "PUBLIC", label: "Everyone", desc: "Visible to all users" },
                                    { value: "COLLEGE", label: "College Only", desc: "Only your college" },
                                    { value: "CLASS", label: "Class Only", desc: "Only your class" }
                                ].map((option) => (
                                    <label key={option.value} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            value={option.value}
                                            {...register("offer.visibility_scope")}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 rounded-xl border-2 text-center transition-all hover:shadow-md ${watch("offer.visibility_scope") === option.value
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                            <div className="font-semibold text-sm">{option.label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Terms and Instructions */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-500">Terms & Conditions</label>
                                <textarea
                                    className="border border-gray-300 p-4 rounded-xl text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                    {...register("offer.terms_conditions")}
                                    rows={4}
                                    placeholder="Any terms and conditions for this offer..."
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-500">Special Instructions</label>
                                <textarea
                                    className="border border-gray-300 p-4 rounded-xl text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                    {...register("offer.special_instructions")}
                                    rows={4}
                                    placeholder="Any special instructions for pickup/handover..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Debugging fields: Read-only */}
            <div className="flex flex-row flex-wrap gap-4">
                <InputField label="User ID" name="user_id" register={register} readOnly />
                <InputField label="Stuff ID" name="stuff.stuff_id" register={register} readOnly />
                <InputField label="Offer ID" name="offer.offer_id" register={register} readOnly />
                <InputField label="Stuff Created At" name="stuff.created_at" register={register} readOnly />
                <InputField label="Offer Created At" name="offer.created_at" register={register} readOnly />
                <InputField label="Latitude" name="offer.latitude" register={register} readOnly />
                <InputField label="Longitude" name="offer.longitude" register={register} readOnly />
            </div>

            {/* Error Display */}
            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {typeof state.error === 'string' ? state.error : "Something went wrong! Please try again."}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
                {currentStep === 'offer' ? (
                    <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                        <ArrowLeft size={18} />
                        Previous
                    </button>
                ) : <div></div>}

                {currentStep === 'stuff' ? (
                    <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Next Step
                        <ArrowRight size={18} />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed min-w-[160px]"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Processing...
                            </>
                        ) : (
                            <>
                                {type === "create" ? <Plus size={18} /> : <Package size={18} />}
                                {type === "create" ? "Create Listing" : "Update Listing"}
                            </>
                        )}
                    </button>
                )}
            </div>
        </form>
    );
}