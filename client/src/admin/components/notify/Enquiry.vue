<template>
	<form validated @submit.prevent="test">
		<b-row class="w-75">
			<b-col cols="12" md="6">
				<b-form-input v-model.trim="name.first" type="text" placeholder="First Name" class="mb-2"></b-form-input>
			</b-col>
			<b-col cols="12" md="6">
				<b-form-input v-model.trim="name.last" type="text" placeholder="Last Name" class="mb-2"></b-form-input>
			</b-col>
			<b-col cols="12" md="6">
				<b-form-input v-model.trim="phone" type="tel" placeholder="Your phone" class="mb-2"></b-form-input>
			</b-col>
			<b-col cols="12" md="6">
				<b-form-input v-model.trim="email" type="email" required placeholder="Your email" class="mb-2"></b-form-input>
			</b-col>
		
			<b-col cols="12">
				<b-form-textarea v-model.trim="message" :rows="3" type="text" required placeholder="Enter message" class="mb-2"></b-form-textarea>
			</b-col>
			
			<!-- TODO: This b-checkbox forces re-rendering of Athe main #app element - why ? -->
			<b-col cols="12" class="mb-2">
				<b-form-checkbox v-model="isSMS">SMS</b-form-checkbox>
			</b-col>
		
			<b-col cols="auto">
				<b-button variant="success" type="submit">Test</b-button>
			</b-col>
		</b-row>
		<BlockUI v-show="isLoading" message="Testing..."></BlockUI>
	</form>
</template>

<script>
import * as api from "../../services/api";

export default {
  data() {
    return {
      isSMS: false,
      name: {
        first: "",
        last: ""
      },
      phone: "",
      email: "",
      message: "",

      isLoading: false
    };
  },
  watch: {
    isLoading(newValue) {
      // TODO: make isLoading more common - move to router/App and crontroll with every ajax request/response
      // to disable the current active router's component - or use the common Bus
      if (newValue) {
        this.oldElPosition = this.$el.style.position;
        this.$el.style.position = "relative";
      } else {
        this.$el.style.position = this.oldElPosition;
        delete this.oldElPosition;
      }
    }
  },
  methods: {
    test() {
      this.isLoading = true;
      api.post("/api/notify/enquiry/email", this.$data, {
          vm: this,
          successAlert: "Test email sent",
          failAlert: "Failed to send test email"
        })
        .then(() => (this.isLoading = false));
    }
  }
};
</script>
