import { Option, program } from 'commander';
import { fileExists } from './utils/files';
import { findServer, servers } from './utils/servers';
import run from './utils/run';

program
	.version('0.1.0')
	.description('Simple Node.js CLI tool to upload files')
	.argument('<filename>', 'file to upload')
	.addOption(new Option('-s, --server <server>', 'server to upload to').choices(servers.map(e => e.name)).default(findServer('default', true).name))
	.option('-nc, --no-copy', 'disable copying file url to clipboard after upload')
	.action(filename => {
		if (fileExists(filename)) return run(filename, program.opts());
		console.log(`${filename} doesn't exist`);
	})
	.parse();
