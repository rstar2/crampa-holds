<template>
  <div>
      <div class="d-block text-center">
        <h3>Username</h3>
        <h3>Password</h3>
      </div>
      <b-btn class="mt-3" variant="outline-success" block @click="$emit('action')">Sign In</b-btn>
      <b-btn class="mt-3" variant="outline-danger" block  @click="$emit('cancel')">Close</b-btn>
  </div>
</template>

<script>
export default {
  
};
</script>
