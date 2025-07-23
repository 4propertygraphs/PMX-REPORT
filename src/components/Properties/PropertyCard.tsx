import React from 'react';
import { MapPin, Bed, Square, Calendar } from 'lucide-react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number, marketType: string) => {
    if (marketType === 'Residential Rent') {
      return `€${price.toLocaleString()}/month`;
    }
    return `€${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {property.rawAddress}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {property.region}, {property.county}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price, property.marketType)}
            </div>
            <div className="text-sm text-gray-500">
              {property.marketType === 'Residential Sale' ? 'For Sale' : 'For Rent'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <Bed className="h-4 w-4 mr-2" />
            <span className="text-sm">{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Square className="h-4 w-4 mr-2" />
            <span className="text-sm">{property.sqrMetres}m²</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{formatDate(property.saleDate)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>€{property.pricePerSqrMetres}/m²</span>
          {property.daysToSell && (
            <span>{property.daysToSell} days on market</span>
          )}
          {property.pageViews && (
            <span>{property.pageViews} views</span>
          )}
        </div>
      </div>
    </div>
  );
};