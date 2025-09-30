"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Heart, MapPin, User, Star } from "lucide-react";
import { StuffType, OfferType, ItemCondition } from "@prisma/client";
import { StuffWithRelations } from "./page";

interface SingleStuffClientProps {
  stuff: StuffWithRelations;
}

export default function SingleStuffClient({ stuff }: SingleStuffClientProps) {
  // const { user } = useUser();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // const isOwner = user?.primaryEmailAddress?.emailAddress === stuff.owner.email;
  const primaryImage = stuff.images.find(img => img.is_primary) || stuff.images[0];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (activeImageIndex === null) return;
    if (e.key === "Escape") setActiveImageIndex(null);
    if (e.key === "ArrowRight") setActiveImageIndex((i) => (i! + 1) % stuff.images.length);
    if (e.key === "ArrowLeft") setActiveImageIndex((i) => (i! - 1 + stuff.images.length) % stuff.images.length);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const averageRating = stuff.reviews.length > 0
    ? stuff.reviews.reduce((sum, review) => sum + review.rating, 0) / stuff.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col xl:flex-row gap-8 p-4 max-w-7xl mx-auto">
        {/* LEFT CONTENT */}
        <div className="w-full xl:w-2/3 flex flex-col gap-8">

          {/* HERO SECTION - Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {stuff.images.length > 0 ? (
              <div className="relative">
                <div className="relative h-96 sm:h-[500px]">
                  <Image
                    src={primaryImage?.url || "/placeholder.jpg"}
                    alt={stuff.title}
                    fill
                    className="object-cover"
                  />

                  {/* Favorite Button */}
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`absolute top-4 right-4 p-2 rounded-full shadow-lg ${isFavorited ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                      }`}
                  >
                    <Heart size={20} fill={isFavorited ? 'white' : 'none'} />
                  </button>
                </div>

                {/* Image Gallery Thumbnails */}
                {stuff.images.length > 1 && (
                  <div className="p-4 bg-white border-t">
                    <div className="flex gap-2 overflow-x-auto">
                      {stuff.images.map((image, idx) => (
                        <div
                          key={image.id}
                          className="relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500"
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <Image
                            src={image.url}
                            alt={`${stuff.title} ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </motion.div>

          {/* ITEM DETAILS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
          >
            {/* Title and Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                  {stuff.type.toLowerCase().replace('_', ' ')}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${stuff.condition === ItemCondition.NEW ? 'bg-green-100 text-green-800' :
                    stuff.condition === ItemCondition.LIKE_NEW ? 'bg-blue-100 text-blue-800' :
                      stuff.condition === ItemCondition.GOOD ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                  }`}>
                  {stuff.condition.replace('_', ' ')}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{stuff.title}</h1>
              {stuff.subtitle && (
                <p className="text-lg text-gray-600 mb-4">{stuff.subtitle}</p>
              )}

              {stuff.description && (
                <p className="text-gray-700 leading-relaxed">{stuff.description}</p>
              )}
            </div>

            {/* Specific Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stuff.type === StuffType.BOOK && (
                <>
                  {stuff.author && <DetailItem label="Author" value={stuff.author} />}
                  {stuff.publisher && <DetailItem label="Publisher" value={stuff.publisher} />}
                  {stuff.edition && <DetailItem label="Edition" value={stuff.edition} />}
                  {stuff.isbn && <DetailItem label="ISBN" value={stuff.isbn} />}
                  {stuff.publication_year && <DetailItem label="Publication Year" value={stuff.publication_year.toString()} />}
                  {stuff.book_type && <DetailItem label="Book Type" value={stuff.book_type.replace('_', ' ')} />}
                </>
              )}

              {stuff.type === StuffType.STATIONERY && (
                <>
                  {stuff.brand && <DetailItem label="Brand" value={stuff.brand} />}
                  {stuff.model && <DetailItem label="Model" value={stuff.model} />}
                  {stuff.stationery_type && <DetailItem label="Type" value={stuff.stationery_type.replace('_', ' ')} />}
                </>
              )}

              {stuff.subject && <DetailItem label="Subject" value={stuff.subject} />}
              {stuff.language && <DetailItem label="Language" value={stuff.language} />}
              {stuff.class_suitability && <DetailItem label="Class Suitability" value={stuff.class_suitability} />}
              {stuff.original_price && <DetailItem label="Original Price" value={`₹${stuff.original_price}`} />}

              <DetailItem label="Quantity Available" value={stuff.quantity.toString()} />
              <DetailItem label="Views" value={stuff.views_count.toString()} />
              <DetailItem label="Added" value={new Date(stuff.created_at).toLocaleDateString()} />
            </div>

            {/* Tags */}
            {stuff.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {stuff.tags.map(({ tag }) => (
                    <span
                      key={tag.name}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* REVIEWS SECTION */}
          {stuff.reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.round(averageRating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({stuff.reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {stuff.reviews.slice(0, 3).map((review) => (
                  <div key={review.review_id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {review.reviewer.profile?.avatar_url ? (
                          <Image
                            src={review.reviewer.profile.avatar_url}
                            alt={review.reviewer.profile.full_name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {review.reviewer.profile?.full_name || 'Anonymous'}
                          </span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i < review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {review.title && (
                          <p className="font-medium text-sm mb-1">{review.title}</p>
                        )}
                        {review.message && (
                          <p className="text-sm text-gray-700">{review.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full xl:w-1/3 flex flex-col gap-6 xl:sticky xl:top-4 h-fit">

          {/* OWNER CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full overflow-hidden">
              {stuff.owner.profile?.avatar_url ? (
                <Image
                  src={stuff.owner.profile.avatar_url}
                  alt={stuff.owner.profile.full_name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
              )}
            </div>

            <h2 className="text-lg font-semibold mb-1">
              {stuff.owner.profile?.full_name || 'Anonymous User'}
            </h2>

            {stuff.owner.profile?.schoolCollege && (
              <div className="text-sm text-gray-600 mb-2">
                <p>{stuff.owner.profile.schoolCollege.name}</p>
                <p className="text-xs">{stuff.owner.profile.schoolCollege.city}</p>
              </div>
            )}

            {/* Trust Score & Rating */}
            <div className="flex justify-center gap-4 mb-4">
              {stuff.owner.profile?.trust_score && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {stuff.owner.profile.trust_score}
                  </div>
                  <div className="text-xs text-gray-500">Trust Score</div>
                </div>
              )}

              {stuff.owner.profile?.rating_average && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="text-lg font-semibold">
                      {stuff.owner.profile.rating_average.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ({stuff.owner.profile.total_ratings} reviews)
                  </div>
                </div>
              )}
            </div>

            {/* {!isOwner && (
              <ChatButton
                offerId={selectedOffer ?? null}
                stuffId={stuff.stuff_id}
                otherUserId={stuff.owner.user_id}
                otherUserName={stuff.owner.profile?.full_name || "Owner"}
              />
            )} */}
          </motion.div>

          {/* OFFERS CARD */}
          {stuff.offers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Available Offers</h2>

              <div className="space-y-4">
                {stuff.offers
                  .filter(offer => offer.is_active)
                  .map((offer) => (
                    <div
                      key={offer.offer_id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedOffer === offer.offer_id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => setSelectedOffer(
                        selectedOffer === offer.offer_id ? null : offer.offer_id
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${offer.offer_type === OfferType.SELL ? 'bg-green-100 text-green-800' :
                            offer.offer_type === OfferType.RENT ? 'bg-blue-100 text-blue-800' :
                              offer.offer_type === OfferType.LEND ? 'bg-purple-100 text-purple-800' :
                                offer.offer_type === OfferType.SHARE ? 'bg-orange-100 text-orange-800' :
                                  'bg-gray-100 text-gray-800'
                          }`}>
                          {offer.offer_type}
                        </span>

                        <div className="text-right">
                          {offer.price && (
                            <div className="text-lg font-semibold text-green-600">
                              ₹{offer.price.toString()}
                            </div>
                          )}
                          {offer.rental_price_per_day && (
                            <div className="text-sm text-blue-600">
                              ₹{offer.rental_price_per_day.toString()}/day
                              {offer.rental_period_days && (
                                <span className="text-xs text-gray-500">
                                  (max {offer.rental_period_days} days)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {offer.security_deposit && (
                        <div className="text-sm text-gray-600 mb-2">
                          Security Deposit: ₹{offer.security_deposit.toString()}
                        </div>
                      )}

                      {offer.exchange_item_description && (
                        <div className="text-sm text-gray-600 mb-2">
                          Exchange for: {offer.exchange_item_description}
                        </div>
                      )}

                      {offer.pickup_address && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin size={12} />
                          <span>{offer.pickup_address}, {offer.city}</span>
                        </div>
                      )}

                      {selectedOffer === offer.offer_id && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          {offer.terms_conditions && (
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Terms:</strong> {offer.terms_conditions}
                            </div>
                          )}
                          {offer.special_instructions && (
                            <div className="text-sm text-gray-700 mb-3">
                              <strong>Instructions:</strong> {offer.special_instructions}
                            </div>
                          )}

                          {/* {!isOwner && (
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                              Request This Offer
                            </button>
                          )} */}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* SAFETY TIPS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 rounded-xl border border-yellow-200 p-6"
          >
            <h3 className="font-semibold text-yellow-800 mb-3">Safety Tips</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Meet in public places for exchanges</li>
              <li>• Verify item condition before payment</li>
              <li>• Keep communication within the platform</li>
              <li>• Report suspicious behavior</li>
            </ul>
          </motion.div>
        </aside>
      </div>

      {/* CONTACT FORM MODAL */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-2xl shadow-lg w-[95%] md:w-[500px] p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={() => setShowContactForm(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Contact Owner</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hi, I'm interested in your item..."
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX */}
      {activeImageIndex !== null && stuff.images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
          >
            <X />
          </button>

          {stuff.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((i) => (i! - 1 + stuff.images.length) % stuff.images.length)}
                className="absolute left-4 text-white text-4xl hover:text-gray-300"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => setActiveImageIndex((i) => (i! + 1) % stuff.images.length)}
                className="absolute right-4 text-white text-4xl hover:text-gray-300"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[80vh]">
            <Image
              src={stuff.images[activeImageIndex].url}
              alt={stuff.images[activeImageIndex].alt_text || stuff.title}
              width={1000}
              height={600}
              className="object-contain max-h-[80vh] w-auto mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}