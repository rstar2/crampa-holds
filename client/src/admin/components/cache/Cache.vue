<template>
 	 <b-container>
		  <b-row class="my-2">
			  <b-col><h2>Keys: <span>{{ keys ? keys.length : ''}}</span></h2></b-col>
			  <b-col cols="auto"><b-button @click="load">Load</b-button></b-col>
			  <b-col cols="auto"><b-button class="float-right" variant="danger" @click="purge">Purge</b-button></b-col>
		  </b-row>
		
		<b-list-group>
			<app-cache-key
				v-for="key of keys" 
				v-bind:cache-key="key"
				v-bind:key="key" 
				v-on:cache-key:delete="del(key)"
				v-on:cache-key:get="get(key)">
			</app-cache-key>
		</b-list-group>
	</b-container>
</template>

<script>
import * as api from "../../services/api";

import CacheKey from "./CacheKey.vue";

export default {
  components: {
    "app-cache-key": CacheKey
  },

  data() {
    return {
      keys: null
    };
  },

  methods: {
    load() {
      console.log("Cache load");

      api.get("/api/cache/render/list").then(data => {
        this.keys = data.keys;
      });
    },

    purge() {
      console.log("Cache purge");

      api.post("/api/cache/render/purge").then(() => {
        this.keys = [];
      });
    },

    del(cacheKey) {
      console.log("Cache delete key:", cacheKey);

      api.post("/api/cache/render/delete", { key: cacheKey }).then(data => {
        if (data.count > 0) {
          this.keys = this.keys.filter(key => key !== cacheKey);
        }
      });
    },

    get(cacheKey) {
      console.log("Cache delete key:", cacheKey);

      api.post("/api/cache/render/get", { key: cacheKey }).then(data => {
        if (value) {
        } else {
        }
      });
    }
  }
};
</script>

