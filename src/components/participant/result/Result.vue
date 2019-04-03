<template>
    <result-base
        :show-content="showContent"
        :task-started-by-participant="hasAnswer"
        :task-completed="participantAnswers(getSelectOrganization.employeeId).length === testItems.length || test.orElse({}).statusType === 'COMPLETED'"
        :time-spent="time"
        :tasks-completed-count="completedTaskCount"
    >
        <result-answer-item slot="specifiedTaskContent" class="list-completed-surveys__item" v-for="(testItem, index) in testItems"
                            :key="index"
                            :test-item="testItem"
                            :participant-answers="participantAnswers(getSelectOrganization.employeeId)"
                            @showAnswers="showAnswers"
        />

        <result-answers-popup slot="detailsPopup" @close="closePopup" :is-popup-viewed="showPopup" :answers="answers"/>

    </result-base>
</template>

<script>
    import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';

    export default {
        data() {
            return {
                showContent: true,
                showPopup: false,
                answers: []
            }
        },
        components: {
            ResultBase: () => import('common/components/participant/result/ResultBase.vue'),
            ResultAnswerItem: () => import('./ResultAnswerItem.vue'),
            ResultAnswersPopup: () => import('./ResultAnswersPopup.vue')
        },
        async created() {
            this.showContent = false;
            this.fillTest({value: null});
            await this.getTest(this.$route.params.id);
            this.showContent = true;
        },
        computed: {
            hasAnswer() {
                return this.testItems.length > 0;
            },
            completedTaskCount() {
                return `${new Set(this.participantAnswers(this.getSelectOrganization.employeeId).map(answer => answer.itemId)).size} ${this.translate('training.common.out')} ${this.testItems.length}`;
            },
            time() {
                let result = '';
                const answers = Array.from(this.participantAnswers(this.getSelectOrganization.employeeId))
                    .sort((a, b) => new Date(a.updatedTime) > new Date(b.updatedTime));
                if (answers && answers.length > 0) {
                    const totalTime = answers.reduce((result, answer) => result + (answer.timeOfActivity || 0), 0);
                    if (!totalTime) {
                        return 0;
                    }
                    let diffSeconds = parseInt(totalTime / 1000 % 60);
                    let diffMinutes = parseInt(totalTime / (60 * 1000) % 60);
                    let diffHours = parseInt(totalTime / (1000 * 60 * 60) % 24);
                    let diffDays = parseInt(totalTime / (1000 * 60 * 60 * 24));
                    diffDays = diffDays ? `${diffDays} ${this.translate('training.date.shortDay')}` : '';
                    diffHours = diffHours ? `${diffHours} ${this.translate('training.date.shortHours')}` : '';
                    if (diffSeconds) {
                        ++diffMinutes;
                    }
                    diffMinutes = diffMinutes ? `${diffMinutes} ${this.translate('training.date.shortMinutes')}` : '';

                    //показывается максимум 2 временных показателя не менее минуты(секунды не берутся)
                    const text = Array.of(diffDays, diffHours, diffMinutes)
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(" ");
                    return text || 0;
                }

                return result;
            },
            ...mapState('manager', [
                'test'
            ]),
            ...mapGetters('manager', [
                'testItems',
                'participantAnswers'
            ]),
            ...mapGetters([
                'getSelectOrganization'
            ])
        },
        methods: {
            showAnswers(testItemId) {
                this.answers = this.participantAnswers(this.getSelectOrganization.employeeId).filter(answer => answer.itemId === testItemId);
                this.showPopup = true;
            },
            closePopup() {
                this.showPopup = false;
                this.answers = [];
            },
            ...mapMutations('manager', [
                'fillTest'
            ]),
            ...mapActions('manager', [
                'getTest'
            ])
        }
    }
</script>
