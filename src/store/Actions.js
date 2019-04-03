import Vue from "vue";
import { BASE_URL, FORM_HEADERS } from "../utils/Constants";
import { fillFormData, getErrorMessage } from "../../../../common/common.vue/src/utils/DeveloperUtils";
import commonActions from "../../../../common/common.vue/src/store/Actions";

export default {
    ...commonActions,
    async changeOrganization({ commit, dispatch, state, getters }, id) {
        try {
            const response = await Vue.http.post('/as/service/rest/user/change-organization', fillFormData({organizationId: id}), FORM_HEADERS);
            if (response.status === 200) {
                window.location = window.location.origin + BASE_URL;
            }
        } catch (e) {
            console.error(e);
        }
    },
    async getUserStatistics({ commit }) {
        try {
            //TODO: позднее поставить правильный url
            const response = await Vue.http.get('/training/service/rest/tests/user/statistics');
            commit('setUserStatistics', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'Ошибка получения статистики юзера(просмотр напоминалки, прохождение демки и т.д.)');
        }
    },
    async removeAnalyticsHint({ commit }) {
        try {
            const response = await Vue.http.post('/training/service/rest/tests/update/analytics/hint');
            commit('setUserStatistics', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'Ошибка изменения статистики юзера по отображению подсказки бля блока "результаты и анализ"');
        }
    },
    async changeUserLocale({ commit, dispatch, state, getters }, {userId, locale}) {
        try {
            const response = await Vue.http.post('/as/service/rest/user/change-user-locale', fillFormData({userId, locale}), FORM_HEADERS);
            window.location = window.location.origin + BASE_URL;
        } catch (e) {
            getErrorMessage(e, 'Ошибка при попытке сменить локализацию пользователя');
        }
    }
};
