export default {
    routeParams(state, getters, rootState) {
        return rootState.route.params;
    },
    tests(state) {
        return state.tests.orElse([]);
    },
    test(state) {
        return state.test.orElse({});
    },
    testPages(state, getters) {
        const quiz = getters.test.quiz || {pages: []};
        return quiz.pages || [];
    },
    testValidations(state) {
        return state.test.orElse({}).validationResults || [];
    },
    completedTests(state, getters) {
        return getters.tests.filter( e => e.statusType === 'COMPLETED');
    },
    getActiveTests(state, getters) {
        return getters.tests.filter(e => e.statusType === 'ACTIVE');
    },
    quizes(state) {
        return state.quizes.orElse([]);
    },
    quiz(state) {
        return state.quiz.orElse({}).quiz || {};
    },
    /**
     * Ошибки валидации шаблона
     */
    errors(state) {
        return state.quiz.orElse({}).validationResult || [];
    },
    statistics(state, getters) {
        return getters.quiz.statistics || {};
    },
    getPages(state, getters) {
        return getters.quiz.pages || [];
    },
    pageRows: (state, getters) => id => {
        if (!getters.getPages.length) {
            return [];
        }

        const page = !id ? getters.getPages[0] : getters.getPages.find(p => p.id === id);

        if (!page) {
            throw new Error('Not found page by id - ' + id);
        }

        return page.rows || [];
    },
    /*Достать нужный блок для отображения, в зависимости от типа это строка, столбец или элемент*/
    blockByType: (state, getters) => (type, pageId, blockId)  => {
        if (!blockId) {
            console.warn("Block's id is empty");
            return {};
        }
        const page = getters.getPages.find(p => p.id === pageId);
        if (!page) {
            throw new Error("Page not found");
        }
        switch (type) {
            case 'PAGE':
                return page;
            case 'ROW':
                return (page.rows || []).find(r => r.id === blockId) || {};
            case 'COLUMN':
                for (let row of (page.rows || [])) {
                    const column = (row.columns || []).find(col => col.id === blockId);
                    if (column) {
                        return column;
                    }
                }
                break;
            case 'ITEM':
                for (let row of (page.rows || [])) {
                    for(let column of (row.columns || [])) {
                        const item = (column.items || []).find(item => item.id === blockId);
                        if (item) {
                            return item;
                        }
                    }
                }
                break;
            default:
                throw new Error("Incorrect block type - " + type);
        }

        throw new Error("Block by type - " + type + " and id - " + blockId + " not found");
    },
    getParentBlock: (state, getters) => (type, pageId, childId) => {
        const page = getters.getPages.find(p => p.id === pageId);
        if (!page) {
            throw new Error("Page not found");
        }

        switch (type) {
            case 'PAGE':
                return page;
            case 'ROW':
                for (let row of (page.rows || [])) {
                    for (let column of (row.columns || [])) {
                        if (column.id === childId || column.items.some(i => i.id === childId)) {
                            return row;
                        }
                    }
                }
                return {columns: []};
            case 'COLUMN':
                for (let row of (page.rows || [])) {
                    for (let column of (row.columns || [])) {
                        if (column.items.some(i => i.id === childId)) {
                            return column;
                        }
                    }
                }
                return {items: []};
            default:
                return {};
        }
    },
    /**
     * Возвращает участников тестирования
     */
    testParticipants(state) {
        return state.test.orElse({}).participants || [];
    },
    participateEmployeesIds(state, getters) {
        return getters.testParticipants.map(p => p.employeeId);
    },
    /**
     * Возвращает ответы участника
     */
    participantAnswers: (state, getters) => id => {
        const participant = getters.testParticipants.find(p => p.employeeId === id) || {};
        return participant.answers || [];
    },
    testItems(state) {
        return state.test.orElse({}).quiz.dataSources || [];
    },
    allUrls(state) {
        return state.allUrls.orElse([]);
    },
    quizSettings(state) {
        return state.quizSettings.orElse({});
    }
};
