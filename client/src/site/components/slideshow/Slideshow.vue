<template>

		<!-- vue-carousel -->
		<!-- <carousel :paginationEnabled="pagination" :navigationEnable="navigation"
					:scrollPerPage="false"
					:perPage="count"
					:autoplay="false && autoplayTimeout > 0"
					:autoplayTimeout="autoplayTimeout"
					:autoplayHoverPause="autoplayHoverPause"
					:loop="true">
			<slide v-for="image of images" :key="image">
    			<div >
					<img :src="createThumb(image)">
			  	</div>
  			</slide>
		</carousel> -->

		<!-- vue-carousel-3d -->
		<!-- <carousel-3d  :controlsVisible="navigation"
					:display="count"
					:autoplay="autoplayTimeout > 0"
					:autoplayTimeout="autoplayTimeout"
					:autoplayHoverPause="autoplayHoverPause"
					:disable3d="true"
					:dir="'ltr'"
					>
			<slide-3d v-for="(image, index) of images" :key="image.url">
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

		<swiper :options="{
          //slidesPerView: 3,
		  slidesPerView: 'auto',
		  centeredSlides: true,
		  autoHeight: true,
		  breakpoints: {
            1024: {
              //slidesPerView: 3,
			  //spaceBetween: 10
            },
            768: {
              //slidesPerView: 2,
            },
            640: {
              //slidesPerView: 1,
            },
            320: {
              //slidesPerView: 1,
            }
          },
		  freeMode: true,
		  loop: true,
		  autoplay: {
            delay: autoplayTimeout > 0 ? autoplayTimeout : undefined,
            disableOnInteraction: false
          },
        }" ref="mySwiper" @resize="onResize">
    		<swiper-slide v-for="image of images" :key="image.url">
				<div class="slide-img">
					<img :src="createThumb(image, '', 600)">
			  	</div>
			</swiper-slide>
  		</swiper>


</template>

<script>
import Vue from "vue";

// import { Carousel, Slide } from 'vue-carousel';

// import { Carousel3d, Slide as Slide3d } from 'vue-carousel-3d';

// import { Carousel as CarouselL, CarouselItem } from 'vue-l-carousel';
// import 'vue-l-carousel/dist/main.css';

import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

import "./slideshow.less";

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
    }
  },

  components: {
    //    Carousel, Slide,

    //    Carousel3d, Slide3d,
    //    CarouselL, CarouselItem,

    swiper,
    swiperSlide
  },

  methods: {
    createThumb(url, width, height) {
      return `${url}?dim=${width}x${height}`;
	},
	
	onResize(event) {
		console.log("On swiper event", event)
	},
  },

  mounted() {}
};
</script>

<style lang="less">
// @import '~vue-l-carousel/dist/main.css';
// @import './slideshow.less';
</style>


