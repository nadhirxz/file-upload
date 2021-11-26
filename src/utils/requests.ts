import { createReadStream, lstatSync } from 'fs';
import FormData = require('form-data');
import got from 'got/dist/source';
import { Bar } from 'cli-progress';

export const get = (url: string) => got.get(url);

export const upload = async (filename: string, url: string) => {
	const data = new FormData();
	data.append('file', createReadStream(filename));

	const filesize = Math.ceil(lstatSync(filename).size / 1000);
	const inMB = filesize > 1024;
	const divider = 1024 * (inMB ? 1024 : 1);
	const size = parseFloat(((filesize / divider) * 1024).toFixed(2));

	const bar = new Bar({
		format: `uploading [{bar}] {percentage}% | {value}/{total} ${inMB ? 'm' : 'k'}b | {speed} | Elapsed: {duration_formatted} | ETA: {eta_formatted}`,
		barIncompleteChar: ' ',
	});

	bar.start(size, 0, { speed: 0 });

	let time = new Date().getTime();
	let uploaded = 0;

	const res = await got
		.post(url, {
			headers: data.getHeaders(),
			body: data,
		})
		.on('uploadProgress', progress => {
			const transferred = progress.transferred;
			const speed = (transferred - uploaded) / (new Date().getTime() - time);

			time = new Date().getTime();
			uploaded = transferred;

			bar.update(parseFloat((transferred / divider).toFixed(2)), {
				speed: `${parseFloat((Number.isFinite(speed) ? (speed > 1024 ? speed / 1024 : speed) : 0).toFixed(2))} ${Number.isFinite(speed) && speed > 1024 ? 'm' : 'k'}b/s`,
			});
		});

	return { res, bar, size };
};
