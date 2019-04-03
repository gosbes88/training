<template>
    <div class="page-home__item">
        <div class="start-new-project">

            <router-link class="start-new-project__item start-new-project__analytics" :to="{name: 'CompletedTests'}" tag="div" v-if="completedTests.length">
                <div class="start-new-project__icon">
                    <i class="analysis-results-icon"></i>
                </div>
                <div class="start-new-project__title" v-lang.training.common.results></div>
                <div class="start-new-project__desc relative">
                    <span v-lang.training.common.resultsComment></span>

                    <transition name="hide">
                        <div ref="tooltip" v-if="$store.getters.showAnalyticsHint" class="tooltip-first-survey tooltip-completed-hint show" @click.stop="">
                            <div class="tooltip-content__arrow-top"></div>
                            <span v-lang.training.common.analyticsHint></span>
                        </div>
                    </transition>
                </div>
            </router-link>

            <div class="start-new-project__item" @click.prevent="createTest">
                <a>
                    <div class="start-new-project__icon">
                        <i class="list-icon"></i>
                    </div>
                    <div class="start-new-project__title" v-lang.training.common.tests></div>
                    <div class="start-new-project__desc" v-lang.training.common.testsComment></div>
                </a>
            </div>

            <router-link class="start-new-project__item" :to="{name: 'QuizList'}" tag="div">
                <a>
                    <div class="start-new-project__icon">
                        <i class="data-collection-icon"></i>
                    </div>
                    <div class="start-new-project__title" v-lang.training.common.tasks></div>
                    <div class="start-new-project__desc" v-lang.training.common.tasksComment></div>
                </a>
            </router-link>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "actions",
        created() {
            this.$bus.$on('documentClick', this.hideHint);
        },
        beforeDestroy() {
            this.$bus.$off('documentClick', this.hideHint);
        },
        methods: {
            hideHint() {
                if (!this.$refs.tooltip || !this.$store.getters.showAnalyticsHint) {
                    return;
                }
                this.$store.dispatch('removeAnalyticsHint');
            },
            async createTest() {
                try {
                    const response = await this.$http.post('/training/service/rest/m/tests/new');
                    this.$router.push({name: 'QuizSelection', params: {id: response.body}});
                } catch (e) {
                    console.error(e);
                }
            }
        },
        computed: {
            ...mapGetters('manager', [
                'completedTests',
                'tests'
            ])
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    .show {
        opacity: 1;
        visibility: visible;
    }

    .hide-enter, .hide-leave-to {
        opacity: 0;
        visibility: hidden;
    }

    .hide-enter-active, .hide-leave-active {
        transition: all .5s;
    }
</style>
