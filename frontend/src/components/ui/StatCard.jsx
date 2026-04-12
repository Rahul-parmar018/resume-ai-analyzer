const StatCard = ({ title, value, icon, insight, insightPositive = true }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>
        {/* Optional small top-right badge if needed, currently empty */}
      </div>
      <p className="text-secondary text-sm font-medium mb-1">{title}</p>
      <div className="flex items-end gap-3">
        <h3 className="font-heading text-3xl font-bold text-primary">{value}</h3>
      </div>
      
      {/* Insight Line: Premium AI Feel */}
      {insight && (
        <div className={`mt-4 text-xs font-semibold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 ${
          insightPositive ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          <span className="material-symbols-outlined text-[14px]">
            {insightPositive ? 'trending_up' : 'trending_down'}
          </span>
          {insight}
        </div>
      )}
    </div>
  );
};

export default StatCard;
