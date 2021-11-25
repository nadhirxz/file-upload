import axios from 'axios';
import { createReadStream } from 'fs';
import FormData = require('form-data');

axios.defaults.validateStatus = () => true;

export const get = (url: string) => axios.get(url);

export const upload = (filename: string, url: string) => {
	const data = new FormData();
	data.append('file', createReadStream(filename));

	return axios.post(url, data, { headers: data.getHeaders() });
};
