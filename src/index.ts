#!/usr/bin/env typescript
import { Option, program } from 'commander';
import { fileExists } from './utils/files';
import { findServer, servers, SERVER_PLACEHOLDER } from './utils/servers';
import { get, upload } from './utils/requests';

program
	.version('0.1.0')
	.description('Simple Node.js CLI tool to upload files')
	.argument('<filename>', 'file to upload')
	.addOption(new Option('-s, --server <server>', 'server to upload to').choices(servers.map(e => e.name)).default(findServer('default', true).name))
	.action(filename => {
		if (fileExists(filename)) {
			run(filename, program.opts().server);
		} else {
			console.log(`${filename} doesn't exist`);
		}
	})
	.parse();

async function run(filename: string, server: string) {
	let { url, getServerUrl, callback } = findServer('name', server);

	if (getServerUrl) {
		const { data } = await get(getServerUrl);
		if (data?.status == 'ok') url = url.replace(SERVER_PLACEHOLDER, data.data.server);
	}

	const res = await upload(filename, url);

	const { success, message } = callback(res);
	console.log(`${success ? 'url' : 'error'}: ${message}`);
}
