import Vue from 'vue';
import Vuex from 'vuex';
import state from './State';
import getters from './Getters';
import mutations from './Mutations';
import actions from './Actions';
import manager from './manager';
import participant from './participant';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    mutations,
    actions,
    modules: {
        manager,
        participant
    }
});
