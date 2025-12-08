import { useState, useEffect } from 'react';
import { fetchSales, fetchOptions } from '../services/api';
import useDebounce from './useDebounce'; 

export const useSales = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stats State
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0
  });

  // Dynamic Dropdown Options
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    categories: [],
    genders: [],
    paymentMethods: [],
    tags: [] 
  });

  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [search, setSearch] = useState('');
  
  // --- UPDATED FILTERS STATE ---
  // Added: tags, ageRange, startDate, endDate to match your new UI
  const [filters, setFilters] = useState({
    region: '',
    gender: '',
    category: '',
    paymentMethod: '',
    tags: '',        // <--- NEW
    ageRange: '',    // <--- NEW
    startDate: '',   // <--- NEW
    endDate: '',     // <--- NEW
    sort: 'date_desc' 
  });

  const debouncedSearch = useDebounce(search, 500);

  // 1. Load Filter Options on Mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await fetchOptions();
        if (response?.success) {
            setFilterOptions(response.data);
        }
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    loadOptions();
  }, []);

  // 2. Fetch Data & Stats (Triggered by any filter change)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Combine pagination, search, and all filters into query params
      const params = {
        page: pagination.page,
        limit: 10,
        search: debouncedSearch,
        ...filters 
      };
      
      const response = await fetchSales(params);
      
      if (response?.success) {
        setData(response.data || []);
        
        // Update Stats from backend aggregation
        setStats(response.stats || { totalUnits: 0, totalAmount: 0, totalDiscount: 0 });
        
        // Update Pagination
        setPagination(prev => ({
          ...prev,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || 0,
          page: Number(response.pagination?.currentPage) || prev.page
        }));
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, debouncedSearch, filters]);

  // --- Handlers ---

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
  };

  return {
    data, loading, error, pagination, stats,
    search, setSearch,
    filters, filterOptions,
    handleFilterChange, handlePageChange
  };
};