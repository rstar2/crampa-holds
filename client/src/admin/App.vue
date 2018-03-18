<template>
  	<div id="app" v-cloak>
		<div>
			<b-navbar toggleable="md" type="dark" variant="info">
				<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
				<b-navbar-brand href="/">{{brand}} - Admin</b-navbar-brand>

				<b-collapse is-nav id="nav_collapse">
					<b-navbar-nav>
						<b-nav-item to="/fileupload">FileUploads</b-nav-item>
						<b-nav-item to="/gallery">Gallery</b-nav-item>
						<b-nav-item to="/notify">Notify</b-nav-item>
					</b-navbar-nav>

					<!-- Right aligned nav items -->
					<b-navbar-nav class="ml-auto">
						<app-auth></app-auth>
					</b-navbar-nav>
				</b-collapse>
			</b-navbar>
		</div>

		<div>
			<router-view></router-view>
		</div>

	</div>
</template>

<script>
import AppAuth from "./components/auth/Auth";

export default {
  props: {
    brand: {
		type: String,
		default: '',
	},
    isAuthInit: {
		type: Boolean,
		default: false,
	},
  },
  components: {
    "app-auth": AppAuth
  }
};
</script>

