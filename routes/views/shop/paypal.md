# PayPal payment methods

## Classic Payment Button

See:
1. https://developer.paypal.com/docs/integration/web/

Using special PayPal button inside 
```<FORM action="https://www.paypal.com/cgi-bin/webscr" method="post">```
No server side - payments are created and handled entirely from the client.
This method is used like in www.flippcrashpads.com.
Multiple options can be specified (e.g. for additional shipping prices and etc.), all the order's info will be available in from the PayPal business account (e.g. the seller account).
Shop's logo and etc can be added in the PayPal business account settings to customize the checkout view of PayPal

## Express Checkout using REST API 

See:
1. https://developer.paypal.com/docs/integration/direct/express-checkout/integration-jsv4/
1. https://www.youtube.com/watch?v=7k03jobKGXM
1. https://github.com/paypal/PayPal-node-SDK
1. https://developer.paypal.com/developer/accounts
1. https://www.sandbox.paypal.com/signin

### Client Side Express Checkout using REST
### Server Side Express Checkout using REST
### Express Checkout using Braintree SDK
