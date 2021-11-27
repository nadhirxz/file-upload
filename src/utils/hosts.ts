import { Response } from 'got/dist/source';

type Host = {
	name: string;
	url: string;
	default?: boolean;
	getServerUrl?: string;
	callback: (res: Response<string>) => {
		success: boolean;
		message: string;
	};
};

export const SERVER_PLACEHOLDER = '$$';

export const hosts: Array<Host> = [
	{
		name: 'anonfiles',
		url: 'https://api.anonfiles.com/upload',
		callback: res => ({ success: res.statusCode == 200, message: res.statusCode == 200 ? JSON.parse(res.body).data.file.url.short : JSON.parse(res.body).error.message }),
		default: true,
	},
	{
		name: 'gofile',
		url: `https://${SERVER_PLACEHOLDER}.gofile.io/uploadFile`,
		getServerUrl: 'https://api.gofile.io/getServer',
		callback: res => ({ success: res.statusCode == 200, message: res.statusCode == 200 ? JSON.parse(res.body).data.downloadPage : JSON.parse(res.body).status }),
	},
];

export const findHost = (key: keyof Host, value: Host[keyof Host]) => hosts.find(e => e[key] == value) || hosts[0];
