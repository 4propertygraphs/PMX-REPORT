import { Property, PropertyResponse, CountyAnalytics, MarketTrend, Report, PropertyFilters } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getProperties(filters: PropertyFilters = {}, page = 1, limit = 20): Promise<PropertyResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    });

    return this.fetchData<PropertyResponse>(`/properties?${params}`);
  }

  async getCountyAnalytics(): Promise<CountyAnalytics> {
    return this.fetchData<CountyAnalytics>('/analytics/county');
  }

  async getRentAnalytics(): Promise<CountyAnalytics> {
    return this.fetchData<CountyAnalytics>('/analytics/rent');
  }

  async getMarketTrends(): Promise<MarketTrend[]> {
    return this.fetchData<MarketTrend[]>('/insights/market-trends');
  }

  async generateReport(type: string, county?: string, dateRange?: string): Promise<Report> {
    const params = new URLSearchParams({
      type,
      ...(county && { county }),
      ...(dateRange && { dateRange })
    });

    return this.fetchData<Report>(`/reports/generate?${params}`);
  }

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return this.fetchData<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();