<template>
	<div>
    	<b-button @click="showModal">{{ action }}</b-button>
    	<b-modal ref="myModalRef" :title="action" 
			no-fade centered hide-footer no-close-on-backdrop hide-header-close>

			<b-row align-h="center" align-v="center"> <!-- e.g. class="justify-content-center align-items-center" -->
        		<b-col cols="auto" v-show="loading" class="mb-2">
					<i class="fas fa-spinner fa-spin"></i>
				</b-col>
				<b-col v-if="error">
					<b-alert show variant="danger">{{ error }}</b-alert>
				</b-col>
			</b-row>

			<div v-if="!isAuth" class="d-block text-center">
        		<b-form-input v-model.trim="email" type="text" placeholder="Email" class="mb-2"></b-form-input>
        		<b-form-input v-model.trim="password" type="password" placeholder="Password" class="mb-2"></b-form-input>
      		</div>
			<b-btn class="mt-3" variant="outline-success" block @click="doAction">{{ action }}</b-btn>
			<b-btn class="mt-3" variant="outline-danger" block  @click="hideModal">Close</b-btn>				
    	</b-modal>
  	</div>
</template>

<script>
import _ from "lodash";

// import the Spinner FontAwesome icon
import fontawesome from "@fortawesome/fontawesome";
import faSpinner from "@fortawesome/fontawesome-free-solid/faSpinner";
fontawesome.library.add(faSpinner);

import { mapGetters } from "vuex";

const animatedIn = "animated rollIn";
const animatedOut = "animated rollOut";

export default {
  data() {
    return {
      loading: false,
	  error: null,
	  
	  email: null,
	  password: null,

      modalDialogClassAnimateShow: "",
      modalDialogClassAnimateHide: ""
    };
  },

  computed: {
    ...mapGetters(["isAuth"]),
    action() {
      return this.isAuth ? "Sign Out" : "Sign In";
    }
  },

  mounted() {
	const modalDialog = this.$refs.myModalRef.$el;
	const modalDialogClass = this.$refs.myModalRef.$el.classList;
	this.modalDialogClassAnimateShow = modalDialogClass + animatedIn;
	this.modalDialogClassAnimateHide = modalDialogClass + animatedOut;
  },

  methods: {
    setState({ loading, error }) {
      if (!_.isUndefined(loading)) {
        this.loading = loading;
      }
      if (!_.isUndefined(error)) {
        this.error = error;
      }
    },

    showModal() {
      this.setState({ error: null });
      this.$refs.myModalRef.show();
    },
    hideModal() {
      this.$refs.myModalRef.hide();
    },

    doAction() {
      this.setState({ loading: true, error: null });

      new Promise((res, rej) => {
        setTimeout(rej, 3000000);
      })
        .then(() => {
          this.$store.dispatch("authChange", { isAuth: !this.isAuth });
          this.hideModal();
        })
        .catch(() =>
          this.setState({
            loading: false,
            error: `Failed to sign ${this.isAuth ? "out" : "in"}`
          })
        );
    },

    // change the show animation

    show() {
      const modalDialog = this.$refs.myModalRef.$el;
      modalDialog.classList = this.modalDialogClassAnimateShow;
    },

    hide() {
      const modalDialog = this.$refs.myModalRef.$el;
      modalDialog.classList = this.modalDialogClassAnimateHide;
    }
  }
};
</script>
