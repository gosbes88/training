<template>
    <div class="container-default">
        <div class="page-home">
            <!--<vue-perfect-scrollbar class="page-man-home-scroll" tagname="div" ref="ps" :settings="settings">-->
                <actions/>

                <div class="page-home__item" v-if="tests.length > 0">
                    <div>
                        <h2 class="title-middle-page" v-lang.training.common.currentTrainings></h2>

                        <div class="project-results">
                            <div class="project-results__item">
                                <div class="project-results__round-not-start"></div>
                                <div class="project-results__title" v-lang.training.common.notStarted></div>
                            </div>

                            <div class="project-results__item">
                                <div class="project-results__round-perform"></div>
                                <div class="project-results__title" v-lang.training.common.active></div>
                            </div>

                            <div class="project-results__item">
                                <div class="project-results__round-completed"></div>
                                <div class="project-results__title" v-lang.training.common.completed></div>
                            </div>
                        </div>

                        <div :is="tests.length > 5 ? 'tests-carousel' : 'tests'"
                             class="carousel-block mt-3"
                             :moved-items="1">
                        </div>
                    </div>
                </div>

                <div class="page-home__item" v-else>
                    <div class="projects-empty" v-lang.training.common.emptyTrainings></div>
                </div>

                <div class="page-home__item">
                    <div class="completed-projects">
                        <div class="completed-projects__item">
                            <div class="completed-projects__title" v-lang.training.common.totalTrainings></div>
                            <div class="completed-projects__total" v-text="tests.length"></div>
                        </div>
                        <div class="completed-projects__item">
                            <div class="completed-projects__title" v-lang.training.common.completedTrainings></div>
                            <div class="completed-projects__total" v-text="completedTests.length"></div>
                        </div>
                    </div>
                </div>
            <!--</vue-perfect-scrollbar>-->
        </div>
        <load v-if="!showContent" :height="'calc(100vh - 100px)'" :coord="{left: 0, top: '50px'}"/>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import { updatePS } from "utils/DeveloperUtils";

    export default {
        name: "main-page-manager",
        data() {
            return {
                showContent: false,
                settings: {
                    minScrollbarLength: 60
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
            Actions: () => import('./Actions'),
            TestsCarousel: () => import('./TestsCarousel'),
            Tests: () => import('./Tests')
        },
        async created() {
            this.showContent = false;
            await Promise.all([this.getTests('SIMPLE')/*, this.$store.dispatch('getUserStatistics')*/]);
            this.showContent = true;
            this.$bus.$on('windowResize', this.psPageScroll);
        },
        beforeDestroy() {
            this.$bus.$off('windowResize', this.psPageScroll);
        },
        updated() {
            this.psPageScroll();
        },
        methods: {
            psPageScroll() {
                updatePS({scroll: this.$refs.ps});
            },
            ...mapActions('manager', [
                'getTests'
            ])
        },
        computed: {
            ...mapGetters('manager', [
                'tests',
                'completedTests'
            ])
        }
    };
</script>
