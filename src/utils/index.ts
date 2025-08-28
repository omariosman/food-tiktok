// Utility functions
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString();
};

export const formatVideoCount = (count: number) => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};