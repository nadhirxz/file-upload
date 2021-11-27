import { Option, program } from 'commander';
import { fileExists } from './utils/files';
import { findHost, hosts } from './utils/hosts';
import run from './utils/run';
import { bold, underline } from 'colors';

program
	.version('0.1.0')
	.description('Simple Node.js CLI tool to upload files')
	.argument('<filename>', 'file to upload')
	.addOption(new Option('-h, --host <host>', 'hosting service').choices(hosts.map(e => e.name)).default(findHost('default', true).name))
	.option('-nc, --no-copy', 'disable copying file url to clipboard after upload')
	.action(filename => {
		if (fileExists(filename)) return run(filename, program.opts());
		console.log(bold.red(`error: ${underline(filename)} doesn't exist`));
	})
	.parse();
