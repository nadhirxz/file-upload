import { createReadStream, lstatSync } from 'fs';
import FormData = require('form-data');
import got from 'got/dist/source';
import ProgressBar from './progress';

export const get = (url: string) => got.get(url);

export const upload = async (filename: string, url: string) => {
	const data = new FormData();
	data.append('file', createReadStream(filename));

	const filesize = Math.ceil(lstatSync(filename).size / 1000);
	const inMB = filesize > 1024;
	const divider = 1024 * (inMB ? 1024 : 1);
	const size = parseFloat(((filesize / divider) * 1024).toFixed(2));

	const bar = new ProgressBar(inMB, size, divider);

	const res = await got
		.post(url, {
			headers: data.getHeaders(),
			body: data,
			throwHttpErrors: false,
		})
		.on('uploadProgress', progress => bar.progress(progress));

	return { res, bar };
};
