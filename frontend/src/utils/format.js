export function formatCurrency(value){
  const num = Number(value) || 0
  // Use Indian Rupee symbol and two decimals
  return `₹${num.toFixed(2)}`
}
