const ScoreCircle = ({ score, sizeClass = "w-32 h-32", label = "Match" }) => {
  // Determine color based on score
  let colorClass = "text-green-500";
  let bgGradient = "from-green-400 to-green-600";
  
  if (score < 60) {
    colorClass = "text-red-500";
    bgGradient = "from-red-400 to-red-600";
  } else if (score < 80) {
    colorClass = "text-yellow-500";
    bgGradient = "from-yellow-400 to-yellow-600";
  }

  // Pure CSS calculation for the conic gradient based on score percentage
  const gradientStyle = {
    background: `conic-gradient(var(--tw-gradient-stops) ${score}%, #f1f5f9 ${score}%)`
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`relative ${sizeClass} rounded-full flex items-center justify-center ${bgGradient}`}
        style={gradientStyle}
      >
        {/* Inner circle to make it a donut */}
        <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <span className={`font-heading font-bold text-3xl ${colorClass}`}>{score}%</span>
          {label && <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">{label}</span>}
        </div>
      </div>
    </div>
  );
};

export default ScoreCircle;
