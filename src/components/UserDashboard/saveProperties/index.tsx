import PropertyCard from '@/components/web-pages/HomePage/PropertyCard';

const SaveProperties = ({ favoriteProperties }: { favoriteProperties: any[] }) => {

    const filteredProperties = favoriteProperties
        ?.filter((property: any) => property.listingId)
        ?.map((property: any) => property.listingId);
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#1a3c6e]">Saved Properties</h1>
                <p className="text-gray-500 mt-1">6 properties found matching your criteria</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                    <PropertyCard key={index} property={property} />
                ))}
            </div>
        </div>
    )
}

export default SaveProperties