<template>

<div class="container-fluid">
	<div class="row">
		<carousel :paginationEnabled="false"
					:autoplay="autoplay"
					:autoplayTimeout="autoplayTimeout"
					:autoplayHoverPause="autoplayHoverPause"
					:display="5">
			<slide v-for="(image, index) of images" :key="image.url" :index="index">
    			<div >
					<img :src="createThumb(image.url)">
			  	</div>
  			</slide>
		</carousel>
	</div>
</div>
	
</template>

<script>
// https://github.com/imgix/luminous
import Vue from 'vue';

// import { Carousel, Slide } from 'vue-carousel';
import { Carousel3d as Carousel, Slide } from 'vue-carousel-3d';
import "./slideshow.less";

export default {
  props: {
	  images: {
		  type: Array
	  },
	  autoplay: {
		  type: Boolean,
		  default: true
	  },
	  autoplayTimeout: {
		  type: Number,
		  default: 3000
	  },
	  autoplayHoverPause: {
		  type: Boolean,
		  default: true
	  },

  },

  components: {
	   Carousel, Slide
  },

  methods: {
    createThumb(url, width = 300, height = 300) {
      return `${url}?dim=${width}x${height}`;
    }
  },

  mounted() {
  }
};
</script>

