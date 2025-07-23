import React, { useState, useEffect } from 'react';
import { PropertyFilters } from './PropertyFilters';
import { PropertyCard } from './PropertyCard';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';
import { PropertyFilters as Filters } from '../../types';

export const Properties: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(1);
  
  const { data, loading, error } = useApi(
    () => apiService.getProperties(filters, page, 12),
    [filters, page]
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading properties</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
        <p className="mt-1 text-sm text-gray-600">
          Browse and filter property listings across Ireland
        </p>
      </div>

      <PropertyFilters filters={filters} onFiltersChange={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {data?.properties.length || 0} of {data?.total || 0} properties
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Page {page} of {data.totalPages}
              </span>
              
              <button
                onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};