import { createReview, updateReview } from '@/lib/actions';
import { reviewSchema, ReviewSchema } from '@/lib/formValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { Dispatch, useActionState, useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericData = any;

export default function ReviewForm({
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

    const [selectedRating, setSelectedRating] = useState<number>(data?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    // const [stuff, setStuff] = useState<any | null>(null);
    // const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ReviewSchema>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            ...data,
        },
    });

    const watchedType = watch("type");
    const router = useRouter();

    const [state, formAction] = useActionState(
        type === "create" ? createReview : updateReview,
        { success: false, error: false }
    );

    const [isPending, startTransition] = useTransition();
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  // Prefill hidden IDs from data
  useEffect(() => {
    if (!data) return;
    setValue('stuff_id', data.stuff_id);
    setValue('target_user_id', data.owner?.user_id);
  }, [data, setValue]);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const onSubmit = handleSubmit((formData) => {
    const payload = {
      ...formData,
      stuff_id: data?.stuff_id,
      target_user_id: data?.owner?.user_id,
      rating: selectedRating,
      trade_id: undefined,
    };

    setHasShownSuccessToast(false);
    startTransition(() => {
      formAction(payload);
    });
  });

  useEffect(() => {
    if (state.success && !hasShownSuccessToast) {
      toast.success(`Review has been ${type === 'create' ? 'created' : 'updated'} successfully!`);
      setHasShownSuccessToast(true);
      if (type === 'create') {
        reset();
        setSelectedRating(0);
      }
      setOpen(false);
      router.refresh();
    }

    if (state.error && !hasShownSuccessToast) {
      toast.error(typeof state.error === 'string' ? state.error : 'Something went wrong!');
    }
  }, [state, router, setOpen, type, reset, hasShownSuccessToast]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {type === 'create' ? 'Write a Review' : 'Update Review'}
        </h1>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Debug IDs (readonly) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700">Stuff ID</label>
        <input
          type="text"
          value={data?.stuff_id || ''}
          readOnly
          className="p-2 border rounded bg-gray-100 text-gray-600"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700">Target User ID</label>
        <input
          type="text"
          value={data?.owner?.user_id || ''}
          readOnly
          className="p-2 border rounded bg-gray-100 text-gray-600"
        />
      </div>

      {/* Review Type Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">Review Type *</label>
        <select
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          {...register('type')}
        >
          <option value="UNIVERSAL_STUFF">UNIVERSAL_STUFF</option>
          <option value="THANK_YOU_MESSAGE">THANK_YOU_MESSAGE</option>
          <option value="USER_RATING">USER_RATING</option>
        </select>
        {errors?.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
      </div>

      {/* Rating Section */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">Rating *</label>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoveredRating || selectedRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {selectedRating > 0 ? `${selectedRating}/5 stars` : 'Select a rating'}
          </span>
        </div>
        {errors.rating?.message && <p className="text-xs text-red-500">{errors.rating.message}</p>}
      </div>

      {/* Review Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Title <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          {...register('title')}
          placeholder="Brief title for your review"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          maxLength={100}
        />
        {errors.title?.message && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Review Message */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Your Review *</label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder={
            watchedType === 'THANK_YOU_MESSAGE'
              ? 'Express your gratitude and appreciation...'
              : watchedType === 'UNIVERSAL_STUFF'
              ? "Share your thoughts about the item's condition, quality, and your experience..."
              : 'Share your experience with this user - were they reliable, communicative, and trustworthy?'
          }
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          maxLength={1000}
        />
        <div className="flex justify-between items-center">
          {errors.message?.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
          <span className="text-xs text-gray-400">{watch('message')?.length || 0}/1000 characters</span>
        </div>
      </div>

      {/* Submit Button */}
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
          disabled={isPending || selectedRating === 0}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          {isPending ? 'Submitting...' : type === 'create' ? 'Submit Review' : 'Update Review'}
        </button>
      </div>
    </form>
  );
}