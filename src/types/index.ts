export interface Property {
  id: number;
  county: string;
  region: string;
  area: string;
  beds: number;
  price: number;
  marketType: 'Residential Sale' | 'Residential Rent';
  rawAddress: string;
  saleDate: string;
  sqrMetres: number;
  pricePerSqrMetres: number;
  daysToSell?: number;
  pageViews?: number;
}

export interface PropertyResponse {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CountyAnalytics {
  [county: string]: {
    [beds: number]: {
      avg: number;
      yoy: number;
      count: number;
    };
  };
}

export interface MarketTrend {
  month: string;
  avgPrice: number;
  volume: number;
  rentPrice: number;
}

export interface Report {
  id: number;
  type: string;
  county: string;
  dateRange: string;
  generatedAt: string;
  data: {
    summary: {
      totalProperties: number;
      avgPrice: number;
      priceChange: string;
    };
    insights: string[];
  };
}

export interface PropertyFilters {
  county?: string;
  beds?: number;
  marketType?: string;
  search?: string;
}