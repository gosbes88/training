import Vue from "vue";
import {getErrorMessage} from "../../../../../common/common.vue/src/utils/DeveloperUtils";

let testParticipantResource;

setTimeout(() => {
    const testActions = {
        surveysGet: {method: 'GET', url: '/training/service/rest/p/tests{/type}'}
    };
    testParticipantResource = Vue.resource('/training/service/rest/p{/type}', {}, testActions);
}, 0);

export default {
    async getTestsByParticipant({ commit }) {
        try {
            const response = await testParticipantResource.surveysGet({type: ""});
            commit('fillTests', {values: response.body});
        } catch (e) {
            getErrorMessage(e, 'Ошибка при загрузке тестирований участника');
        }
    },
    async getTestAction({ commit, getters }) {
        try {
            const response = await Vue.http.get(`/training/service/rest/p/tests/${getters.routeParams.id}/getTest`);
            commit('fillTest', {values: response.body});
        } catch (e) {
            getErrorMessage(e, `Ошибка при загрузке тестирования ${getters.routeParams.id}`);
        }
    }
}
