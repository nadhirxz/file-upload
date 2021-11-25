#!/usr/bin/env typescript
import { Option, program } from 'commander';
import axios from 'axios';
import { fileExists } from './utils/files';
import { findServer, servers } from './utils/servers';
import { createReadStream } from 'fs';
import FormData = require('form-data');

axios.defaults.validateStatus = () => true;

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
	let { url, callback } = findServer('name', server);

	const data = new FormData();
	data.append('file', createReadStream(filename));

	const res = await axios.post(url, data, { headers: data.getHeaders() });
	const { success, message } = callback(res);
	console.log(`${success ? 'url' : 'error'}: ${message}`);
}
