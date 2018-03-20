<template>
 	 <b-container>
		  <b-row>
			  <b-col><h2>List: <span>{{ count }}</span></h2></b-col>
			  <b-col cols="auto"><b-button @click="loadItems">Refresh</b-button></b-col>
		  </b-row>
		
		<b-list-group>
			<app-upload-list-item
				v-for="item of items" 
				v-bind:item="item"
				v-bind:key="item.id" 
				v-on:upload-list-item:remove="removeItem(item)"
				v-bind:animate="animate">
			</app-upload-list-item>
		</b-list-group>
	</b-container>
</template>

<script>
import { mapGetters } from "vuex";
import FileUploadListItem from "./FileUploadListItem.vue";

export default {
  components: {
    "app-upload-list-item": FileUploadListItem
  },
  data() {
    return {
      // keep local property that will prevent initially the items to be animated
      animate: false
    };
  },

  computed: mapGetters({
    items: "fileuploads",
    count: "fileuploadsCount",
    loaded: "isFileuploadsLoaded"
  }),

  methods: {
    removeItem(item) {
      this.$store.dispatch("fileUploadRemove", { item }).catch(() => {
        this.$root.$emit("showAlert", {
          type: "danger",
          msg: "Failed to remove a file-upload"
        });
      });
    },
    loadItems() {
      this.$store.dispatch("fileUploadList").catch(() => {
        this.$root.$emit("showAlert", {
          type: "danger",
          msg: "Failed to get file-uploads list"
        });
      });
    }
  },
  mounted() {
    if (!this.loaded) {
      this.loadItems();
    } else {
      this.animate = true;
    }
  },

  watch: {
    loaded(isLoaded) {
      if (isLoaded) {
        // this will allow later animation - after initial items are loaded and rendered
        this.$nextTick(() => (this.animate = true));
      } else {
        this.animate = false;
      }
    }
  }
};
</script>

