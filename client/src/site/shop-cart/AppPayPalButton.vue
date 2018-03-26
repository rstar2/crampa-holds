<template>
  <div id="paypal-button-container"></div>
</template>


<script>
/* globals paypal */

import { PAYPAL_STATE } from "./index";

export default {
  props: {
    mode: {
      type: String,
      required: true
    },
    createUrl: {
      type: String,
      required: true
    },
    executeUrl: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  watch: {
    state: function(newState) {
      if (newState === PAYPAL_STATE.READY) {
        console.log("Ready");
      }
    }
  },
  mounted() {
    const vm = this;
    paypal.Button.render(
      {
        // sandbox | production
        env: vm.mode || "sandbox",

        // Show the buyer a 'Pay Now' button in the checkout flow
        commit: true,

        // Specify the style of the button
        style: {
          label: "pay", // checkout | credit | pay | buynow | paypal
          fundingicons: true, // optional
          // branding: true,     // optional
          // layout: 'vertical', // horizontal | vertical
          size: "responsive" // small | medium | large | responsive
          // shape: 'rect',      // pill | rect
          // color: 'blue',      // gold | blue | silver | black,
          // tagline: true,
        },

        /**
         * Called when the button is clicked
         */
        payment: function(data, actions) {
          if (vm.state !== PAYPAL_STATE.READY) {
            return Promise.reject();
          }

          vm.$emit("stateChanged", PAYPAL_STATE.STARTED);

          // Make a call to the server to set up the payment
          return paypal.request.post(vm.createUrl).then(function(res) {
            vm.$emit("stateChanged", PAYPAL_STATE.CREATED);
            return res.paymentID;
          });
        },

        /**
         * Called when the buyer approves the payment
         */
        onAuthorize: function(data, actions) {
          // // Get the payment and buyer details
          // return actions.payment.get().then(function(payment) {
          // 	console.log('Payment details:', payment);
          // });

          // Set up the data you need to pass to your server
          const params = {
            paymentID: data.paymentID,
            payerID: data.payerID
          };

          // Make a call to your server to execute the payment
          return paypal.request
            .post(vm.executeUrl, params)
            .then(function(res) {
              vm.$emit("stateChanged", PAYPAL_STATE.SUCCESS);
            });
        },

        /**
         * Called for every click on the PayPal button.
         * For instance fire off any analytics beacons from here
         */
        onClick: function() {
          // Google analytics example (taken from https://developers.google.com/analytics/devguides/collection/analyticsjs/events)
          // ga('send', {
          // 	hitType: 'event',
          // 	eventCategory: 'Checkout',
          // 	eventAction: 'button_click'
          // });
        },

        /**
         * called when a buyer cancelled the payment
         */
        onCancel: function(data, actions) {
          vm.$emit("stateChanged", PAYPAL_STATE.CANCELED);
        },

        /**
         * Called when an error occurred during the transaction
         */
        onError: function(err) {
          vm.$emit("stateChanged", PAYPAL_STATE.FAILED);
        }
      },
      "#paypal-button-container"
    );
  }
};
</script>
