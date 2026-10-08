import PropertyCard from "../HomePage/PropertyCard";

interface Props {
  properties: any[];
}

export default function PropertyList({ properties }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <PropertyCard key={index} property={property} />
      ))}
    </div>
  );
}