<template>
	<video-player  class="vjs-custom-skin"
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @ended="onPlayerEnded($event)"
            @loadeddata="onPlayerLoadeddata($event)"
            @waiting="onPlayerWaiting($event)"
            @playing="onPlayerPlaying($event)"
            @timeupdate="onPlayerTimeupdate($event)"
            @canplay="onPlayerCanplay($event)"
            @canplaythrough="onPlayerCanplaythrough($event)"
            @ready="onPlayerReady($event)"
            @statechanged="onPlayerStateChanged($event)">
    </video-player>
</template>

<script>
import Vue from "vue";

// import "video.js/dist/video-js.css";

import { videoPlayer } from "vue-video-player";

export default {
  components: {
    videoPlayer
  },
  props: {
    url: String,
    type: {
      type: String,
      default: "video/mp4"
    },
    poster: String,

    height: String,
    width: String,

    autoplay: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // videojs options
      playerOptions: {
        height: this.height,
        width: this.width,
        autoplay: this.autoplay,
        muted: this.muted,
        //language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: this.type,
            src: this.url
          }
        ],
        poster: this.poster
      }
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  methods: {
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    onPlayerEnded(player) {
      // console.log('player ended!', player)
    },
    onPlayerLoadeddata(player) {
      // console.log('player Loadeddata!', player)
    },
    onPlayerWaiting(player) {
      // console.log('player Waiting!', player)
    },
    onPlayerPlaying(player) {
      // console.log('player Playing!', player)
    },
    onPlayerTimeupdate(player) {
      // console.log('player Timeupdate!', player.currentTime())
    },
    onPlayerCanplay(player) {
      // console.log('player Canplay!', player)
    },
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },
    // or listen state event
    onPlayerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },
    // player is ready
    onPlayerReady(player) {
      //console.log("example player 1 readied", player);
      // seek to 10s
      //   player.currentTime(10);
    }
  }
};
</script>

<style lang="less">
@import '~video.js/dist/video-js.css';
@import './video.less';
</style>


