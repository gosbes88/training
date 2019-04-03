import { Optional } from '../../../../../common/common.vue/src/utils/Optional';

export default {
    tests: Optional.empty(),
    test: Optional.empty(),
    quiz: Optional.create({}),
    quizes: Optional.create([]),
    allUrls: Optional.create([]),
    //настройки элементов шаблона(внешний вид)
    quizSettings: Optional.create({})
};
