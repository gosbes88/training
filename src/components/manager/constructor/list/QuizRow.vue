<template>
    <div class="quiz-list__item" :class="{'quiz-list__item--selected': selected}" @click="select">
        <div class="quiz-item">
            <div class="quiz-item__mode">
                <!--TODO: в дальнейшем реализовать свойство режима шаблона - простой или сложный-->
                <i :class="{'quiz-mode-simple': quiz.mode === 'SIMPLE', 'quiz-mode-complex': quiz.mode !== 'SIMPLE'}"></i>
            </div>

            <div class="quiz-item__info">
                <h3 class="quiz-item__name" v-text="quizName"></h3>
                <div class="quiz-item__desc">
                    <span class="quiz-item__rates" v-text="quizRates"></span>
                    <span class="quiz-item__questions" v-text="quizQuestions"></span>
                </div>
            </div>

            <div class="quiz-item__selected">
                <i class="select-profile-icon" v-show="selected"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import quiz from '@/mixins/Quiz';

    export default {
        name: "QuizRow",
        props: {
            quiz: {
                type: Object,
                default: () => ({})
            },
            handleSelect: {
                type: Function,
                default: () => {}
            }
        },
        data() {
            return {
                selected: false
            };
        },
        mixins: [ quiz ],
        created() {
            this.$bus.$on("selectQuiz", this.selectQuiz);
        },
        beforeDestroy() {
            this.$bus.$off("selectQuiz", this.selectQuiz);
        },
        methods: {
            selectQuiz(id) {
                this.selected = this.quiz.id === id;
            },
            select() {
                const selected = this.selected ? null : this.quiz.id;
                this.$bus.$emit("selectQuiz", selected);
                this.handleSelect(selected);
            }
        },
        computed: {
            quizQuestions() {
                const count = this.quiz.statistics ? this.quiz.statistics['PAGES_COUNT'] || 0 : 0;
                return `${count} ${this.declOfNum(count, [this.translate('training.constructors.question1'), this.translate('training.constructors.question2'), this.translate('training.constructors.question3')])}`;
            }
        }
    };
</script>
