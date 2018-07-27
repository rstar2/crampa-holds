<template>

<div class="container-fluid">
	<div class="row">
		<div v-for="image of images" :key="image.url" class="col-12 col-sm-6 col-md-4 col-lg-3">
			<a :href="image.url" class="d-block my-3 gallery-item">
				<img :src="createThumb(image.url, 150, 150)">
				
				<div class="gallery-item-hover-effect">
					<i class="fas fa-search"></i>
				</div>
			</a>
		</div>
	</div>
</div>
	
</template>

<script>
// https://github.com/imgix/luminous
import { LuminousGallery } from "luminous-lightbox";

import "luminous-lightbox/dist/luminous-basic.min.css";
import "./gallery.less";

export default {
  props: ["images"],

  methods: {
    createThumb(url, width = 300, height = 300) {
      return `${url}?dim=${width}x${height}`;
    }
  },

  mounted() {
    new LuminousGallery(this.$el.querySelectorAll(".gallery-item"), {
      // Whether pressing the arrow keys should move to the next/previous slide.
      arrowNavigation: true
    });
  }
};
</script>

<style lang="less">
// @import "~luminous-lightbox/dist/luminous-basic.min.css";
// @import "./gallery.less";
</style>

