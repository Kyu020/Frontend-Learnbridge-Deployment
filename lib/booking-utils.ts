export const formatSessionDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else {
    const hours = minutes / 60;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "accepted": return "bg-blue-100 text-blue-700";
    case "completed": return "bg-green-100 text-green-700";
    case "rejected": return "bg-red-100 text-red-700";
    case "cancelled": return "bg-gray-100 text-gray-700";
    default: return "bg-gray-100 text-gray-700";
  }
};