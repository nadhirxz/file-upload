import { AxiosResponse } from 'axios';

type Server = {
	name: string;
	url: string;
	default?: boolean;
	callback: (res: AxiosResponse<any, any>) => {
		success: boolean;
		message: string;
	};
};

export const servers: Array<Server> = [
	{
		name: 'anonfiles',
		url: 'https://api.anonfiles.com/upload',
		callback: res => ({ success: res.status == 200, message: res.status == 200 ? res.data.data.file.url.short : res.data.error.message }),
		default: true,
	},
];

export const findServer = (key: keyof Server, value: Server[keyof Server]) => servers.find(e => e[key] == value) || servers[0];
