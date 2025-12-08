import React from 'react';
import Sidebar from '../components/Sidebar';
import { useSales } from '../hooks/useSales';
import { Search, ChevronDown, Info, Loader2, AlertCircle } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
};

const formatId = (id) => (!id ? '---' : id.substring(0, 8).toUpperCase());

const Dashboard = () => {
  const {
    data, loading, error, pagination, stats,
    search, setSearch,
    filters, filterOptions,
    handleFilterChange, handlePageChange
  } = useSales();

  // --- Date Range Logic (Last 1 to 6 Years) ---
  const handleDateFilter = (years) => {
    if (!years) {
        // Clear filters if "Date" or empty is selected
        handleFilterChange('startDate', '');
        handleFilterChange('endDate', '');
        return;
    }

    const end = new Date();
    const start = new Date();
    // Subtract X years from today
    start.setFullYear(end.getFullYear() - parseInt(years));

    handleFilterChange('startDate', start.toISOString().split('T')[0]);
    handleFilterChange('endDate', end.toISOString().split('T')[0]);
  };

  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const current = pagination.page;
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, '...', total];
    if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans text-gray-900">
      <Sidebar />

      {/* Main Content: Slimmer margin (ml-44) */}
      <div className="flex-1 ml-44 flex flex-col h-screen overflow-hidden">
        
        {/* --- HEADER --- */}
        <header className="px-6 py-4 bg-white border-b border-gray-200 shrink-0 shadow-sm z-20">
          
          {/* Top Row: Title & Search */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Sales Management System</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage and track your sales records efficiently.</p>
            </div>

            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={14} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, Phone no..."
                className="pl-9 pr-4 py-1.5 w-60 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 bg-gray-50 transition-all"
              />
            </div>
          </div>

          {/* Bottom Row: Filters & Sort */}
          <div className="flex items-center justify-between">
            
            {/* Filter Group: Using gap-1.5 to keep it tight and on one line */}
            <div className="flex flex-wrap gap-1.5 items-center">
                
                <FilterDropdown 
                    label="Region" value={filters.region} options={filterOptions.regions} 
                    onChange={(val) => handleFilterChange('region', val)} 
                />
                <FilterDropdown 
                    label="Gender" value={filters.gender} options={filterOptions.genders} 
                    onChange={(val) => handleFilterChange('gender', val)} 
                />
                <FilterDropdown 
                    label="Age" value={filters.ageRange} options={["0-18", "19-25", "26-45", "46-60", "60+"]} 
                    onChange={(val) => handleFilterChange('ageRange', val)} 
                />
                <FilterDropdown 
                    label="Category" value={filters.category} options={filterOptions.categories} 
                    onChange={(val) => handleFilterChange('category', val)} 
                />
                <FilterDropdown 
                    label="Tags" value={filters.tags} options={filterOptions.tags} 
                    onChange={(val) => handleFilterChange('tags', val)} 
                />
                <FilterDropdown 
                    label="Payment" value={filters.paymentMethod} options={filterOptions.paymentMethods} 
                    onChange={(val) => handleFilterChange('paymentMethod', val)} 
                />
                
                {/* --- UPDATED DATE DROPDOWN (Last 1-6 Years) --- */}
                <div className="relative inline-block text-left group">
                    <div className={`flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-full border border-transparent transition-all duration-200 ${
                        filters.startDate ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-200'
                    }`}>
                        <select 
                            className={`appearance-none bg-transparent border-none p-0 pr-4 focus:ring-0 cursor-pointer font-medium outline-none text-xs ${
                                filters.startDate ? 'text-white' : 'text-gray-600'
                            }`}
                            onChange={(e) => handleDateFilter(e.target.value)}
                        >
                            <option value="" className="text-gray-900">Date</option>
                            <option value="1" className="text-gray-900">Last 1 Year</option>
                            <option value="2" className="text-gray-900">Last 2 Years</option>
                            <option value="3" className="text-gray-900">Last 3 Years</option>
                            <option value="4" className="text-gray-900">Last 4 Years</option>
                            <option value="5" className="text-gray-900">Last 5 Years</option>
                            <option value="6" className="text-gray-900">Last 6 Years</option>
                        </select>
                        <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${filters.startDate ? 'text-white' : 'text-gray-400'}`} size={12} />
                    </div>
                </div>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2 text-gray-500 ml-auto pl-4 border-l border-gray-200 h-6">
                <span className="whitespace-nowrap text-xs font-medium">Sort by:</span>
                <div className="relative group">
                    <select 
                        className="font-medium text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer text-xs outline-none pr-5 appearance-none hover:text-blue-600 transition-colors"
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                    >
                        <option value="customerName_asc">Name (A-Z)</option>
                        <option value="date_desc">Date (Newest)</option>
                        <option value="totalAmount_desc">Amount (High-Low)</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                </div>
            </div>
          </div>
        </header>

        {/* --- BODY --- */}
        <main className="flex-1 px-6 py-4 overflow-hidden flex flex-col bg-[#F9FAFB]">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-4 shrink-0">
            <StatCard label="Total units sold" value={stats.totalUnits.toLocaleString()} subtext="Items" />
            <StatCard label="Total Amount" value={`₹ ${stats.totalAmount.toLocaleString()}`} subtext="Revenue" />
            <StatCard label="Total Discount" value={`₹ ${stats.totalDiscount.toLocaleString()}`} subtext="Saved" />
          </div>

          {/* Table Container */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
            
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Loader2 size={32} className="animate-spin mb-2" />
                  <p className="text-sm">Loading Data...</p>
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-red-500">
                  <AlertCircle size={32} className="mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : data.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <p className="text-sm">No records found matching your filters.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[1500px]">
                  <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
                    <tr>
                      {[
                        'Transaction ID', 'Date', 'Customer ID', 'Customer Name', 'Phone Number', 
                        'Gender', 'Age', 'Category', 'Qty', 'Total Amount', 
                        'Region', 'Product ID', 'Employee Name'
                      ].map((h, i) => (
                        <th key={i} className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.map((row) => (
                      <TableRow key={row._id} data={row} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-center gap-1.5 shrink-0 h-12">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 text-xs"
              >
                &lt;
              </button>
              
              {getPageNumbers().map((num, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof num === 'number' && handlePageChange(num)}
                  disabled={num === '...'}
                  className={`min-w-[28px] h-7 px-1 flex items-center justify-center rounded text-[11px] font-medium transition-all ${
                    num === pagination.page 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : num === '...' 
                        ? 'text-gray-400 cursor-default' 
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 text-xs"
              >
                &gt;
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Dropdown: Dark Grey Selection (bg-gray-800) ---
const FilterDropdown = ({ label, options, onChange, value }) => {
    const isSelected = value !== "" && value !== undefined;

    return (
        <div className="relative inline-block text-left group">
            <div className={`flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-full border border-transparent transition-all duration-200 ${
                isSelected ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-200'
            }`}>
                <select 
                    className={`appearance-none bg-transparent border-none p-0 pr-4 focus:ring-0 cursor-pointer font-medium outline-none text-xs ${
                        isSelected ? 'text-white' : 'text-gray-600'
                    }`}
                    onChange={(e) => onChange(e.target.value)}
                    value={value || ""}
                >
                    <option value="" className="text-gray-900">{label}</option>
                    {options?.map((opt, idx) => (
                        <option key={idx} value={opt} className="text-gray-900">{opt}</option>
                    ))}
                </select>
                <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${isSelected ? 'text-white' : 'text-gray-400'}`} size={12} />
            </div>
        </div>
    );
};

const StatCard = ({ label, value, subtext }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center h-20 relative hover:shadow-md transition-shadow">
    <div className="flex items-center gap-1 text-gray-500 mb-0.5">
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      <Info size={11} className="text-gray-400" />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-bold text-gray-900 tracking-tight">{value}</span>
      <span className="text-[10px] text-gray-400 font-medium">({subtext})</span>
    </div>
  </div>
);

const TableRow = ({ data }) => {
  return (
    // Dense Row Padding (py-2)
    <tr className="hover:bg-blue-50/50 transition-colors group border-b border-gray-50 last:border-none">
      <td className="px-4 py-2 text-[11px] text-gray-900 font-medium whitespace-nowrap font-mono">{formatId(data._id)}</td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap">{formatDate(data.date)}</td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap">{data.customerID}</td>
      <td className="px-4 py-2 text-[11px] text-gray-900 font-medium whitespace-nowrap max-w-[150px] truncate" title={data.customerName}>{data.customerName}</td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap">{data.phoneNumber}</td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap">
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${data.gender === 'Female' ? 'bg-pink-50 text-pink-700 border border-pink-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
          {data.gender}
        </span>
      </td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap">{data.age}</td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap">
        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-medium border border-gray-200">{data.productCategory}</span>
      </td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap font-medium pl-6">{data.quantity}</td>
      <td className="px-4 py-2 text-[11px] font-bold text-gray-900 whitespace-nowrap">₹{data.totalAmount?.toLocaleString()}</td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap">{data.customerRegion}</td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap font-mono">{data.productID}</td>
      <td className="px-4 py-2 text-[11px] text-gray-500 whitespace-nowrap">{data.employeeName}</td>
    </tr>
  );
};

export default Dashboard;