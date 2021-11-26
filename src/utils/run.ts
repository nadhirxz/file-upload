import { get, upload } from './requests';
import { findServer, SERVER_PLACEHOLDER } from './servers';
import { writeSync } from 'clipboardy';

interface Options {
	server: string;
	copy: boolean;
}

export default async function run(filename: string, { server, copy }: Options) {
	let { url, getServerUrl, callback } = findServer('name', server);

	if (getServerUrl) {
		const body = JSON.parse((await get(getServerUrl)).body);
		if (body?.status == 'ok') url = url.replace(SERVER_PLACEHOLDER, body.data.server);
	}

	const { res, bar } = await upload(filename, url);

	bar.finish();

	const { success, message } = callback(res);
	console.log(`${success ? 'url' : 'error'}: ${message}${copy && success ? ' (copied to clipboard)' : ''}`);
	copy && success && writeSync(message);
}
