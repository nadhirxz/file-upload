import { existsSync, lstatSync } from 'fs';

export const fileExists = (filename: string) => existsSync(filename) && lstatSync(filename).isFile();
