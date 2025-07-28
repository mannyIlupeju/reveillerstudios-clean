export function humanizeText(input: string): string {
  // 1. Replace hyphens with space
  let result = input.replace(/-/g, ' ');

  // 2. Insert space before capital letters
  result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

  // 3. Insert space between repeated groups (for compound lowercase)
  result = result.replace(/([a-z]{3,})([a-z]{3,})/, '$1 $2');

  // 4. Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}