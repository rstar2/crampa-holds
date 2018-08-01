<template>

<div class="container-fluid">
	<div class="row">
		<!-- vue-carousel -->
		<carousel :paginationEnabled="pagination" :navigationEnable="navigation"
					:scrollPerPage="false"
					:perPage="count"
					:autoplay="autoplayTimeout > 0"
					:autoplayTimeout="autoplayTimeout"
					:autoplayHoverPause="autoplayHoverPause"
					:loop="true">
			<slide v-for="(image, index) of images" :key="image.url" :index="index">
    			<div >
					<img :src="createThumb(image.url)">
			  	</div>
  			</slide>
		</carousel>

		<!-- vue-carousel-3d -->
		<!-- <carousel-3d  :controlsVisible="navigation"
					:display="count"
					:autoplay="autoplayTimeout > 0"
					:autoplayTimeout="autoplayTimeout"
					:autoplayHoverPause="autoplayHoverPause"
					:disable3d="true"
					:dir="'ltr'"
					>
			<slide-3d v-for="(image, index) of images" :key="image.url" :index="index">
    			<div >
					<img :src="createThumb(image.url)">
			  	</div>
  			</slide-3d>
		</carousel-3d> -->

		<!-- vue-l-carousel -->
		<!-- <carousel-l :watch-items="images" :dots="pagination" 
					:auto="autoplayTimeout" 
					:loop="true">
        	<carousel-item v-for="image in images" :key="image.url">
            	<div>
					<img :src="createThumb(image.url)">
			  	</div>
        	</carousel-item>
    	</carousel-l> -->


	</div>
</div>
	
</template>

<script>
// https://github.com/imgix/luminous
import Vue from 'vue';

import { Carousel, Slide } from 'vue-carousel';
// import { Carousel3d, Slide as Slide3d } from 'vue-carousel-3d';
// import { Carousel as CarouselL, CarouselItem } from 'vue-l-carousel';

// import 'vue-l-carousel/dist/main.css';
// import './slideshow.less';

export default {
  props: {
	  images: {
		  type: Array
	  },
	  autoplayTimeout: {
		  type: Number,
		  default: 3000
	  },
	  autoplayHoverPause: {
		  type: Boolean,
		  default: true
	  },

	  count: {
		  type: Number,
		  default: 5
	  },
	  pagination: {
		  type: Boolean,
		  default: false
	  },
	  navigation: {
		  type: Boolean,
		  default: true
	  },


  },

  components: {
	   Carousel, Slide,
	//    Carousel3d, Slide3d,
	//    CarouselL, CarouselItem,
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

<style lang="less">
@import '~vue-l-carousel/dist/main.css';
</style>


