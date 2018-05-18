<template>
 	 <b-container>
		  <b-row>
			  <b-col><h2>Keys: <span>{{ keys ? keys.length : ''}}</span></h2></b-col>
			  <b-col cols="auto"><b-button @click="load">Load</b-button></b-col>
		  </b-row>
		
		<b-list-group>
			<app-cache-key
				v-for="key of keys" 
				v-bind:cache-key="key"
				v-bind:key="key" 
				v-on:cache-key:remove="remove(key)">
			</app-cache-key>
		</b-list-group>
	</b-container>
</template>

<script>
import * as api from '../../services/api';

import CacheKey from "./CacheKey.vue";

export default {
  components: {
    "app-cache-key": CacheKey
  },

  data() {
    return {
      keys: null,
    };
  },

 // TODO: Send real API requests
  methods: {
    remove(cacheKey) {
	  console.log("Cache remove key:", cacheKey);
	  
	  api.post('/api/cache/render/remove', {key: cacheKey})
		.then(data => {
			this.keys = this.keys.filter(key => key !== cacheKey);
		});
    },
    load() {
	  console.log("Cache load");

	  api.get('/api/cache/render/keys')
		.then(data => {
			this.keys = ["Key1", "Key2"];
		});
    }
  }
};
</script>

