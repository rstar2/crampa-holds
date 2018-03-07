<template>
	<div>
		<div>
    	<b-button @click="showModal">{{ text }}</b-button>
    	<b-modal ref="myModalRef" hide-footer title="Using Component Methods">
				<div v-show="loading">
							<i class="fas fa-spinner fa-spin"></i>
				</div>
				<div v-show="!loading">
						<app-admin-auth-signout v-if="isAuth" v-on:cancel="hideModal" v-on:action="signOut"></app-admin-auth-signout>
						<app-admin-auth-signin v-else v-on:cancel="hideModal" v-on:action="signIn"></app-admin-auth-signin>
				</div>
    	</b-modal>
  	</div>
	</div>
</template>

<script>
// iport the Spinner FontAwesome icon
import fontawesome from '@fortawesome/fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
fontawesome.library.add(faSpinner);

import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default {
  components: {
    "app-admin-auth-signin": SignIn,
    "app-admin-auth-signout": SignOut
  },

  props: ["isAuth"],
  data() {
    return {
			loading: false,
		};
  },

  computed: {
    text() {
      return this.isAuth ? "Sign Out" : "Sign In";
    }
  },

  methods: {
    showModal() {
      this.$refs.myModalRef.show();
    },
    hideModal() {
      this.$refs.myModalRef.hide();
    },

    setLoading(loading) {
			this.loading = loading;
		},
    signIn() {
      console.log("Signing in");

      this.setLoading(true);
      new Promise(res => {
        setTimeout(res, 3000);
      })
        .then(() => {
          console.log("Signed in");
          this.hideModal();
        })
        .catch(() => this.setLoading(false));
    },
    signOut() {
      console.log("Signing out");

      this.setLoading(true);
      new Promise(res => {
        setTimeout(res, 3000);
      })
        .then(() => {
          console.log("Signed out");
          this.hideModal();
        })
        .catch(() => this.setLoading(false));
    }
  }
};
</script>
