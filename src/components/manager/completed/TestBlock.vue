<template>
    <router-link class="completed-project-item" :to="{name: 'TestResults', params: {id: item.id}}">
        <div class="projects-info">
            <div class="projects-info__col-inp">
                <div class="projects-info__inp-checkbox"></div>
            </div>

            <div class="projects-info__col-desc">
                <h3 class="completed-project-item__title" v-text="item.name"></h3>

                <div class="completed-project-info">
                    <div class="completed-project-info__item">
                        <div class="completed-project-data">
                            <div class="completed-project-data__item-1">
                                <span class="projects-info-row__title" v-text="translate('training.common.beginning') + ':'"></span>
                            </div>
                            <div class="completed-project-data__item-2">
                                <time class="projects-info-row__desc" v-text="getDate(item.startDate)"></time>
                            </div>
                            <div class="completed-project-data__item-3">
                                <span class="projects-info-row__title projects-info-row__title--ind" v-text="translate('training.common.ending') + ':'"></span>
                            </div>

                            <div class="completed-project-data__item-4">
                                <time class="projects-info-row__desc" v-text="getDate(item.endDate)"></time>
                            </div>
                        </div>
                    </div>

                    <div class="completed-project-info__item">
                        <div class="completed-project-data">
                            <div class="completed-project-data__item-1">
                                <span class="projects-info-row__title" v-text="translate('training.completed.status') + ':'"></span>
                            </div>
                            <div class="completed-project-data__item-2">
                                <span class="projects-info-row__desc" v-text="translate(`training.completed.${item.statusType}`)"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="projects-info__desc">
                    <div class="projects-info__item-4">
                        <div class="projects-info-row">
                            <div class="projects-info-row__title" v-text="translate('training.completed.question') + ':'"></div>
                            <div class="projects-info-row__desc" v-text="questionsNames"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="projects-info__col-circle">
                <div class="statistics-circle statistics-circle-small statistics-circle-done">
                    <vue-circle class="statistics-circle__progress"
                                :progress="completedPercent"
                                :size="105"
                                :reverse="false"
                                line-cap="round"
                                :fill="progressColor"
                                empty-fill="transparent"
                                :animation="false"
                                :start-angle="completedPercent | getStartAngle"
                                :thickness="6"
                                :show-percent="false"
                                insert-mode="append"
                    />
                    <div class="statistics-circle__container">
                        <div class="graph-test__total">
                            <div class="graph-test__text" v-lang.training.completed.fulfilled></div>
                            <div class="graph-test__num" v-text="completedPercent + '%'"></div>
                        </div>
                    </div>
                    <div class="statistics-circle__line"></div>
                </div>
            </div>

            <div class="projects-info__col-points-wrap">
                <i class="ellipsis-icon" @click.prevent="toggleTooltip"></i>
            </div>
            <tooltip-list :style="{'top': '47px', 'right': '20px'}" v-if="isTooltipViewed" :items="testSettings"/>
        </div>

        <popup class="restart-survey" @click.native.prevent="() => {}" v-if="restartConfirm || removeConfirm" @close="hidePopup">
            <div slot="head">
                <div class="restart-survey__title mb-2"
                     v-text="removeConfirm ? translate('training.completed.removeTest') : translate('training.completed.popupTitle')"></div>
            </div>
            <div slot="main">
                <div class="popup-content" v-if="removeConfirm" v-lang.training.completed.removeTestWarning></div>
                <div class="popup-content" v-else>
                    <div>
                        <span v-lang.training.completed.messageText1></span>
                        <input class="inp-num restart-survey__percent" type="number" min="0" max="100" v-model="percent" required/>%
                        <span v-lang.training.completed.messageText2></span>
                        <div v-text="getParticipantsCountTitle"></div>
                        <textarea class="inp-textarea mt-2 restart-survey__message"
                                  style="max-height: 200px; overflow-y: auto;"
                                  :placeholder="translate('training.completed.restartMessage')"
                                  rows="1"
                                  v-model="comment"
                                  v-autosize="comment"
                        >
                            </textarea>
                        <input-date class="mt-2 restart-date-end"
                                    :label="`${translate('training.completed.dateEnd')} ${translate('training.completed.notRequired')}`"
                                    :value="endDate"
                                    :locale="getSelectOrganization.locale"
                                    :min-date="minDateToString"
                                    :max-date="''"
                                    :wrap-css-classes="'inp-col-half'"
                                    :label-css-classes="endDateTop ? 'inp-label inp-label--top' : 'inp-label'"
                                    :input-css-classes="'project-creation__inp project-creation__inp-date-beginning inp-date'"
                                    @updateDate="updateDateEnd"
                                    @open="endDateTop = true"
                                    @close="$event => endDateTop = !!$event"
                        />
                    </div>
                </div>
            </div>
            <div slot="footer">
                <template  v-if="removeConfirm">
                    <a @click="remove" class="text-link mr-2" href="javascript:void(0);" v-lang.training.common.ok></a>
                    <a @click="removeConfirm = false" class="text-link" href="javascript:void(0);" v-lang.training.common.cancel></a>
                </template>
                <a v-else @click="restart" class="flex-article__footer-btn text-link mr-2" href="javascript:void(0);" v-lang.training.completed.restart></a>
            </div>
        </popup>
    </router-link>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import { WAITING_TIME } from "../../../utils/Constants";
    import { getErrorMessage } from "utils/DeveloperUtils";

    export default {
        name: "TestBlock",
        data() {
            return {
                isTooltipViewed: false,
                restartConfirm: false,
                removeConfirm: false,
                percent: 0,
                count: 0,
                timer: null,
                endDate: '',
                endDateTop: false,
                comment: ""
            };
        },
        props: {
            item: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            TooltipList: () => import('common/components/TooltipList'),
            Popup: () => import('common/components/Popup'),
            InputDate: () => import('common/components/date/InputDate')
        },
        watch: {
            endDate(val) {
                this.endDateTop = !!val;
            },
            percent(val) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => this.getParticipantCountByCompleteness(), WAITING_TIME);
            }
        },
        created() {
            this.$bus.$on("documentClick", this.hideTooltip);
            this.getParticipantCountByCompleteness();
        },
        beforeDestroy() {
            this.$bus.$off("documentClick", this.hideTooltip);
        },
        methods: {
            updateDateEnd(val) {
                this.endDate = val || '';
            },
            getParticipantCountByCompleteness() {
                this.$http.get(`/training/service/rest/m/tests/${this.item.id}/completeness/count`, {params: {percent: this.percent || 0}})
                    .then(response => this.count = response.body)
                    .catch(e => getErrorMessage(e, 'Ошибка при получении числа сотрудников по выполненным тестам'));
            },
            hidePopup() {
                this.removeConfirm = false;
                this.restartConfirm = false;
            },
            hideTooltip() {
                this.isTooltipViewed = false;
            },
            toggleTooltip() {
                let oldValue = this.isTooltipViewed;
                this.$nextTick(() => this.isTooltipViewed = !oldValue);
            },
            getDate(date) {
                return date
                    ? (new Date(date)).getDate() + " " + this.translate(`training.month.full${(new Date(date)).getMonth()}`) + " " + (new Date(date)).getFullYear()
                    : this.translate('training.completed.noDate');
            },
            remove() {
                this.removeTest({id: this.item.id, callback: () => this.$emit("remove", this.item.id)});
                this.removeConfirm = false;
            },
            restart() {
                this.restartTest({
                    testId: this.item.id,
                    comment: this.comment,
                    percent: this.percent,
                    endDate: this.endDate ? `${this.endDate}T00:00:00Z` : null,
                    callback: id => {}//TODO: потом перейти на страницу созданного заново теста  this.$router.push({name: 'SurveyNew', params: { id }})
                });
                this.restartConfirm = false;
                this.comment = '';
                this.endDate = '';
                this.percent = 0;
                this.count = 0;
            },
            duplicate() {
                this.duplicateTest({
                    id: this.item.id,
                    callback: id => {}//TODO: потом перейти на страницу созданного заново теста  this.$router.push({name: 'SurveyNew', params: { id }})
                });
            },
            ...mapActions('manager', [
                'removeTest',
                'restartTest',
                'duplicateTest'
            ])
        },
        computed: {
            minDateToString() {
                const date = new Date();
                //минимальная дата - следующий день после текущего
                return `${date.getFullYear()}-${(date.getMonth() + 1).toString().replace(/^([0-9])$/, '0$1')}-${(date.getDate() + 1).toString().replace(/^([0-9])$/, '0$1')}`
            },
            getParticipantsCountTitle() {
                return `(${this.translate('training.common.it')} ${this.count} ${this.declOfNum(this.count, [this.translate('training.common.participant'), this.translate('training.common.participant1'), this.translate('training.common.participant2')])})`;
            },
            testSettings() {
                let settings = [
                    {
                        title: this.translate('training.completed.removeTest'),
                        action: () => {
                            this.isTooltipViewed = false;
                            this.removeConfirm = true;
                        }
                    },
                    {
                        title: this.translate('training.completed.duplicate'),
                        action: () => this.duplicate()
                    },
                    {
                        title: this.translate('training.completed.restart'),
                        action: () => {
                            this.isTooltipViewed = false;
                            this.restartConfirm = true;
                        }
                    }
                ];

                if (this.item.statusType !== 'COMPLETED') {
                    settings.shift();
                }

                if (this.item.statusType !== 'COMPLETED' || this.completedPercent === 100) {
                    settings.pop();
                }

                return settings;
            },
            completedPercent() {
                return Math.round(this.item.statistics['PARTICIPANTS_COMPLETED_PERCENT']) || 0;
            },
            completedSize() {
                return this.item.statistics['PARTICIPANTS_COMPLETED_COUNT'] || 0;
            },
            progressColor() {
                return { color: this.getProgressColor(this.completedPercent)};
            },
            questionsNames() {
                //TODO: заменить на pages
                return (this.item.questions || []).reduce((result, r, index, arr) => {
                    return result + r.name + (index < arr.length - 1 ? ", " : "");
                }, "");
            },
            ...mapGetters([
                'getSelectOrganization',
                'getProgressColor'
            ])
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    .restart-date-end {
        width: 220px;
    }

    .statistics-circle-small {
        width: 105px;
        height: 105px;
    }

    .project-info-check {
        display: flex;
        height: inherit;
    }

    .popup-content {
        color: #000;
        cursor: default;
    }

    .restart-survey {
        cursor: default;

        &__title {
            margin: 0 40px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: .6px;
            text-align: center;
            color: #000;
        }

        &__message {
            max-height: 200px;
            overflow-y: auto;
        }

        &__percent {
            width: 30px;
            text-align: center;
        }
    }
</style>
