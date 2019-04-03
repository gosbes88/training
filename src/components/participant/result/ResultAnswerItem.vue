<template>
    <div>
        <div class="question-statistics">
            <div class="question-statistics__item">
                <span v-text="testItem.text"></span>
            </div>

            <div class="question-statistics__item" v-if="hasAnswers">
                <a class="question-statistics__num" href="javascript: void(0);" v-text="translate('training.result.answers')" @click="showAnswers"></a>
            </div>

            <div class="question-statistics__item" v-else>
                <div class="question-statistics__not-answered" v-lang.training.result.noAnswers></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "result-answer-item",
        props: {
            testItem: {
                type: Object,
                required: true
            },
            participantAnswers: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            hasAnswers() {
                return this.participantAnswers.filter(answer => answer.itemId === this.testItem.id).length > 0;
            }
        },
        methods: {
            showAnswers() {
                this.$emit('showAnswers', this.testItem.id);
            }
        }
    }
</script>

<style scoped>

</style>
