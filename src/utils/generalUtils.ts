/**
 * Capitalises the first letter of a string
 * @param {string} phrase - The string to capitalise
 * @returns {string} The input string with a capitalised first letter
 */
export const capitaliseFirstLetter = (phrase: string) => {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
};
