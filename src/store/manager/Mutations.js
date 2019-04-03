import { Optional } from "../../../../../common/common.vue/src/utils/Optional";

export default {
    fillTests(state, {value}) {
        state.tests = Optional.create(value);
    },
    fillTest(state, {value}) {
        state.test = Optional.create(value);
    },
    changeField(state, {type, value}) {
        switch (type) {
            case "NAME":
                state.test = Optional.create({...state.test.get(), name: value});
                break;
            case "START_DATE":
                state.test = Optional.create({...state.test.get(), startDate: value});
                break;
            case "END_DATE":
                state.test = Optional.create({...state.test.get(), endDate: value});
                break;
            case "APPEAL":
                state.test = Optional.create({...state.test.get(), appeal: value});
                break;
            case "MESSAGE_APPEAL":
                state.test = Optional.create({...state.test.get(), messageAppeal: value});
                break;
            default:
                console.log('Field not found');
        }
    },
    fillQuiz(state, { value }) {
        state.quiz = Optional.create(value);
    },
    fillQuizData(state, { value }) {
        state.quiz = Optional.create({...state.quiz.orElse({}), quiz: value});
    },
    fillQuizes(state, { value }) {
        state.quizes = Optional.create(value);
    },
    updateItem(state, { field, value, itemId, pageId }) {
        let quiz = state.quiz.orElse({}).quiz || {};
        let pages = quiz.pages || [];
        let page = pages.find(p => p.id === pageId);

        if (!page) {
            throw new Error("Page by id " + pageId + " is not exists.");
        }

        for (let row of (page.rows || [])) {
            let columns = row.columns || [];
            for (let index in columns) {
                let item = (columns[index].items || []).find(i => i.id === itemId);
                if (item) {
                    if (field !== 'items' || (field === 'items' && Array.isArray(value))) {
                        item[field] = value;
                    } else {
                        item[field] = item[field] ? item[field] : [];
                        let existsValue = false;
                        item[field] = item[field].map(e => {
                            if (e.id === value.id) {
                                existsValue = true;
                                return {...e, ...value};
                            } else {
                                return e;
                            }
                        });
                        if (!existsValue) {
                            item[field].push(value);
                        }
                    }
                    state.quiz = Optional.create({...state.quiz.orElse({}), quiz: {...quiz, pages}});
                    return;
                }
            }
        }

        throw new Error('Элемент по id - ' + itemId + ' не найден.');
    },
    fillAllUrls(state, { value }) {
        state.allUrls = Optional.create(value);
    },
    fillQuizSettings(state, { value }) {
        state.quizSettings = Optional.create(value);
    }
};
