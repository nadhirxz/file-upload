import { AxiosResponse } from 'axios';

type Server = {
	name: string;
	url: string;
	default?: boolean;
	getServer?: string;
	callback: (res: AxiosResponse<any, any>) => {
		success: boolean;
		message: string;
	};
};

export const SERVER_PLACEHOLDER = '$$';

export const servers: Array<Server> = [
	{
		name: 'anonfiles',
		url: 'https://api.anonfiles.com/upload',
		callback: res => ({ success: res.status == 200, message: res.status == 200 ? res.data.data.file.url.short : res.data.error.message }),
		default: true,
	},
	{
		name: 'gofile',
		url: `https://${SERVER_PLACEHOLDER}.gofile.io/uploadFile`,
		getServer: 'https://api.gofile.io/getServer',
		callback: res => ({ success: res.status == 200, message: res.status == 200 ? res.data.data.downloadPage : res.data.status }),
	},
];

export const findServer = (key: keyof Server, value: Server[keyof Server]) => servers.find(e => e[key] == value) || servers[0];
