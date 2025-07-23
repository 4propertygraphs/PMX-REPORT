import React from 'react';
import { Search } from 'lucide-react';
import { PropertyFilters as Filters } from '../../types';

interface PropertyFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const counties = [
  'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kerry', 'Mayo', 'Donegal',
  'Wicklow', 'Meath', 'Kildare', 'Wexford', 'Clare', 'Tipperary', 'Kilkenny'
];

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Properties</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by address or location..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            County
          </label>
          <select
            value={filters.county || ''}
            onChange={(e) => handleFilterChange('county', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Counties</option>
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <select
            value={filters.beds || ''}
            onChange={(e) => handleFilterChange('beds', e.target.value ? parseInt(e.target.value) : '')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((beds) => (
              <option key={beds} value={beds}>
                {beds} {beds === 1 ? 'Bedroom' : 'Bedrooms'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Market Type
          </label>
          <select
            value={filters.marketType || ''}
            onChange={(e) => handleFilterChange('marketType', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Residential Sale">For Sale</option>
            <option value="Residential Rent">For Rent</option>
          </select>
        </div>
      </div>
    </div>
  );
};