import Vue from 'vue';
import { getErrorMessage, isUUID, fillFormData } from '../../../../../common/common.vue/src/utils/DeveloperUtils';
import { FORM_HEADERS } from '../../../../../common/common.vue/src/utils/Constants';

export default {
    async getTests({ commit }, type) {
        try {
            const response = await Vue.http.get('/training/service/rest/m/tests/');
            commit('fillTests', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'Ошибка при получении данных о тестах');
        }
    },
    async getTest({ commit }, id) {
        try {
            const response = Vue.http.get(`/training/service/rest/m/tests/${id}`);
            const test = {
                id,
                name: 'Test' + id,
                mode: 'WIZARD',
                startDate: null,
                endDate: null,
                statusType: 'NEW',
                participants: [
                    {
                        employeeId: '05b6c8b9-444c-4e48-ad4e-4a358c17c467',
                        answers: [
                            {itemId: '05b6c8b9-444c-4e48-ad4e-4a358c17c467', task: 'Вопрос1', updatedTime: '2019-02-01T00:00:00Z', timeOfActivity: 10,values: ['Ответ1']},
                            {itemId: '05b6c8b9-444c-4e48-ad4e-4a358c17c469', task: 'Вопрос2', updatedTime: '2019-02-02T00:00:00Z', timeOfActivity: 10,values: ['Ответ1', 'Answer2']},
                            {itemId: '05b6c8b9-444c-4e48-ad4e-4a358c17c461', task: 'Вопрос1', updatedTime: '2019-02-03T00:00:00Z', timeOfActivity: 10,values: ['Ответ1', 'Answer2', 'and so on...']}
                        ]
                    }
                ],
                statistics: {},
                quiz: {
                    id: '05b6c8b9-444c-4e48-ad4e-4a358c17c467',
                    dataSources: [
                        {id: '05b6c8b9-444c-4e48-ad4e-4a358c17c467', text: 'Task number one'},
                        {id: '05b6c8b9-444c-4e48-ad4e-4a358c17c466', text: 'Task number two'}
                    ]
                }
            };
            commit('fillTest', {value: test/*response.body*/});
        } catch (e) {
            getErrorMessage(e, 'Ошибка при получении данных о тесте - ' + id);
        }
    },
    async removeTest({commit, getters}, {id, callback = () => {}}) {
        try {
            const response = await Vue.http.delete(`/training/service/rest/m/tests/${id}/remove`);
            if (response.ok) {
                callback();
            }
        } catch (e) {
            getErrorMessage(e, 'Ошибка удаления теста');
        }
    },
    async duplicateTest({commit}, {id, callback = () => {}}) {
        try {
            if (!isUUID(id)) {
                throw new Error('Incorrect test\'s id');
            }
            const response = await Vue.http.post(`/training/service/rest/m/tests/${id}/duplicate`);
            commit('fillTest', {value: response.body});
            callback(response.body.id);
        } catch (e) {
            getErrorMessage(e, 'Ошибка при дублировании теста')
        }
    },
    async startTest({commit, getters}) {
        try {
            const response = await Vue.http.post(`/training/service/rest/m/tests/${getters.test.id}/start`);
            commit('fillTest', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'Ошибка старта тестового задания');
        }
    },
    async stopTest({commit, getters}) {
        try {
            const response = await Vue.http.post(`/training/service/rest/m/tests/${getters.test.id}/stop`);
            commit('fillTest', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'Ошибка остановки тестового задания');
        }
    },
    async restartTest({commit}, {testId, percent = 0, comment = '', endDate = null, callback = () => {}}) {
        try {
            if (!isUUID(testId)) {
                throw new Error('Incorrect test\'s id');
            }
            const response = await Vue.http.post('/training/service/rest/m/tests/restart', {testId, percent, comment, endDate});
            commit('fillTest', {value: response.body});
            callback(response.body.id);
        } catch (e) {
            getErrorMessage(e, 'Ошибка при возобновлении теста');
        }
    },
    async saveTest({commit, getters}) {
        try {
            const response = await Vue.http.post('/training/service/rest/m/tests/', getters.test);
        } catch (e) {
            getErrorMessage(e, 'Ошибка при сохранении данных о тесте');
        }
    },
    async updateTest({ commit, getters }, { field, value }) {
        try {
            let response = await Vue.http.post('/training/service/rest/m/tests/update', {id: getters.test.id, field, value});
            commit('fillTest', {value: /*response.body*/{...getters.test}});
        } catch (e) {
            getErrorMessage(e, 'Ошибка при обновлении теста (' + getters.test.id + ') по полю - ' + field);
        }
    },
    async addParticipantsToTest({commit, getters}, filterData) {
        try {
            let response = await Vue.http.put(`/training/service/rest/m/tests/${getters.test.id}/participants/add`, filterData);
            commit('fillTest', {value: /*response.body*/{...getters.test}});
        } catch (e) {
            getErrorMessage(e, 'Ошибка при добавлении сотрудников по тестовому заданию - ' + getters.test.id);
        }
    },
    async removeParticipantsToTest({commit, getters}, filterData) {
        try {
            let response = await Vue.http.delete(`/training/service/rest/m/tests/${getters.test.id}/participants/remove`, filterData);
            commit('fillTest', {value: /*response.body*/{...getters.test}});
        } catch (e) {
            getErrorMessage(e, 'Ошибка при удалении сотрудников по тестовому заданию - ' + getters.test.id);
        }
    },
    async changeTestQuiz({ commit, getters }, quizId = null) {
        try {
            const response = await this.$http.post(`/training/service/rest/m/tests/${getters.test.id}/change/quiz`, fillFormData({ quizId }), FORM_HEADERS);
            commit('fillTest', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'Ошибка при изменении шаблона в тесте');
        }
    },
    async getSettings({ commit }) {
        try {
            const response = await Vue.http.get('/training/service/rest/m/quiz/settings');
            commit('fillQuizSettings', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при получении данных по настройкам элементов');
        }
    },
    async getAllQuizes({ commit }) {
        try {
            const response = await Vue.http.get('/training/service/rest/m/quiz');
            commit('fillQuizes', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при получении данных по списку тестов');
        }
    },
    async findQuizes({ commit }, filter) {
        try {
            const response = await Vue.http.get('/training/service/rest/m/quiz/search', {params: {filter}});
            commit('fillQuizes', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'Ошибка при поиске тестов по фильтру - ' + filter)
        }
    },
    async renameQuiz({ commit, getters }, name) {
        try {
            const response = await Vue.http.post(`/training/service/rest/m/quiz/${getters.quiz.id}/rename`, fillFormData({ name }), FORM_HEADERS);
            commit('fillQuiz', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при изменении имени для Quiz с id = ' + getters.quiz.id);
        }
    },
    async renamePage({ commit, getters }, { name, pageId }) {
        try {
            const response = await Vue.http.post(`/training/service/rest/m/quiz/${getters.quiz.id}/rename/page`, fillFormData({ name, pageId }), FORM_HEADERS);
            commit('fillQuiz', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при изменении имени для страницы с id - ' + pageId + ' по Quiz с id - ' + getters.quiz.id);
        }
    },
    async getQuiz({ commit, dispatch }, id = null) {
        try {
            if (!id || !isUUID(id)) {
                throw new Error('Id is not UUID');
            }
            const response = await Vue.http.get(`/training/service/rest/m/quiz/${id}`);
            if (!response.body) {
                await dispatch("updateQuiz");
                return;
            }
            commit('fillQuiz', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при получении данных по Quiz с id = ' + id);
        }
    },
    async updateQuiz({ commit, getters }) {
        try {
            const response = await Vue.http.post('/training/service/rest/m/quiz/', {...getters.quiz, id: getters.routeParams.id});
            commit('fillQuiz', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при создании/изменении данных по Quiz с id = ' + getters.quiz.id);
        }
    },
    async updateBlockItem({ commit, getters }, { pageId, blockId }) {
        try {
            const item = getters.blockByType('ITEM', pageId, blockId);
            const response = await Vue.http.post('/training/service/rest/m/quiz/update/item', {pageId, quizId: getters.quiz.id, item});
            commit('fillQuiz', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при обновлении данных по Quiz с id = ' + getters.quiz.id + ' с элементом - ' + blockId);
        }
    },
    async updateRow({ commit, getters }, { pageId, blockId, settings }) {
        try {
            const response = await Vue.http.post('/training/service/rest/m/quiz/update/row', {pageId, quizId: getters.quiz.id, rowId: blockId, settings});
            commit('fillQuiz', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при обновлении данных по Quiz с id = ' + getters.quiz.id + ' с элементом - ' + blockId);
        }
    },
    async addNewBlock({ commit, getters }, { blockType, blockId = null, pageId = null }) {
        try {
            const addBlockRequest = {
                quizId: getters.quiz.id,
                blockType,
                blockId,
                pageId
            };
            const response = await Vue.http.put('/training/service/rest/m/quiz/add/block', addBlockRequest);
            commit('fillQuiz', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при добавлении блока в шаблон с id = ' + getters.quiz.id);
        }
    },
    async removeBlock({ commit, getters }, { blockType, blockId = null, pageId = null }) {
        try {
            const addBlockRequest = {
                quizId: getters.quiz.id,
                blockType,
                blockId,
                pageId
            };
            const response = await Vue.http.post('/training/service/rest/m/quiz/remove/block', addBlockRequest);
            commit('fillQuiz', {value: response.body});
        } catch (e) {
            getErrorMessage(e, 'ошибка при добавлении блока в шаблон с id = ' + getters.quiz.id);
        }
    },
    async getAllImagesUrls({ commit }) {
        try {
            const response = await Vue.http.get('/training/service/rest/image/files');
            commit('fillAllUrls', {value: response.body});
        } catch (e) {
            getErrorMessage(e, "Ошибка при получении списка загруженных изображений");
        }
    },
    async removeImage({ commit }, { url, success = () => {}, error = () => {} }) {
        try {
            const response = await Vue.http.delete(`/training/service/rest/image/${url}`);
            response.status === 200 ? success() : error();
        } catch (e) {
            getErrorMessage(e, "Ошибка при удалении изображения");
        }
    }
};
