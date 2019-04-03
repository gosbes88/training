<template>
    <div>
        <div class="analytics__wrapper" :style="{'opacity': Number(showContent)}">
            <div class="container-default">
                <div class="completed-project-grid">
                    <div class="completed-project-grid__item" ref="completedHead">
                        <div class="completed-project-head">
                            <h1 class="completed-project-head__title title-big-page mt-3" v-lang.training.completed.title></h1>
                        </div>
                    </div>

                    <div class="completed-project-grid__item" ref="completedDesc">
                        <div class="completed-project-desc" v-lang.training.completed.description></div>
                    </div>

                    <div class="completed-project-grid__item" ref="completedSearch">
                        <div class="completed-project-search"
                             :class="{'completed-project-search--active': isActive}"
                             ref="searchIndent"
                        >
                            <div class="completed-project-search__content" :style="{'opacity': Number(!firstRun)}">
                                <div class="completed-project-search__col-1">
                                    <div class="select-project all-select-project">

                                    </div>
                                </div>

                                <div class="completed-project-search__col-2">
                                    <div class="search-icon-groups" v-if="isScrollViewed || filter.length > 0">
                                        <i class="completed-project-search__icon search-icon"></i>
                                    </div>
                                </div>

                                <div class="completed-project-search__col-3">
                                    <input class="completed-project-search__inp"
                                           v-if="isScrollViewed || filter.length > 0"
                                           @focus="isActive = !isActive"
                                           @blur="isActive = false"
                                           type="search"
                                           :placeholder="translate('training.completed.search')"
                                           v-model="filter">
                                </div>

                                <div class="completed-project-search__col-4">
                                    <i class="completed-project-search__icon-close close-search-icon"
                                       v-if="isScrollViewed || filter.length > 0"
                                       :class="{'completed-project-search__icon-close--show': filter.length}"
                                       @click="clearFilter"
                                    ></i>
                                </div>

                                <div class="completed-project-search__col-5">
                                    <div class="completed-project-search__find-completed">
                                        <span class="completed-project-search__text" v-lang.training.completed.found></span>
                                        <span class="completed-project-search__num" v-text="tempTests.length"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <vue-perfect-scrollbar tagname="div"
                                           ref="ps"
                                           :settings="settings"
                                           :swicher="isScrollViewed"
                                           class="completed-project-grid__item completed-project-grid__item-scroll"
                                           :class="{'completed-project-grid__not-found': !tempTests.length}"
                                           :style="psHeight"
                    >
                        <div class="completed-project-list" id="projects" ref="projects">
                            <template v-if="tempTests.length">
                                <!--здесь блок тестов завершённых-->
                                <test-block class="completed-project-list__row"
                                              v-for="item in tempTests"
                                              :key="item.id"
                                              :item="item"
                                              @remove="removeTest"
                                />
                            </template>
                            <div v-else class="container-small">
                                <div class="not-found-content" v-lang.training.completed.notFound></div>
                            </div>
                        </div>
                    </vue-perfect-scrollbar>

                    <div class="completed-project-grid__item" ref="completedNav">
                        <div class="completed-project-panel js-fixed-panel">
                            <div class="completed-project-panel__content">
                                <div>
                                    <router-link class="breadcrumb-link anim-hover-left" :to="{name: 'Manager'}">
                                        <i class="breadcrumb-link__icon arrow-left-dark-small-icon anim anim-icon"></i>
                                        <span v-lang.training.common.toMain></span>
                                    </router-link>
                                </div>
                            </div>

                            <div class="completed-project-panel__wrap js-fixed-panel-wrap"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <load v-if="!showContent" :height="'calc(100vh - 50px)'" :coord="{top: '50px'}"/>
    </div>
</template>

<script>
    import { mapActions, mapMutations, mapGetters } from 'vuex';
    import { WAITING_TIME, FORM_HEADERS } from '@/utils/Constants';
    import { getErrorMessage, fillFormData, updatePS, changeDOMElementClass } from 'utils/DeveloperUtils';

    export default {
        name: "main-page-completed-tests",
        data() {
            return {
                showContent: false,
                filter: "",
                timer: null,
                tempTests: [],
                firstRun: true,
                isActive : false,
                totalHeight: 0,
                isScrollViewed: false,
                settings: {
                    minScrollbarLength: 30
                }
            };
        },
        head: {
            title() {
                return {
                    inner: this.translate('training.completed.title')
                };
            }
        },
        components: {
            TestBlock: () => import('./TestBlock')
        },
        async created() {
            this.showContent = false;
            await this.getTests('WITHOUT_EMPLOYEES');
            this.tempTests = this.getAvailableTests();
            this.showContent = true;
            this.$bus.$on('windowResize', this.psPageScroll);
        },
        updated() {
            this.firstRun = false;
            this.psPageScroll();
            this.isScroll();
            this.fixedPanel();
        },
        mounted() {
            this.$nextTick(() => this.calcHeight());
        },
        watch: {
            filter(val) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    if (!val) {
                        this.tempTests = this.getAvailableTests();
                        this.isScroll();
                        this.psPageScroll(true);
                        this.fixedPanel();
                    } else {
                        this.findTestsByFilter(val);
                    }
                }, WAITING_TIME);
            },
            isActive(val) {
                this.$nextTick(() => {
                    this.isScroll();
                    this.psPageScroll();
                    this.fixedPanel();
                });
            }
        },
        methods: {
            fixedPanel() {
                if (document.querySelector(".js-footer")) {
                    var elBlock = document.querySelector(".js-fixed-panel-wrap"),
                        footerCoorY = document.querySelector(".js-footer").getBoundingClientRect().top,
                        elCoorY = document.querySelector('.js-fixed-panel').getBoundingClientRect().top,
                        elHeight = document.querySelector('.js-fixed-panel').offsetHeight;
                }

                if (footerCoorY === (elHeight + elCoorY)) {
                    elBlock.classList.add("completed-project-panel__wrap--show");
                } else {
                    elBlock.classList.remove("completed-project-panel__wrap--show");
                }
            },
            removeTest(id) {
                this.fillTests({values: this.tests.filter(s => s.id !== id)});
                this.tempTests = this.tempTests.filter(s => s.id !== id);
            },
            getAvailableTests() {
                return this.completedTests.sort((a, b) => {
                    const [firstDate, secondDate] = [a.endDate, b.endDate];
                    if (!firstDate && !secondDate) {
                        return new Date(b.startDate) - new Date(a.startDate);
                    }
                    if (!firstDate) {
                        return -1;
                    }
                    if (!secondDate) {
                        return 1;
                    }
                    return new Date(secondDate) - new Date(firstDate);
                });
            },
            calcHeight() {
                const heightHeader = document.querySelector('.js-header').offsetHeight;
                const heightFooter = document.querySelector('.js-footer').offsetHeight;
                const heightCompletedHead = this.$refs.completedHead.offsetHeight;
                const heightCompletedDesc = this.$refs.completedDesc.offsetHeight;
                const heightCompletedSearch = this.$refs.completedSearch.offsetHeight;
                const heightCompletedNav = this.$refs.completedNav.offsetHeight;
                const heights = heightHeader + heightFooter + heightCompletedHead + heightCompletedDesc + heightCompletedSearch + heightCompletedNav + 'px';
                this.totalHeight = `calc(100vh - ${heights})`;
            },
            psPageScroll(isScrollToTop = false) {
                updatePS({scroll: this.$refs.ps, isScrollToTop, consumer: () => {
                    this.isScrollViewed = this.$refs.projects.offsetHeight > this.$refs.ps.$el.offsetHeight;
                    if (this.$refs.projects.offsetHeight <= this.$refs.ps.$el.offsetHeight + this.$refs.ps.$el.scrollTop) {
                        this.$refs.ps.$el.scrollTop = this.$refs.projects.offsetHeight - this.$refs.ps.$el.offsetHeight;
                    }
                }});
            },
            isScroll() {
                const projectsContainer = this.$refs.ps.$el.offsetHeight;
                const projectsList = this.$refs.projects.offsetHeight;

                changeDOMElementClass(this.$refs.searchIndent, 'scroll', projectsList > projectsContainer);
                changeDOMElementClass(this.$refs.ps.$el, 'scroll', projectsList > projectsContainer);
            },
            clearFilter() {
                this.filter = "";
            },
            async findTestsByFilter(filter) {
                try {
                    const response = await this.$http.get('/training/service/rest/m/tests/search', { params: { filter } });
                    this.tempTests = this.getAvailableTests().filter(s => response.body.includes(s.id));
                    this.$nextTick(() => {
                        this.isScroll();
                        this.psPageScroll(true);
                    });
                } catch (e) {
                    getErrorMessage(e, 'Ошибка при поиске опросов по фильтру');
                }
            },
            ...mapMutations('manager', [
                'fillTests'
            ]),
            ...mapActions('manager', [
                'getTests'
            ])
        },
        computed: {
            psHeight() {
                return {[this.tempTests.length ? 'height' : 'height']: this.totalHeight};
            },
            ...mapGetters('manager', [
                'completedTests',
                'tests'
            ])
        }
    }
</script>
