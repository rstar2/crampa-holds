<template>
 	 <b-container>
		<h2>List: <span>{{ count }}</span></h2>
		<b-list-group>
			<upload-list-item
				v-for="item of items" 
				v-bind:item="item"
				v-bind:key="item.id" 
				v-on:upload-list:remove="removeItem"
				v-bind:animate="animate">
			</upload-list-item>
		</b-list-group>
	</b-container>
</template>

<script>
import { mapGetters } from "vuex";
import FileUploadListItem from "./FileUploadListItem.vue";

export default {
  components: {
    "upload-list-item": FileUploadListItem
  },
  data() {
    return {
			// keep local property that will prevent initially the items to be animated
      animate: false
    };
  },

  // could use straight the $store in the template
  // but with computed properties the template is agnostic
  // whether the data is prom props, data or computed
  // One way is to access directly directly the store, BUT BETTER is to use the getters
  // euther explicitly if  not so many, or using the mapGetters utility
  // 1:
  //   computed: {
  //     items() {
  //       return this.$store.state.fileuploads;
  //     },
  //     count() {
  //       // access the getter 'fileuploadsCount' from the state
  //       return this.$store.state.fileuploads.length;
  //     }
  //   },
  // 2.
  //   computed: {
  //     items() {
  //       return this.$store.state.getters.fileuploads;
  //     },
  //     count() {
  //       // access the getter 'fileuploadsCount' from the state
  //       return this.$store.state.getters.fileuploadsCount;
  //     }
  //   },
  // 3. Easisest - save/use the names of the getters
  //   computed: mapGetters(["fileuploads", "fileuploadsCount"]),
  // 4. use different computed-properties names
  computed: mapGetters({
    items: "fileuploads",
    count: "fileuploadsCount",
    loaded: "isFileuploadsLoaded"
  }),

  methods: {
    removeItem(item) {
      this.$store.dispatch("removeFileUpload", { item });
    }
  },
  created() {
    console.log("Created FileUploadList");
  },
  mounted() {
    console.log("Mounted FileUploadList");

    if (!this.loaded) {
      this.$store.dispatch("listFileUpload");
    }
  },

  watch: {
    loaded(loaded) {
      if (loaded) {
        // this will allow later animation - after initial items are loaded and rendered
        this.$nextTick(() => this.animate = true);
      } else {
        this.animate = false;
      }
    }
  }
};
</script>

