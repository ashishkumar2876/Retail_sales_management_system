import React from 'react';
import { LayoutGrid, Globe, ArrowDownToLine, Circle, FileText } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-44 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 font-sans">
      
      {/* Brand */}
      <div className="h-14 flex items-center px-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-gray-900 leading-none">Vault</span>
            <span className="text-[9px] text-gray-400 mt-0.5 truncate">Anurag Yadav</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <MenuItem icon={<LayoutGrid size={15} />} label="Dashboard" active={true} />
        <MenuItem icon={<Globe size={15} />} label="Nexus" />
        <MenuItem icon={<ArrowDownToLine size={15} />} label="Intake" />

        <div className="mt-5 mb-1 px-2">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Services</p>
        </div>
        <MenuItem icon={<StatusIcon color="text-yellow-500" />} label="Pre-active" />
        <MenuItem icon={<StatusIcon color="text-green-500" />} label="Active" />
        <MenuItem icon={<StatusIcon color="text-red-500" />} label="Blocked" />
        <MenuItem icon={<StatusIcon color="text-gray-400" />} label="Closed" />

        <div className="mt-5 mb-1 px-2">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Invoices</p>
        </div>
        <MenuItem icon={<FileText size={15} />} label="Proforma" />
        <MenuItem icon={<FileText size={15} />} label="Final" />
      </nav>
    </div>
  );
};

const MenuItem = ({ icon, label, active }) => (
  <button
    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 group ${
      active 
        ? 'bg-gray-100 text-gray-900' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <span className={`${active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
      {icon}
    </span>
    {label}
  </button>
);

const StatusIcon = ({ color }) => (
  <Circle size={6} strokeWidth={4} className={color} />
);

export default Sidebar;