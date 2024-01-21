export function isObject(object: unknown): object is Record<string, unknown> {
  return !!object && !Array.isArray(object) && typeof object === 'object';
}

/* eslint-disable no-param-reassign */
export function merge(...objects: unknown[]): unknown {
  return objects.reduce((current: Record<string, unknown>, object) => {
    if (!isObject(object)) return current;

    Object.keys(object).forEach((key) => {
      const currentValue = current[key];
      const objectValue = object[key];

      if (isObject(currentValue) && isObject(objectValue)) {
        current[key] = merge(currentValue, objectValue);
      } else if (Array.isArray(objectValue)) {
        current[key] = objectValue.slice(0);
      } else {
        current[key] = objectValue;
      }
    });

    return current;
  }, {});
}
/* eslint-enable no-param-reassign */

export function cssStylesToObject(styles: string): Record<string, string> {
  const reactStyles: Record<string, string> = {};
  styles.split(';').forEach((style) => {
    const [key, value] = style.split(':').map((s) => (s ? s.trim() : s));
    if (!key || !value) return;
    const camelcaseKey = key.replace(/(-\w)/g, (word: string) =>
      word[1].toUpperCase(),
    );
    reactStyles[camelcaseKey] = value;
  });
  return reactStyles;
}

export function snakeToCamel(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .split(/_/g)
    .map((segment, idx) => {
      const firstLetter = segment.slice(0, 1);
      const rest = segment.slice(1);
      return `${firstLetter[
        idx === 0 ? 'toLowerCase' : 'toUpperCase'
      ]()}${rest.toLowerCase()}`;
    })
    .join('');
}

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

const excludedKeys = ['_id'];

export function keysToCamel(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => keysToCamel(item));
  }

  const json: Record<string, any> = obj as Record<string, any>;
  const newObj: Record<string, any> = {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  Object.keys(obj).forEach((key) => {
    if (excludedKeys.includes(key)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      newObj[key] = json[key];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      newObj[snakeToCamel(key)] = keysToCamel(json[key]);
    }
  });

  return newObj;
}
/* eslint-enable @typescript-eslint/no-unsafe-return */
/* eslint-enable @typescript-eslint/no-explicit-any */

export function camelToSnake(string: string, splitOnNumbers = true): string {
  return string.replace(
    splitOnNumbers ? /[A-Z0-9]/g : /[A-Z]/g,
    (letter) => `_${letter.toLowerCase()}`,
  );
}

export function camelToWords(string: string): string {
  return string.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`);
}

export function wordToCamel(value: string): string {
  return value
    .trim()
    .split(/ /g)
    .map((segment, idx) => {
      const firstLetter = segment.slice(0, 1);
      const rest = segment.slice(1);
      return `${firstLetter[
        idx === 0 ? 'toLowerCase' : 'toUpperCase'
      ]()}${rest.toLowerCase()}`;
    })
    .join('');
}

export function camelKeysToSnake(
  obj: Record<string, unknown>,
  splitOnNumbers = true,
): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (newObj, [key, value]) => ({
      ...newObj,
      [camelToSnake(key, splitOnNumbers)]: value,
    }),
    {},
  );
}

export function nameToInitials(name: string): string {
  // Basic function to create initials from a name.
  // - Not smart to detect if index = 1 is middlename or lastname
  // - If name is one word, it uses two first letters of that single word
  const nameParts = name.replace(/\t/g, ' ').trim().split(' ');
  return nameParts.length === 1
    ? nameParts[0].split('').slice(0, 2).join('') || ''
    : `${nameParts[0][0]}${nameParts.slice(-1)[0][0]}`;
}

function titleCaseWord(word: string): string {
  if (word.toLowerCase() === 's ') {
    // Assumes this is the single "s" after an "'s",
    // so want to keep it lowercase.
    return word.toLowerCase();
  }
  return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
}

export function titleCase(name: string | null): string {
  if (!name) return '';

  // Transform to title case
  const basicCapitalize = name
    .split(' ')
    .map(
      (part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`,
    )
    .join(' ');

  return basicCapitalize
    .replace(/[^\s\-']+[\s\-']*/g, (word: string) => titleCaseWord(word))
    .replace(/\b(Van|De|Der|Da|Von)\b/g, (nobiliaryParticle) =>
      nobiliaryParticle.toLowerCase(),
    )
    .replace(/\b(And|To|The|From|Of|At|For|By|On|With|In)\b/g, (specialCase) =>
      // Some special cases:
      // - `TO`, `THE` and `EDITOR` LETTERS TO THE EDITOR
      // - `AND` in case `AUTHOR1 AND AUTHOR2`
      specialCase.toLowerCase(),
    )
    .replace(
      /Mc(.)/g,
      (_match, letter3: string) => `Mc${letter3.toUpperCase()}`,
    )
    .replace(/^(\w{1})/g, (firstLetter: string) => firstLetter.toUpperCase());
}
