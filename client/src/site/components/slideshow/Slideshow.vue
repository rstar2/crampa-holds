<template>
	<div>
		<swiper v-if="view" class="slideshowView" :options="{
    	      //slidesPerView: 3,
			  slidesPerView: count,
			  centeredSlides: true,
			  //autoHeight: true,
			  freeMode: true,
			  loop: loop,
			  loopedSlides: 0,
			  autoplay: autoplay > 0 ? {
    	        delay: autoplay,
    	        disableOnInteraction: false
    	      } : false,
			  navigation: navigation ? {
    	        nextEl: '.swiper-button-next',
	            prevEl: '.swiper-button-prev'
        	  } : {},
    	    }" ref="swiperView" @resize="onResize">	
    			<swiper-slide-responsive v-for="image of images" :key="image.url"
					:image="image" :size="size" :createThumbForSize="createThumbForSize" :lightbox="lightbox">
    			</swiper-slide-responsive>

				<div v-if="navigation" class="swiper-button-next swiper-button-white" slot="button-next"></div>
        		<div v-if="navigation" class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
  		</swiper>
		  
		<swiper v-if="thumbs" class="slideshowThumbs" :class="view ? 'mt-2' : ''" :options="{
          spaceBetween: 10,
          slidesPerView: 'auto',
          loop: loop,
          //loopedSlides: 5, //looped slides should be the same
          slideToClickedSlide: true,
        }" ref="swiperThumbs">
    			<swiper-slide v-for="image of images" :key="image">
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

import { LuminousGallery } from "luminous-lightbox";
import "luminous-lightbox/dist/luminous-basic.min.css";

export default {
  props: {
    images: {
      type: Array
    },
    autoplay: {
      type: Number,
      default: 0
    },
    count: {
      type: [String, Number],
      default: 1,
      validator: function(value) {
        const valid = typeof value === "string" ? value === "auto" : true;
        return valid;
      }
    },
    loop: {
      type: Boolean,
      // TODO: make it wokr with true and responsive slides/images
      default: false
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
    },

    lightbox: {
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
      props: ["image", "size", "createThumbForSize", "lightbox"],
      template: '<swiper-slide> <a :href="image"><img :src="thumbUrl"></a> </swiper-slide>',
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

    if (this.lightbox) {
      new LuminousGallery(this.$el.querySelectorAll(".slideshowView a"), {
        arrowNavigation: true
      });
    }
  }
};
</script>

<style lang="less">
// @import '~vue-l-carousel/dist/main.css';
// @import './slideshow.less';
</style>


