import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';

// register the Vuex plugin
Vue.use(Vuex);

const state = {
	fileuploads: [],
};

const getters = {
	fileuploads (state) {
		return state.fileuploads;
	},
	// to all getters the state is always passed for us from Vuex
	fileuploadsCount (state) {
		return state.fileuploads.length;
	},
};

// 'mutations' are/SHOULD BE synchronous
// they are like "transactions" and only they are allowed to mutate the state
const mutations = {
	// the 'state' is always the first argument and a payload is always the second
	// so usage is:
	// store.commit('fileuploadAdd', item)
	// but it's good practice to pass the payload as object so that multiple fields can be passed
	// especially when using destructuring- store.commit('fileuploadAdd', { item })
	fileuploadAdd (state, { item }) {
		// mutate
		state.fileuploads.unshift(item);
	},

	fileuploadRemove (state, { item }) {
		// mutate
		const index = state.fileuploads.indexOf(item);
		if (index !== -1) {
			state.fileuploads.splice(index, 1);
		}
	},
};

const store = new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
});


export default store;
