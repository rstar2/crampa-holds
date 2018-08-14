<template>
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
          }
        }" ref="swiper" @resize="onResize">
    		<swiper-slide-responsive v-for="image of images" :key="image.url"
				:image="image" :size="size" :createThumbForSize="createThumbForSize">
    		</swiper-slide-responsive>
  	</swiper>


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
    this.onResize();
  }
};
</script>

<style lang="less">
// @import '~vue-l-carousel/dist/main.css';
// @import './slideshow.less';
</style>


