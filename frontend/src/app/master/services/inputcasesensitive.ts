export function transformFirstLetterCapsAndRestLower(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return '';
  }
  return trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
}

export function transformFirstWordCaps(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      return '';
    }

    const words = trimmedValue.split(' ');
    if (words.length === 0) {
      return '';
    }

    const firstWord = words[0];
    const restOfWords = words.slice(1).join(' ');

    const transformedFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();

    return transformedFirstWord + (restOfWords ? ' ' + restOfWords : '');
  }