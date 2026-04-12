/**
 * Utility for standardized scoring logic and colors
 * Matches the Backend Scoring Engine (v1 Spec)
 */

export const getScoreColor = (score) => {
  if (score > 75) return "green";
  if (score >= 50) return "yellow";
  return "red";
};

export const getScoreColorClass = (score) => {
  const color = getScoreColor(score);
  switch (color) {
    case "green":
      return "text-green-600 bg-green-50 border-green-100";
    case "yellow":
      return "text-amber-600 bg-amber-50 border-amber-100";
    case "red":
      return "text-red-600 bg-red-50 border-red-100";
    default:
      return "text-slate-600 bg-slate-50 border-slate-100";
  }
};

export const getScoreBorderClass = (score) => {
  const color = getScoreColor(score);
  switch (color) {
    case "green":
      return "border-green-400";
    case "yellow":
      return "border-amber-400";
    case "red":
      return "border-red-400";
    default:
      return "border-slate-400";
  }
};

export const SCORING_WEIGHTS = {
  skills: 0.40,
  experience: 0.30,
  education: 0.15,
  ats: 0.15
};
