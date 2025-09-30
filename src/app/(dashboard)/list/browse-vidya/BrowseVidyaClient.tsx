"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import { StuffType, OfferType, ItemCondition } from "@prisma/client";
import { OfferWithStuffClient } from "./page";
import { Filter } from "lucide-react";


// Dynamically import ALL leaflet-related components and classes (no SSR)
const MapContainer = dynamic(
    () => import("react-leaflet").then((m) => m.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((m) => m.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((m) => m.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((m) => m.Popup),
    { ssr: false }
);

// Create a client-side only component for the map functionality
const MapComponent = dynamic(
    () => Promise.resolve(MapComponentInner),
    { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><p>Loading map...</p></div> }
);

interface SelectedFilters {
    stuffType: StuffType[];
    offerType: OfferType[];
    condition: ItemCondition[];
}

interface MapControllerProps {
    center: [number, number];
    zoom: number;
}

// This component will only render on the client side
function MapComponentInner({
    userLocation,
    filteredOffers,
    mapCenter,
    mapZoom,
    router
}: {
    offers: OfferWithStuffClient[];
    userLocation?: { lat: number; lng: number };
    filteredOffers: OfferWithStuffClient[];
    mapCenter: [number, number];
    mapZoom: number;
    router: ReturnType<typeof useRouter>;
}) {
    // Import Leaflet components dynamically within the component
    const [leafletComponents, setLeafletComponents] = useState<{
        Icon: typeof import("leaflet").Icon;
        useMap: () => import("leaflet").Map;
    } | null>(null);

    useEffect(() => {
        // Dynamically import leaflet components
        Promise.all([
            import("leaflet").then(m => m.Icon),
            import("react-leaflet").then(m => m.useMap)
        ]).then(([Icon, useMap]) => {
            setLeafletComponents({ Icon, useMap });
        });
    }, []);

    // Don't render until leaflet components are loaded
    if (!leafletComponents) {
        return <div className="flex items-center justify-center h-full"><p>Loading map components...</p></div>;
    }

    const { Icon, useMap } = leafletComponents;

    // Custom marker icons (now safely on client side)
    const createCustomIcon = (color: string) => new Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const bookIcon = createCustomIcon("blue");
    const stationeryIcon = createCustomIcon("green");
    const electronicsIcon = createCustomIcon("red");
    const otherIcon = createCustomIcon("grey");

    const getMarkerIcon = (stuffType: StuffType) => {
        switch (stuffType) {
            case StuffType.BOOK: return bookIcon;
            case StuffType.STATIONERY: return stationeryIcon;
            case StuffType.ELECTRONICS: return electronicsIcon;
            default: return otherIcon;
        }
    };

    function MapController({ center, zoom }: MapControllerProps) {
        const map = useMap();

        useEffect(() => {
            map.setView(center, zoom);
        }, [center, zoom, map]);

        return null;
    }

    return (
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <MapController center={mapCenter} zoom={mapZoom} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Location Marker */}
            {userLocation && (
                <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={createCustomIcon("violet")}
                >
                    <Popup>
                        <div className="text-center">
                            <strong>Your Location</strong>
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* Offer Markers */}
            {filteredOffers
                .filter((offer) => offer.latitude && offer.longitude)
                .map((offer) => (
                    <Marker
                        key={offer.offer_id}
                        position={[offer.latitude!, offer.longitude!]}
                        icon={getMarkerIcon(offer.stuff.type)}
                        eventHandlers={{
                            mouseover: (e) => {
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                e.target.closePopup();
                            },
                            click: () => router.push(`/list/browse-vidya/${offer.stuff.stuff_id}`),
                        }}
                    >
                        <Popup
                            closeButton={false}
                            autoPan={false}
                        >
                            <div className="w-64 p-2">
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
                                        {offer.stuff.author && <p className="text-xs text-gray-600">by {offer.stuff.author}</p>}
                                        <p className="text-xs text-gray-500 mt-1">{offer.city}</p>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
}

interface BrowseVidyaPageProps {
    offers: OfferWithStuffClient[];
    userLocation?: { lat: number; lng: number };
}

export default function BrowseVidyaClient({ offers, userLocation }: BrowseVidyaPageProps) {
    const router = useRouter();
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
        stuffType: [],
        offerType: [],
        condition: [],
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [radius, setRadius] = useState(10);
    const [mapCenter, setMapCenter] = useState<[number, number]>([22.5726, 88.4639]); // Default to Kolkata
    const [mapZoom] = useState(12);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Set user location as map center if available
    useEffect(() => {
        if (userLocation) {
            setMapCenter([userLocation.lat, userLocation.lng]);
        }
    }, [userLocation]);

    // Haversine distance calculation
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    // Filter offers based on selected criteria
    const filteredOffers = offers.filter((offer) => {
        // Text search
        if (searchQuery && !offer.stuff.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Type filters
        if (selectedFilters.stuffType.length > 0 && !selectedFilters.stuffType.includes(offer.stuff.type)) {
            return false;
        }

        if (selectedFilters.offerType.length > 0 && !selectedFilters.offerType.includes(offer.offer_type)) {
            return false;
        }

        if (selectedFilters.condition.length > 0 && !selectedFilters.condition.includes(offer.stuff.condition)) {
            return false;
        }

        // Distance filter
        if (userLocation && offer.latitude && offer.longitude) {
            const distance = getDistance(userLocation.lat, userLocation.lng, offer.latitude, offer.longitude);
            if (distance > radius) return false;
        }

        return true;
    });

    // Fix for the handleFilterChange function
    const handleFilterChange = <K extends keyof SelectedFilters>(
        filterType: K,
        value: SelectedFilters[K][number]
    ) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };

            switch (filterType) {
                case 'stuffType':
                    const stuffType = value as StuffType;
                    newFilters.stuffType = newFilters.stuffType.includes(stuffType)
                        ? newFilters.stuffType.filter(item => item !== stuffType)
                        : [...newFilters.stuffType, stuffType];
                    break;
                case 'offerType':
                    const offerType = value as OfferType;
                    newFilters.offerType = newFilters.offerType.includes(offerType)
                        ? newFilters.offerType.filter(item => item !== offerType)
                        : [...newFilters.offerType, offerType];
                    break;
                case 'condition':
                    const condition = value as ItemCondition;
                    newFilters.condition = newFilters.condition.includes(condition)
                        ? newFilters.condition.filter(item => item !== condition)
                        : [...newFilters.condition, condition];
                    break;
                default:
                    return newFilters;
            }
            return newFilters;
        });
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="lg:hidden p-4 border-b">
                <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md w-full justify-center"
                >
                    <Filter size={18} />
                    {isFiltersOpen ? "Hide Filters" : "Show Filters"}
                </button>
            </div>
            {/* LEFT SIDEBAR - Filters */}
            <aside className={`bg-gray-50 shadow-md overflow-y-auto border-r transition-all duration-300 ease-in-out ${isFiltersOpen ? 'max-h-full w-full' : 'max-h-0 w-full'} lg:max-h-full lg:w-80 lg:block`}>
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold mb-4">Browse Study Materials</h2>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Distance Slider */}
                    {userLocation && (
                        <div className="mb-6 bg-white p-3 rounded-lg shadow">
                            <h3 className="font-medium mb-2">Distance: {radius} km</h3>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="p-4 space-y-4">
                    {/* Item Type */}
                    <div className="bg-white p-3 rounded-lg shadow">
                        <h3 className="font-medium mb-2">Item Type</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.values(StuffType).map((type) => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.stuffType.includes(type)}
                                        onChange={() => handleFilterChange('stuffType', type)}
                                        className="h-4 w-4 accent-blue-500"
                                    />
                                    <span className="text-sm capitalize">{type.toLowerCase().replace('_', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Offer Type */}
                    <div className="bg-white p-3 rounded-lg shadow">
                        <h3 className="font-medium mb-2">Offer Type</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.values(OfferType).map((type) => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.offerType.includes(type)}
                                        onChange={() => handleFilterChange('offerType', type)}
                                        className="h-4 w-4 accent-blue-500"
                                    />
                                    <span className="text-sm capitalize">{type.toLowerCase()}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Condition */}
                    <div className="bg-white p-3 rounded-lg shadow">
                        <h3 className="font-medium mb-2">Condition</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.values(ItemCondition).map((condition) => (
                                <label key={condition} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.condition.includes(condition)}
                                        onChange={() => handleFilterChange('condition', condition)}
                                        className="h-4 w-4 accent-blue-500"
                                    />
                                    <span className="text-sm capitalize">{condition.toLowerCase().replace('_', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="p-4 border-t">
                    <p className="text-sm text-gray-600">
                        Showing {filteredOffers.length} of {offers.length} items
                    </p>
                </div>
            </aside>


            {/* MAP SECTION */}
            <div className="flex-1 relative">
                <MapComponent
                    offers={offers}
                    userLocation={userLocation}
                    filteredOffers={filteredOffers}
                    mapCenter={mapCenter}
                    mapZoom={mapZoom}
                    router={router}
                />

                {/* Legend */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 z-[1000]">
                    <h4 className="font-medium text-sm mb-2">Legend</h4>
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Books</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Stationery</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>Electronics</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Your Location</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}