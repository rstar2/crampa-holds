<template>
  <!-- appear appear-active-class="animated tada" -->
  <transition leave-active-class="animated bounceOutRight">
		<b-list-group-item>
			<span>{{ cacheKey }}</span>
			<b-button variant="danger" v-on:click.prevent="onDelete" class="float-right">Delete</b-button>
			<b-button variant="info" v-on:click.prevent="onGet" class="float-right mr-2">Get</b-button>
		</b-list-group-item>
	</transition>
</template>

<script>
export default {
  props: {
    cacheKey: { type: String, required: true }
  },
  methods: {
    onGet() {
      this.$emit("cache-key:get");
    },
    onDelete() {
      this.$emit("cache-key:delete");
    }
  }
};
</script>

