import Vue from 'vue';

// import the Bootstrap/BootstrapVue
// TODO: optimize and load only common/basic components/directives used globally
// and let different pages build upon that
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

// import the Bootstrap/BootstrapVue CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// import the FontAwesome core (without any icons)
import '@fortawesome/fontawesome';
