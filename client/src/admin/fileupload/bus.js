import Vue from 'vue';

// export a common bus that will be used to send events from
// FileUploadNew to FileUploadList (not parent-child related components)
// TODO: Consider using either global state-store or Redux/Vuex
export const bus = new Vue();
