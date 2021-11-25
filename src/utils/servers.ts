import { Response } from 'got/dist/source';

type Server = {
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

export const servers: Array<Server> = [
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

export const findServer = (key: keyof Server, value: Server[keyof Server]) => servers.find(e => e[key] == value) || servers[0];
