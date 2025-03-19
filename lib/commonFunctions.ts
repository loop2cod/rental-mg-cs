export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

 export const convertTo24HourFormat = (time: string) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
  
    if (hours === "12") {
      hours = "00";
    }
  
    if (modifier === "PM") {
      hours = String(Number(hours) + 12);
    }
  
    return `${hours}:${minutes}`;
  };