export default {
    routeParams(state, getters, rootState) {
        return rootState.route.params;
    },
    /**
     * Выводит все тестирования определённого типа, которые имеются у участника
     * (завершённые, активные и т.п.)
     */
    testsByType: (state) => (type) => {
        return state.tests.orElse([]).filter(s => s.statusType === type);
    },
    /**
     * Возвращает количество участников всех тестирований, в которых принимает участие пользователь
     */
    allParticipants(state, getters) {
        return state.tests.orElse([]).reduce((res, item) => {
            return res + item.statistics['PARTICIPANTS_COUNT']
        }, 0);
    },
    getTest(state, getters) {
        return state.test.orElse({});
    }
}
