import {Optional} from "../../../../../common/common.vue/src/utils/Optional";

export default {
    fillTests(state, data) {
        state.tests = Optional.create(data.values);
    },
    fillTest(state, data) {
        state.test = Optional.create(data.values);
    }
}
