<template>
    <participant-index
        :tasks="tests"
        :show-content="showContent"
    />
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex';
    import {TASK_LIST_DATA} from 'common/utils/Constants.js';

    export default {
        data() {
            return {
                showContent: false,
                TASK_LIST_DATA,
                tests: {
                    NEW: [],
                    ACTIVE: [],
                    COMPLETED: [],
                    FINISHED: []
                }
            };
        },
        head: {
            title() {
                return {
                    inner: this.translate('training.common.trainingTitle')
                };
            }
        },
        components: {
            ParticipantIndex: () => import('common/components/participant/main-page/ParticipantIndex.vue')
        },
        async created() {
            this.showContent = false;
            await this.getTestsByParticipant();
            this.participantTestsByType();
            this.showContent = true;
        },
        methods: {
            participantTestsByType() {
                let allActiveTests = this.testsByType('ACTIVE');
                allActiveTests.push(...this.testsByType('COMPLETED'));
                allActiveTests.forEach(item => {
                    let test =  {
                        name: item.name,
                        status: item.statusType,
                        redirectStage: this.getRedirectStage(item),
                        [TASK_LIST_DATA]: [
                            {
                                column: this.translate('training.test.status'),
                                value: this.translate(`training.completed.${item.statusType}`)
                            },
                            {
                                column: this.translate('training.test.starting'),
                                value: this.getFormattedDate(item.startDate)
                            },
                            {
                                column: this.translate('training.test.ending'),
                                value: this.getFormattedDate(item.endDate)
                            },
                            {
                                column: `${this.translate('training.test.allParticipants')}:`,
                                value: this.getParticipantsSize(item)
                            },
                            {
                                column: this.translate('training.test.youCompleted'),
                                value: `${this.getCurrentStage(item)} ${this.translate('training.common.out')} ${this.getQuestionSize(item)}`
                            },
                            {
                                column: this.translate('training.test.participantCompleted'),
                                value: `${this.completedPercent(item)}%`
                            }
                        ]
                    };
                    if (item.statusType === 'COMPLETED') {
                        this.tests['FINISHED'].push(test);
                    } else if (!item.statistics['PARTICIPANTS_IN_PROGRESS_COUNT']) {
                        this.tests['NEW'].push(test);
                    } else if(item.statistics['PARTICIPANTS_COMPLETED_COUNT'] === item.statistics['QUESTIONS_COUNT']) {
                        this.tests['COMPLETED'].push(test);
                    } else {
                        this.tests['ACTIVE'].push(test);
                    }
                });
            },
            getFormattedDate(date) {
                const startDate = date ? (new Date(date)) : null;
                return startDate
                    ? `${startDate.getDate().toString().replace(/^([0-9])$/, '0$1')} ${this.translate('training.month.full' + startDate.getMonth())} ${startDate.getFullYear()}`
                    : this.translate('training.test.indefinitely');
            },
            getParticipantsSize(item) {
                return item.statistics['PARTICIPANTS_COUNT'] || 0;
            },
            getQuestionSize(item) {
                return item.statistics['QUESTIONS_COUNT'] || 0;
            },
            getCurrentStage(item) {
                return item.statistics['PARTICIPANTS_IN_PROGRESS_COUNT'];
            },
            completedPercent(item) {
                return Math.round(item.statistics['PARTICIPANTS_COMPLETED_PERCENT']) || 0;
            },
            isTestStarted(item) {
                return Number(item.statistics['PARTICIPANTS_COMPLETED_COUNT']) > 0;
            },
            getRedirectStage(item) {
                let stages = {
                    'false': {name: 'Greeting', params: {id: item.id}},
                    'true': {name: 'Testing', params: {id: item.id}},
                    'COMPLETED': {name: 'Result', params: {id: item.id}}
                };
                if (stages[item.statusType] || this.getCurrentStage(item) === this.getQuestionSize(item)) {
                    return stages['COMPLETED'];
                } else {
                    return stages[this.isTestStarted(item)];
                }
            },
            ...mapActions('participant', [
                'getTestsByParticipant'
            ])
        },
        computed: {
            ...mapGetters('participant', [
                'testsByType',
                'allParticipants'
            ]),
            ...mapState('participant', [
                'tests'
            ])
        }
    };
</script>
