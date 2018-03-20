import axios from 'axios';
import { fail } from 'assert';

export function get (url, { vm, successAlert, failAlert, block = true } = {}) {
	return fetch(url, {
		credentials: 'same-origin',
		cache: 'no-cache',
	})
		.then(r => {
			if (!r.ok) return Promise.reject('failed');
			return r.json();
		})
		.then(data => {
			// the success prop is used when we just invoke some action on the server
			// and want to know whether it succeeded or not
			if (data.success !== undefined && data.success !== true) {
				return Promise.reject('failed');
			}
			showAlert(true, { vm: vm, alert: successAlert });
			return data;
		})
		.catch(error => {
			console.error(`Failed to GET from ${url} - because of ${error}`);
			showAlert(false, { vm: vm, alert: failAlert });
			throw error;
		});
}

export function post (url, data, { vm, successAlert, failAlert, block = true } = {}) {
	return fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(data),
		credentials: 'same-origin',
		cache: 'no-cache',
	})
		.then(r => {
			if (!r.ok) return Promise.reject('failed');
			showAlert(true, { vm, alert: successAlert });
			return r.json();
		}).catch(error => {
			console.error(`Failed to POST to ${url} - because of ${error}`);
			showAlert(false, { vm, alert: failAlert });
			throw error;
		});
};

export function upload (url, data, onUploadProgress, { vm, successAlert, failAlert, block = true } = {}) {
	const fd = new FormData();

	Object.keys(data).forEach(key => fd.append(key, data[key]));

	return axios.post(url, fd, {
		withCredentials: true,
		onUploadProgress,
	})
		.then(res => {
			// axios by default will 'accept' only responses with status 200>=status<300
			// others will be automatically 'rejected'
			// if (res.status !== 200) return Promise.reject("rejected");
			showAlert(true, { vm: vm, alert: successAlert });
			return res.data;
		})
		.catch(error => {
			console.error(`Failed to UPLOAD to ${url} - because of ${error}`);
			showAlert(false, { vm: vm, alert: failAlert });
			throw error;
		});
}


function showAlert (success, { vm, alert }) {
	if (vm && alert) {
		vm.$root.$emit('showAlert', {
			msg: alert,
			type: success ? 'info' : 'danger',
			timeout: success ? 3 : undefined,
		});
	}
}
