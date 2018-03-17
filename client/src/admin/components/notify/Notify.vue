<template>
  	<b-container>
		<h1>Test email notification for Enquiry</h1>
		<form validated @submit.prevent="test">
			<b-row class="w-50">
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
				
				<b-col cols="auto">
					<b-button variant="success" type="submit">Test</b-button>
				</b-col>
			</b-row>
		</form>
	</b-container>
</template>

<script>
export default {
  data() {
    return {
      name: {
        first: '',
        last: '',
      },
      phone: '',
      email: '',
      message: ''
    };
  },
  methods: {
    test() {
      fetch("/api/notify/enquiry/email", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(this.$data),
        credentials: "same-origin",
        cache: "no-cache"
      })
        .then(r => {
          if (!r.ok) return Promise.reject("failed");
          return r.json();
        })
        .then(data => {
          const success = data.success === true;
          if (!success) {
            return Promise.reject("failed");
          }
        })
        .then(() => {
          this.$root.$emit("showAlert", {
            msg: "Test email sent"
          });
        })
        .catch(error => {
          this.$root.$emit("showAlert", {
            type: "danger",
            msg: "Failed to send test email"
          });
        });
    }
  }
};
</script>
