<template>
  	<div id="app">
			<b-navbar toggleable="md" type="dark" variant="info">
				<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
				<b-navbar-brand to="/">{{brand}} - Admin</b-navbar-brand>

				<b-collapse is-nav id="nav_collapse">
					<b-navbar-nav>
						<b-nav-item to="/fileupload">FileUploads</b-nav-item>
						<b-nav-item to="/gallery">Gallery</b-nav-item>
						<b-nav-item-dropdown text="Notify">
							<b-dropdown-item to="/notify/enquiry">Enquiry</b-dropdown-item>
							<b-dropdown-item to="/notify/order">Order</b-dropdown-item>
						</b-nav-item-dropdown>
						<b-nav-item to="/cache">Cache</b-nav-item>
					</b-navbar-nav>

					<!-- Right aligned nav items -->
					<b-navbar-nav class="ml-auto">
						<app-auth></app-auth>
					</b-navbar-nav>
				</b-collapse>
			</b-navbar>

			<!--
				Pass the Router a key (he full path) - so that it will not play smart and reuse
				components between routes when they are the same. Let them be created from scratch.
				This is a little overhead for the compnentents BUT much more-predictable and safe.
			 -->
			<router-view :key="$router.fullPath"></router-view>

			<BlockUI v-show="blockUI.isEnabled" v-bind="blockUI">
				<!-- <div class="spinnerWrap" style="
						display: flex; align-items: center; justify-content: center;
            height: 15rem;
            margin-bottom: 5rem;">
					<spinner :status="true" color="#4fc08d" :size="200"></spinner>
				</div> -->
			</BlockUI>

	</div>
</template>

<script>
import AppAuth from "./components/auth/Auth";

export default {
  props: {
    brand: {
      type: String,
      default: ""
    },
    isAuthInit: {
      type: Boolean,
      default: false
    },
    /* All blockUI props are repassed */
    blockUI: {
      type: Object,
      // object/array defaults should be returned from a factory function
      default: function() {
        return {};
      }
    },

    // vue-meta properties
    metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: "Admin Rumen",
      // all titles will be injected into this template
      titleTemplate: "%s | My Awesome Webapp",

      htmlAttrs: {
        foo: "bar",
        amp: undefined
      }, // renders as:  <html foo="bar" amp></html>

      bodyAttrs: {
        bar: "baz"
      }, // renders as: <body bar="baz"></body>

      base: { target: "_blank", href: "/" }, // renders as <base target="_blank" href="/">

      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ]
      // renders as: <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1">
    }
  },
  components: {
    "app-auth": AppAuth
  }
};
</script>

