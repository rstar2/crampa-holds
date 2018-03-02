<template>
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
</template>


<script>
import { bus } from './bus';

export default {
  data() {
    return {
      name: "Example name",
      file: null
    };
  },
  methods: {
    onUpload() {
      const data = new FormData();
      // This is the raw file that was selected
      data.append("file", this.file);
      // This is the name of the FileUpload
      data.append("name", this.name);

      fetch("/api/fileupload/create", {
        method: "POST",
        body: data,
        credentials: "same-origin",
        cache: "no-cache"
      })
        .then(r => {
          if (!r.ok) return Promise.reject("failed");
          return r.json();
        })
        .then(data => {
          const item = data.item;

          // add to list - the components are not child/parent
          // so a bus can be used (or Vuex/redux if necessary)
          bus.$emit("upload-list:add", item);
        })
        .catch(error => {
          alert("Failed to add new file-upload - " + error);
        });
    }
  }
};
</script>
