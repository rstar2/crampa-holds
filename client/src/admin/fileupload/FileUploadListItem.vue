<template>
  <!-- appear appear-active-class="animated tada" -->
  <transition v-bind:css="animate" enter-active-class="animated tada" leave-active-class="animated bounceOutRight">
		<b-list-group-item>
			<a v-bind:href="item.file.url" download>{{ item.name }}</a>
			<b-button variant="danger" v-on:click.prevent="onRemove(item)" class="float-right">Delete</b-button>
		</b-list-group-item>class="float-left"
	</transition>
</template>

<script>
export default {
  props: {
    item: {},
    animate: { type: Boolean, default: false }
  },
  methods: {
    onRemove(item) {
      fetch(`/api/fileupload/${item.id}/remove`, {
        credentials: "same-origin",
        cache: "no-cache"
      })
        .then(r => {
          if (!r.ok) return Promise.reject("failed");
          return r.json();
        })
        .then(data => {
          const success = data.success === true;
          if (!success) {
            return Promise.reject("failed");
          }

          // remove from list
          this.$emit("upload-list:remove", item);
        })
        .catch(function(error) {
          alert("Failed to remove file-upload - " + error);
        });
    }
  }
};
</script>

