<template>
	<div>
		<swiper v-if="view" class="slideshowView" :options="{
    	      //slidesPerView: 3,
			  slidesPerView: count,
			  centeredSlides: true,
			  autoHeight: true,
			  freeMode: true,
			  loop: true,
			  autoplay: {
    	        delay: autoplayTimeout > 0 ? autoplayTimeout : undefined,
    	        disableOnInteraction: false
    	      }
    	    }" ref="swiperView" @resize="onResize">
    			<swiper-slide-responsive v-for="image of images" :key="image.url"
					:image="image" :size="size" :createThumbForSize="createThumbForSize">
    			</swiper-slide-responsive>
  		</swiper>
		  
		<swiper v-if="thumbs" class="slideshowThumbs" :options="{
          spaceBetween: 10,
          slidesPerView: 4,
          touchRatio: 0.2,
          loop: true,
          loopedSlides: 5, //looped slides should be the same
          slideToClickedSlide: true,
        }" ref="swiperThumbs">
    			<swiper-slide v-for="image of images" :key="image.url">
					<img :src="createThumb(image, '', 150)">
    			</swiper-slide>
  		</swiper>


	</div>


</template>

<script>
import Vue from "vue";

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
    count: {
      default: 1
    },
    pagination: {
      type: Boolean,
      default: false
    },
    navigation: {
      type: Boolean,
      default: true
	},
	
    thumbs: {
      type: Boolean,
      default: false
    },
    view: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      size: 0
    };
  },

  components: {
    swiper,
    swiperSlide,
    swiperSlideResponsive: {
      components: { swiperSlide },
      props: ["image", "size", "createThumbForSize"],
      template: '<swiper-slide><img :src="thumbUrl"></swiper-slide>',
      computed: {
        thumbUrl() {
          return this.createThumbForSize(this.image, this.size);
        }
      },
      watch: {
        // size(newValue, oldValue) {
        //   console.log(newValue, oldValue);
        // },
        // thumbUrl(newValue, oldValue) {
        //   console.log(newValue, oldValue);
        // }
      }
    }
  },

  methods: {
    createThumbForSize(url, size) {
      size = size || this.size;
      let height = 300;

      if (size > 400) height = 400;
      if (size > 500) height = 500;

      return this.createThumb(url, "", height);
    },

    createThumb(url, width, height) {
      return `${url}?dim=${width}x${height}`;
    },

    onResize() {
      this.size = this.$el.clientHeight;
    }
  },

  mounted() {
	  // if thumbs are needed create a Two-Way controlling between the two swipers
    if (this.thumbs) {
      this.$nextTick(() => {
        const swiperTop = this.$refs.swiperView.swiper;
        const swiperThumbs = this.$refs.swiperThumbs.swiper;
        swiperTop.controller.control = swiperThumbs;
        swiperThumbs.controller.control = swiperTop;
      });
    }

    this.onResize();
  }
};
</script>

<style lang="less">
// @import '~vue-l-carousel/dist/main.css';
// @import './slideshow.less';
</style>


