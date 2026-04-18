/**
 * Utility for standardized scoring logic and colors
 * Matches the Backend Scoring Engine (v1 Spec)
 */

export const getScoreColor = (score) => {
  if (score > 75) return "green";
  if (score >= 50) return "yellow";
  return "red";
};

export const getScoreColorClass = (score, mode = "all") => {
  const color = getScoreColor(score);
  const classes = {
    green: {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      all: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    yellow: {
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      all: "text-amber-600 bg-amber-50 border-amber-100"
    },
    red: {
      text: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
      all: "text-rose-600 bg-rose-50 border-rose-100"
    }
  };

  const selected = classes[color] || { text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100", all: "text-slate-600 bg-slate-50 border-slate-100" };
  return selected[mode] || selected.all;
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
