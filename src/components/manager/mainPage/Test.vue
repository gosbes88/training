<template>
    <router-link :to="getLink" tag="div" class="slider-block__item">
        <div class="project-content"  @click="clickHandle">
            <div class="project-content__graph">
                <vue-circle class="project-content__circle" :style="progressPosition"
                            :progress="getProgress"
                            :size="118"
                            :reverse="false"
                            line-cap="round"
                            :fill="{color: '#8ccb4b'}"
                            empty-fill="transparent"
                            :animation="false"
                            :start-angle="completedPercent | getStartAngle"
                            :thickness="4"
                            :show-percent="false"
                            insert-mode="append"
                >
                </vue-circle>
                <div class="statistics-circle statistics-circle-done">
                    <div class="project-content__url"></div>
                    <div class="statistics-circle__container">
                        <div class="statistics-circle__content">
                            <div v-if="test.statusType === 'COMPLETED'">
                                <div class="statistics-circle__done-icon done-icon"></div>
                                <div class="statistics-circle__done" v-lang.training.common.completed2></div>
                            </div>
                            <div v-else-if="test.statusType === 'ACTIVE'">
                                <div class="statistics-circle__title" v-lang.training.common.fulfilled></div>
                                <div class="statistics-circle__num" v-text="completedPercent + '%'"></div>
                            </div>
                            <div v-else-if="test.statusType === 'NEW' && test.startDate">
                                <div class="project-start-date">
                                    <div class="project-start-date__title" v-lang.training.common.begin></div>

                                    <div class="project-start-date__day" v-text="getDateNumber(test.startDate)"></div>

                                    <div class="project-start-date__month" v-text="getMonthName(test.startDate)"></div>
                                </div>
                            </div>
                            <div v-else>
                                <span style="color: #999;" v-lang.training.common.new></span>
                            </div>
                        </div>
                    </div>
                    <div class="statistics-circle__line"></div>
                </div>
                <doughnut-chart
                    class="doughnut-chart"
                    :style="chartPosition"
                    :width="136"
                    :height="136"
                    :options="optionsChart"
                    :data="getChartData"
                >
                </doughnut-chart>
            </div>

            <h3 class="project-content__title-max" v-once :title="getSummary(test.name)" v-text="getSummary(test.name)"></h3>
            <div class="project-content__date" v-once v-text="getDate(test)"></div>
        </div>
    </router-link>
</template>

<script>
    export default {
        name: "test-item",
        data() {
            return {
                optionsChart: {
                    responsive: false,
                    maintainAspectRatio: false,
                    animation: false,
                    legend: {
                        display: false
                    },
                    cutoutPercentage: 91
                }
            };
        },
        props: {
            test: {
                type: Object,
                default: () => ({})
            },
            progressPosition: {
                type: Object,
                default: () => ({})
            },
            chartPosition: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            getProgress() {
                return this.test.statusType === 'COMPLETED' ? 100 : this.completedPercent;
            },
            getChartData() {
                return {
                    labels: [
                        this.translate('training.common.notStarted'), this.translate('training.common.active'), this.translate('training.common.completed')
                    ],
                    datasets: [
                        {
                            borderColor: 'white',
                            borderWidth: 0,
                            backgroundColor: [
                                "#b95455",
                                "#feae3b",
                                "#8ccb4b"
                            ],
                            hoverBackgroundColor: [
                                "#b95455",
                                "#feae3b",
                                "#8ccb4b"
                            ],
                            data: this.test.statusType === 'NEW'
                                ? [0, 0, 0]
                                : [this.notStartedSize, this.inProgressSize, this.completedSize]
                        }
                    ]
                };
            },
            //TODO: после прикрутки сервеной части реализовать
            getLink() {
                switch (this.test.statusType) {
                    case 'COMPLETED':
                        return {name: 'TestResults', params: {id: this.test.id}};
                    case 'ACTIVE':
                        return {name: 'Finish', params: {id: this.test.id}};
                    default:
                        return {name: this.test.lastStage || '', params: {id: this.test.id}};
                }
            },
            completedSize() {
                return 2;
            },
            notStartedSize() {
                return 4;
            },
            inProgressSize() {
                return 5;
            },
            completedPercent() {
                return 56;
            }
        },
        filters: {
            getStartAngle(percent) {
                let onePercent = Math.PI / 50;
                return Math.PI / 2 - parseFloat(onePercent * percent / 2);
            }
        },
        methods: {
            clickHandle() {
                this.$emit("click");
            },
            getMonthName(startDate) {
                return this.translate(`training.month.${(new Date(startDate)).getMonth()}`);
            },
            getDateNumber(startDate) {
                return (new Date(startDate)).getDate();
            },
            getDate(test) {
                if (test.startDate && test.endDate) {
                    const textStart = (new Date(test.startDate)).getMonth() === (new Date(test.endDate)).getMonth()
                        ? this.getDateNumber(test.startDate)
                        : `${this.getDateNumber(test.startDate)} ${this.getMonthName(test.startDate)}`;

                    const textEnd = `${this.getDateNumber(test.endDate)} ${this.getMonthName(test.endDate)}`;

                    return `${textStart} - ${textEnd}`;
                }
                return null;
            },
            getSummary(summary) {
                return Boolean(summary) && Boolean(summary.trim()) ? summary : this.translate('training.common.noName');
            }
        }
    };
</script>


