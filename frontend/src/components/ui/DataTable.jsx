import React from "react";

const DataTable = ({ columns, data, renderRow, emptyMessage = "No data available." }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-xs text-secondary uppercase tracking-widest font-bold">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-neutral-50/80 transition-colors group">
                  {renderRow(row, index)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-secondary">
                  <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">table_rows_narrow</span>
                  <p>{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
