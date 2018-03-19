import * as api from '../services/api';

function fileUploadCreate (context, { file, name, onUploadProgress }) {
	if (!context.state.isAuth) {
		return Promise.reject('Not Authorized yet');
	}

	// file -This is the raw file that was selected
	// name - This is the name of the FileUpload
	return api.upload('/api/fileupload/create', { file, name }, onUploadProgress)
		.then(data => {
			context.commit('fileuploadAdd', { item: data.item });
		});
}

function fileUploadRemove (context, { item }) {
	if (!context.state.isAuth) {
		return Promise.reject('Not Authorized yet');
	}

	return api.get(`/api/fileupload/${item.id}/remove`)
		.then(data => {
			context.commit('fileuploadRemove', { item });
		});
}

function fileUploadList (context) {
	if (!context.state.isAuth) {
		return Promise.reject('Not Authorized yet');
	}

	// load all current file-uploads
	return api.get('/api/fileupload/list')
		.then(data => {
			const items = data.items;
			context.commit('fileuploadsSet', { items });

			context.commit('fileuploadsLoaded');
		});
}

function authSignIn (context, data) {
	if (context.state.isAuth) {
		return Promise.resolve();
	}

	return api.post('/api/auth/signin', data)
		.then(data => {
			// commit/change the isAuth state
			context.commit('authChange', { isAuth: true });
		});
}

function authSignOut (context, { email, password }) {
	if (!context.state.isAuth) {
		return Promise.resolve();
	}

	return api.get('/api/auth/signout')
		.then(data => {
			// commit/change the isAuth state
			context.commit('authChange', { isAuth: false });
		});
}


// on the other hand actions can be asynchronous
// and finally they can commit mutations that finally update the state
export default {
	fileUploadCreate, fileUploadRemove, fileUploadList,
	authSignIn, authSignOut,
};
