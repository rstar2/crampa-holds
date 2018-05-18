<template>
  <!-- appear appear-active-class="animated tada" -->
  <transition leave-active-class="animated bounceOutRight">
		<b-list-group-item>
			<span>{{ cacheKey }}</span>
			<b-button variant="danger" v-on:click.prevent="onRemove" class="float-right">Delete</b-button>
		</b-list-group-item>
	</transition>
</template>

<script>
export default {
  props: {
    cacheKey: { type: String, required: true }
  },
  methods: {
    onRemove() {
      this.$emit("cache-key:remove");
    }
  }
};
</script>

