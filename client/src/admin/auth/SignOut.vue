<template>
  <div>
    <div>
      <b-btn class="mt-3" variant="outline-success" block @click="$emit('action')">Sign Out</b-btn>
      <b-btn class="mt-3" variant="outline-danger" block @click="$emit('cancel')">Close</b-btn>
  	</div>
  </div>
</template>

<script>
export default {
};
</script>
