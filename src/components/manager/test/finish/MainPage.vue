<template>
    <finish :show-content="showContent"
            :task="test"
            :count="count"
            :get-suitable-employees="getParticipantCountByCompleteness"
            :notify="notify"
            :completed-size="test.statistics['PARTICIPANTS_COMPLETED_COUNT'] || 0"
            :not-started-size="test.statistics['PARTICIPANTS_NOT_STARTED_COUNT'] || 0"
            :in-progress-size="test.statistics['PARTICIPANTS_IN_PROGRESS_COUNT'] || 0"
            :completed-percent="test.statistics['PARTICIPANTS_COMPLETED_PERCENT'] || 0"
            @goToParticipants="goToParticipants"
            @goToFirstStep="goToFirstStep"
            @changeStatus="buttonHandler"
            @removeTask="remove"
            @update="update"
    >
        <div class="project-mode__col" slot="question">
            <div class="project-mode__title default" v-text="translate('training.test.pagesCount') + ':'"></div>
            <div class="project-mode__questions">
                <span class="default" v-if="!testPages.length" v-text="getPagesCount(testPages.length)"></span>
                <a class="pointer"
                   v-else
                   @click.prevent="showQuizzesInfo = true"
                   :title="translate('training.test.pagesHint')"
                   v-text="getPagesCount(testPages.length)"
                >
                </a>
            </div>
        </div>
        <popup v-if="showQuizzesInfo" @close="showQuizzesInfo = false">
            <div slot="main">
                <h3 class="flex-article__title" v-lang.training.test.popUpNumberPagesTitle></h3>
            </div>
            <vue-perfect-scrollbar class="task-questions-list" ref="ps" tagname="div" :settings="settingsPS" slot="main">
                <div class="task-questions-list__item" v-for="(page, index) in testPages" :key="page.id" v-text="(index + 1) + '. ' + page.name"></div>
            </vue-perfect-scrollbar>
            <div slot="footer">
                <a @click="showQuizzesInfo = false" class="flex-article__footer-btn text-link" href="javascript:void(0);" v-lang.training.common.ok></a>
            </div>
        </popup>
    </finish>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import { FORM_HEADERS } from '@/utils/Constants';
    import { fillFormData, getErrorMessage, isIE, updatePS } from 'utils/DeveloperUtils';

    export default {
        name: "main-page-finish",
        data() {
            return {
                showContent: false,
                count: 0,
                showQuizzesInfo: false,
                settingsPS: {
                    minScrollbarLength: 30
                },
                removed: false
            };
        },
        components: {
            Finish: () => import("common/components/finish/Finish"),
            Popup: () => import('common/components/Popup')
        },
        async created() {
            this.$store.commit('setHasNavPanel', true);
            this.showContent = false;
            this.fillTest({value: null});

            await this.getTest(this.$route.params.id);
            if (this.test.statusType !== 'NEW') {
                this.getParticipantCountByCompleteness(10);
            }
            if (!this.test.startDate) {
                this.fillTest({value: {...this.test, endDate: null}});
            }
            if (!this.test.lastStage || this.test.lastStage !== 'Finish') {
                this.fillTest({value: {...this.test, lastStage: "Finish"}});
                await this.saveTest(true);
            }
            this.showContent = true;
        },
        updated() {
            updatePS({scroll: this.$refs.ps});
            this.$bus.$emit("resultPageScroll");
        },
        computed: {
            ...mapGetters('manager', [
                'test',
                'testPages'
            ])
        },
        methods: {
            goToFirstStep() {
                this.$router.push({name: 'QuizSelection', params: {id: this.test.id}});
            },
            getPagesCount(count) {
                return `${count} ${this.declOfNum(count, [this.translate('training.test.page'), this.translate('training.test.pages1'), this.translate('training.test.pages2')])}`;
            },
            goToParticipants() {
                this.showContent = false;
                this.$router.push({name: 'ParticipantsPage', params: {id: this.test.id}});
            },
            async getParticipantCountByCompleteness(val) {
                try {
                    const response = await this.$http.get(`/training/service/rest/m/tests/${this.test.id}/completeness/count`, {params: {percent: val || 0}});
                    this.count = response.body;
                } catch (e) {
                    getErrorMessage(e, 'Ошибка при получении числа сотрудников по выполненным заданиям');
                }
            },
            async notify(message, percent) {
                try {
                    const formData = fillFormData({message, percent});
                    const response = await this.$http.post(`/training/service/rest/m/tests/${this.test.id}/notify`, formData, FORM_HEADERS);
                    return Promise.resolve(response);
                } catch (e) {
                    getErrorMessage(e, 'Ошибка при получении числа сотрудников по выполненным заданиям');
                }
            },
            update({type, value}) {
                this.changeField({type, value});
                this.updateTest({field: type, value});
            },
            buttonHandler() {
                const status = this.test.statusType;
                if (status === "NEW") {
                    this.startTest();
                } else if (status === "ACTIVE") {
                    this.stopTest();
                } else if (status === "COMPLETED") {
                    this.$router.push({name: 'TestResults', params: {id: this.test.id}});
                }
            },
            async remove() {
                await this.removeTest({id: this.test.id, callback: () => this.$router.push({name: 'Manager'})});
                this.removed = true;
            },
            ...mapActions('manager', [
                'getTest',
                'saveTest',
                'updateTest',
                'startTest',
                'stopTest',
                'removeTest'
            ]),
            ...mapMutations('manager', [
                'fillTest',
                'changeField'
            ])
        },
        async beforeDestroy() {
            if (!this.removed) {
                await this.saveTest();
            }
        }
    };
</script>

<style lang="less" scoped>
    .date-block {
        margin-right: 20px;
    }

    .pointer {
        cursor: pointer;
    }

    .default {
        cursor: default;
    }
</style>
