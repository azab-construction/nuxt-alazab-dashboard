export function mapPriorityColor(priority: string): string {
  switch (priority) {
    case "منخفضة":
      return "text-green-500";
    case "متوسطة":
      return "text-yellow-500";
    case "عالية":
      return "text-orange-500";
    case "حرجة":
      return "text-red-600";
    default:
      return "text-gray-400";
  }
}
