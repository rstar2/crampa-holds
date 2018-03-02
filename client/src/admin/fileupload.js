import Vue from 'vue';
import App from './FileUpload.vue';

import 'animate.css';

import './fileupload.css';
import './fileupload.less';

const bus = new Vue();

Vue.component('upload-item', {
	template: `
		<b-container>
			<h1>Upload a new file</h1>
			<form>
				<div>
					<!-- Accept all image formats by IANA media type wildcard-->
					<b-form-file v-model="file" accept="image/*" placeholder="Choose a file..." class="mb-2"></b-form-file>	
					<b-form-input v-model.trim="name" type="text" placeholder="Enter your name" class="mb-2"></b-form-input>
				</div>
				<div>
					<b-button variant="success" v-on:click.prevent="onUpload" v-bind:disabled="!file">Upload</b-button>
				</div>
			</form>
		</b-container>
		`,
	data () {
		return {
			name: 'Example name',
			file: null,
		};
	},
	methods: {
		onUpload () {
			const data = new FormData();
			// This is the raw file that was selected
			data.append('file', this.file);
			// This is the name of the FileUpload
			data.append('name', this.name);

			fetch('/api/fileupload/create', {
				method: 'POST',
				body: data,
				credentials: 'same-origin',
				cache: 'no-cache',
			})
				.then(r => {
					if (!r.ok) return Promise.reject('failed');
					return r.json();
				})
				.then(data => {
					const item = data.item;

					// add to list - the components are not child/parent
					// so a bus can be used (or Vuex/redux if necessary)
					bus.$emit('upload-list:add', item);
				})
				.catch(error => {
					alert('Failed to add new file-upload - ' + error);
				});
		},
	},
});

Vue.component('upload-list', {
	template: `
		<b-container>
			<h2>Uploaded File List:</h2>
			<b-list-group>
				<upload-list-item
					v-for="item of items" 
					v-bind:item="item"
					v-bind:key="item.id" 
					v-on:upload-list:remove="removeFromList"
					v-bind:animate="loaded">
				</upload-list-item>
			</b-list-group>
		</b-container>
		`,
	data () {
		return {
			items: [],
			loaded: false,
		};
	},
	methods: {
		addToList (item) {
			// mutate
			// this.items.unshift(item);

			// immutable ?
			this.items = [item, ...this.items];
		},
		removeFromList (item) {
			// mutate
			// const index = this.items.indexOf(item);
			// if (index !== -1) {
			//	this.items.splice(index, 1);
			// }

			// immutable ?
			this.items = this.items.filter(el => el !== item);
		},
	},
	mounted () {
		bus.$on('upload-list:add', item => {
			this.addToList(item);
		});

		// load all current file-uploads
		fetch('/api/fileupload/list', {
			credentials: 'same-origin',
			cache: 'no-cache',
		})
			.then(r => {
				if (!r.ok) return Promise.reject('failed');
				return r.json();
			})
			.then(data => {
				const items = data.items;
				items.forEach(item => this.addToList(item));

				// this will allow later animation
				this.$nextTick(() => (this.loaded = true));
			})
			.catch(function (error) {
				alert('Failed to list file-uploads - ' + error);
			});
	},
});

Vue.component('upload-list-item', {
	template: `
			<transition v-bind:css="animate" enter-active-class="animated tada" leave-active-class="animated bounceOutRight">
			<b-list-group-item>
				<a v-bind:href="item.file.url" download>\{{ item.name }}</a>
			     - <a href="" v-on:click.prevent="onRemove(item)">Delete</a>
			</b-list-group-item>
			</transition>
			`, // appear appear-active-class="animated tada"
	props: {
		item: {},
		animate: { type: Boolean, default: false },
	},
	methods: {
		onRemove (item) {
			fetch(`/api/fileupload/${item.id}/remove`, {
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

					// remove from list
					this.$emit('upload-list:remove', item);
				})
				.catch(function (error) {
					alert('Failed to remove file-upload - ' + error);
				});
		},
	},
});

new Vue({
	el: '#app-admin-fileupload',
	render: h => h(App),
});
