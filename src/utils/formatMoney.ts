export function formatMoney(amount: number, code: string) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(amount);
  }