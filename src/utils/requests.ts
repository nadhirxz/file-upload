import { createReadStream } from 'fs';
import FormData = require('form-data');
import got from 'got/dist/source';

export const get = (url: string) => got.get(url);

export const upload = (filename: string, url: string) => {
	const data = new FormData();
	data.append('file', createReadStream(filename));

	return got.post(url, {
		headers: data.getHeaders(),
		body: data,
	});
};
