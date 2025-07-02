// src/lib/utils.js

/**
 * Fisher–Yates shuffle
 * Takes an array and returns a new array with its items in random order.
 * @param {Array<T>} arr - The array to shuffle.
 * @returns {Array<T>} A new shuffled array.
 */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}