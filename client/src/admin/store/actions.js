import axios from 'axios';

function createFileUpload (context, { file, name, onUploadProgress }) {
	const data = new FormData();
	// This is the raw file that was selected
	data.append('file', file);
	// This is the name of the FileUpload
	data.append('name', name);

	// fetch has no upload-progress support
	//   fetch("/api/fileupload/create", {
	//     method: "POST",
	//     body: data,
	//     credentials: "same-origin",
	//     cache: "no-cache"
	//   })
	//     .then(r => {
	//       if (!r.ok) return Promise.reject("failed");
	//       return r.json();
	//     })
	//     .then(data => {
	//       const item = data.item;

	//       // add to list - the components are not child/parent
	//       // so a bus can be used (or Vuex/redux if necessary)
	//       bus.$emit("upload-list:add", item);
	//     })
	//     .catch(error => {
	//       alert("Failed to add new file-upload - " + error);
	// 	});
	return axios.post('/api/fileupload/create', data, {
		withCredentials: true,
		onUploadProgress,
	})
		.then(res => {
			// axios by default will 'accept' only responses with status 200>=status<300
			// others will be automatically 'rejected'
			// if (res.status !== 200) return Promise.reject("rejected");
			return res.data;
		})
		.then(data => {
			context.commit('fileuploadAdd', { item: data.item });
		})
		.catch(error => {
			alert('Failed to add new file-upload - ' + error);
		});
}

function removeFileUpload (context, { item }) {
	return fetch(`/api/fileupload/${item.id}/remove`, {
		credentials: 'same-origin',
		cache: 'no-cache',
	})
		.then(r => {
			if (!r.ok) return Promise.reject('failed');
			return r.json();
		})
		.then(data => {
			const success = data.success === true;
			if (!success) {
				return Promise.reject('failed');
			}

			context.commit('fileuploadRemove', { item });
		})
		.catch(function (error) {
			alert('Failed to remove file-upload - ' + error);
			throw error;
		});

}

function listFileUpload (context) {
	// load all current file-uploads
	return fetch('/api/fileupload/list', {
		credentials: 'same-origin',
		cache: 'no-cache',
	})
		.then(r => {
			if (!r.ok) return Promise.reject('failed');
			return r.json();
		})
		.then(data => {
			const items = data.items;
			items.forEach(item => context.commit('fileuploadAdd', { item }));
		})
		.catch(function (error) {
			alert('Failed to list file-uploads - ' + error);
			throw error;
		});
}

function authSignIn (context, data) {
	if (context.state.isAuth) {
		return Promise.resolve();
	}

	return fetch('/api/auth/signin', {
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
			return r.json();
		})
		.then(data => {
			// commit/change the isAuth state
			context.commit('authChange', { isAuth: true });
		});
}

function authSignOut (context, { email, password }) {
	if (!context.state.isAuth) {
		return Promise.resolve();
	}

	return fetch('/api/auth/signout', {
		credentials: 'same-origin',
		cache: 'no-cache',
	})
		.then(r => {
			if (!r.ok) return Promise.reject('failed');
			return r.json();
		})
		.then(data => {
			// commit/change the isAuth state
			context.commit('authChange', { isAuth: false });
		});
}


// on the other hand actions can be asynchronous
// and finally they can commit mutations that finally update the state
export default {
	createFileUpload, removeFileUpload, listFileUpload,
	authSignIn, authSignOut,
};
