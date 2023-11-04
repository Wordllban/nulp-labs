import { ReadStream } from 'fs';

type GenerateRandomStringOptions = {
  customKeyName: string | number;
  customKeyValue: () => any;
};

export const generateRandomString = (
  key?: string,
  options?: GenerateRandomStringOptions[],
) => {
  if (key) {
    for (const option of options) {
      if (key === option.customKeyName) {
        return option.customKeyValue();
      }
    }
  }
  return (Math.random() + 1).toString(36).substring(7);
};

export const generateCsvData = (
  keys: string[],
  limit: number,
  randomStringOptions?: GenerateRandomStringOptions[],
): string => {
  let title: string = '';
  let data: string = '';
  const maxKeyIndex = keys.length - 1;
  keys.forEach((key, index) => {
    if (index === maxKeyIndex) {
      title += `${key}\r\n`;
    } else {
      title += `${key},`;
    }
  });

  // generate row limit times
  for (let i = 0; i < limit; i += 1) {
    let string = '';
    // generate data for each column
    for (let j = 0; j <= maxKeyIndex; j += 1) {
      if (j === maxKeyIndex) {
        string += generateRandomString(keys[j], randomStringOptions);
      } else {
        string += `${generateRandomString(keys[j], randomStringOptions)},`;
      }
    }

    if (i !== limit - 1) {
      data += `${string}\r\n`;
    } else {
      data += string;
    }
  }

  return title + data;
};

export const mergeMultipleCsvStrings = (strings: string[]) => {
  return strings.join('\r\n---\r\n');
};

export const asyncStream = (
  stream: ReadStream,
  parser: (value: string) => any[],
) => {
  let parsedChunks = [];
  return new Promise((res, rej) => {
    stream
      .on('data', (data) => {
        const tables = data.toString().split('---');
        tables.forEach((table) => {
          const parsedValue = parser(table);
          parsedChunks = [...parsedChunks, [...parsedValue]];
        });
      })
      .on('error', (error) => rej(error))
      .on('end', () => res(parsedChunks));
  });
};
