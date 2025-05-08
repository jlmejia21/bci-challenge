export function generateImdbLikeId(): string {
  const randomDigits = Math.floor(Math.random() * 1_0000_0000)
    .toString()
    .padStart(8, '0');
  return `tt${randomDigits}`;
}
