<template>
  	<div>
    	<upload-new></upload-new>
		<hr>
		<upload-list></upload-list>
  </div>
</template>

<script>
import FileUploadNew from "./FileUploadNew.vue";
import FileUploadList from "./FileUploadList.vue";

export default {
  components: {
    "upload-new": FileUploadNew,
    "upload-list": FileUploadList
  }
};
</script>
