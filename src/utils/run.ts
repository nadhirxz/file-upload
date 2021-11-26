import { get, upload } from './requests';
import { findServer, SERVER_PLACEHOLDER } from './servers';
import { writeSync } from 'clipboardy';

export default async function run(filename: string, server: string) {
	let { url, getServerUrl, callback } = findServer('name', server);

	if (getServerUrl) {
		const body = JSON.parse((await get(getServerUrl)).body);
		if (body?.status == 'ok') url = url.replace(SERVER_PLACEHOLDER, body.data.server);
	}

	const { res, bar, size } = await upload(filename, url);

	bar.update(size);
	bar.stop();

	const { success, message } = callback(res);
	console.log(`${success ? 'url' : 'error'}: ${message}${success ? ' (copied to clipboard)' : ''}`);
	success && writeSync(message);
}
