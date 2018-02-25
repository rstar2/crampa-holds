const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * File Upload Model
 * ===========
 * A database model for uploading files to the local file system
 */

const FileUpload = new keystone.List('FileUpload', {
	track: true,
});

// The nested schema is based on the schema provided by the Storage Adapter,
// which for the FS adapter defaults to:
// {
// 	filename: String,
// 	size: Number,
// 	mimetype: String,
// 	path: String,
// 	originalname: String,
// 	url: String,
// }
const localStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: keystone.expandPath('uploads/files'),
		publicPath: '/uploads/files',
	},
	schema: {
		path: true,
		originalname: true,
		url: true,
	},
});

FileUpload.add({
	name: { type: Types.Key, index: true },
	file: { type: Types.File, storage: localStorage },
	category: { type: String },
	priorityId: { type: String },
});

FileUpload.defaultColumns = 'name';
FileUpload.register();
