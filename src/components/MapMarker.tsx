"use client";

import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { StuffType, OfferType } from "@prisma/client";

const createCustomIcon = (color: string) => new Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getMarkerIcon = (stuffType: StuffType) => {
  switch (stuffType) {
    case StuffType.BOOK: return createCustomIcon("blue");
    case StuffType.STATIONERY: return createCustomIcon("green");
    case StuffType.ELECTRONICS: return createCustomIcon("red");
    default: return createCustomIcon("grey");
  }
};

interface MapMarkerProps {
  offer: {
    offer_id: string;
    stuff: {
      stuff_id: string;
      title: string;
      type: StuffType;
      images: { url: string; is_primary: boolean }[];
      author?: string;
      brand?: string;
    };
    user: {
      profile?: {
        full_name: string;
      };
    };
    offer_type: OfferType;
    price?: number;
    rental_price_per_day?: number;
    latitude: number;
    longitude: number;
    city?: string;
  };
}

export default function MapMarker({ offer }: MapMarkerProps) {
  const router = useRouter();

  return (
    <Marker
      position={[offer.latitude, offer.longitude]}
      icon={getMarkerIcon(offer.stuff.type)}
      eventHandlers={{
        click: () => {
          router.push(`/browse-vidya/${offer.stuff.stuff_id}`);
        }
      }}
    >
      <Popup>
        <div className="w-64">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              {offer.stuff.images.find(img => img.is_primary)?.url ? (
                <Image
                  src={offer.stuff.images.find(img => img.is_primary)?.url || ''}
                  alt={offer.stuff.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">No Image</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{offer.stuff.title}</h3>
              <p className="text-xs text-gray-500 capitalize">
                {offer.stuff.type.toLowerCase().replace('_', ' ')}
              </p>
              {offer.stuff.author && (
                <p className="text-xs text-gray-600">by {offer.stuff.author}</p>
              )}
              {offer.stuff.brand && (
                <p className="text-xs text-gray-600">{offer.stuff.brand}</p>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  offer.offer_type === OfferType.SELL ? 'bg-green-100 text-green-800' :
                  offer.offer_type === OfferType.RENT ? 'bg-blue-100 text-blue-800' :
                  offer.offer_type === OfferType.LEND ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {offer.offer_type}
                </span>
                
                {offer.price && (
                  <span className="text-xs font-semibold text-green-600">
                    ₹{offer.price}
                  </span>
                )}
                {offer.rental_price_per_day && (
                  <span className="text-xs font-semibold text-blue-600">
                    ₹{offer.rental_price_per_day}/day
                  </span>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                {offer.user.profile?.full_name} • {offer.city}
              </p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/browse-vidya/${offer.stuff.stuff_id}`);
                }}
                className="w-full mt-2 bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}