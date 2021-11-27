import { get, upload } from './requests';
import { findHost, SERVER_PLACEHOLDER } from './hosts';
import { writeSync } from 'clipboardy';
import { bold, green, red } from 'colors';

interface Options {
	host: string;
	copy: boolean;
}

export default async function run(filename: string, { host, copy }: Options) {
	let { url, getServerUrl, callback } = findHost('name', host);

	if (getServerUrl) {
		const body = JSON.parse((await get(getServerUrl)).body);
		if (body?.status == 'ok') url = url.replace(SERVER_PLACEHOLDER, body.data.server);
	}

	const { res, bar } = await upload(filename, url);

	bar.finish();

	const { success, message } = callback(res);
	console.log(`${success ? 'url' : red.bold('error')}: ${(success ? green : red)(`${bold.underline(message)}${copy && success ? ' (copied to clipboard)' : ''}`)}`);
	copy && success && writeSync(message);
}
