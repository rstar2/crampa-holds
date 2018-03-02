<template>
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
</template>

<script>
import FileUploadListItem from "./FileUploadListItem.vue";

import { bus } from "./bus";

export default {
  components: {
    "upload-list-item": FileUploadListItem
  },
  data() {
    return {
      items: [],
      loaded: false
    };
  },
  methods: {
    addToList(item) {
      // mutate
      this.items.unshift(item);
    },
    removeFromList(item) {
      // mutate
      const index = this.items.indexOf(item);
      if (index !== -1) {
      	this.items.splice(index, 1);
      }
    }
  },
  mounted() {
    bus.$on("upload-list:add", item => {
      this.addToList(item);
    });

    // load all current file-uploads
    fetch("/api/fileupload/list", {
      credentials: "same-origin",
      cache: "no-cache"
    })
      .then(r => {
        if (!r.ok) return Promise.reject("failed");
        return r.json();
      })
      .then(data => {
        const items = data.items;
        items.forEach(item => this.addToList(item));

        // this will allow later animation
        this.$nextTick(() => (this.loaded = true));
      })
      .catch(function(error) {
        alert("Failed to list file-uploads - " + error);
      });
  }
};
</script>

