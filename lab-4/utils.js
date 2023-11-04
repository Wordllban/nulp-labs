import { readFileSync } from 'fs';

export const readJSON = () => {
  const string = readFileSync(`data.json`, 'utf8');

  const json = JSON.parse(string);

  return json;
};
