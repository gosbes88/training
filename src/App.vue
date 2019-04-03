<template>
    <vue-perfect-scrollbar id="app"
                           class="page-section"
                           ref="ps"
                           :class="{'page-footer-fixed-2-blocks': $store.state.hasNavPanel && $store.state.showFooter, 'page-footer-fixed-1-block': $store.state.hasNavPanel && !$store.state.showFooter}"
                           :settings="settings"
                           :swicher="isScrollViewed"
                           tagname="div"
    >
        <div class="js-header header-wrap header-org-wrap" ref="header" v-if="error">
            <error-page-header/>
        </div>

        <div class="header-wrap js-header header-org-wrap" :class="{'header-pretend': $store.getters.isPretend}" ref="header" v-else-if="$store.state.showHeader && !error" v-show="getUserName">
            <common-header :organization-url="organizationUrl"
                           :organizations="getOrganizations"
                           :select-organization="getSelectOrganization"
                           :user-name="getUserName"
                           :is-notification-viewed="$store.state.licenseNotification > 0 && /^(\/m)$|^(\/m\/)/.test($route.fullPath)"
                           :current-component="'TAT'"
                           :organization-info="orgInfo"
                           :available-components="getAvailableComponents"
                           @change="changeOrganization"
            >
                <router-link slot="logo" :to='mainLink' class="logo-link js-remove-storage">
                    <img class="logo-link__img" src="/training/static/img/training-logo.svg">
                    <span class="logo-link__title" v-lang.training.common.trainingTitle></span>
                </router-link>
                <div slot="switch" class="auth__item" v-if="isSwitchShowed">
                    <a href="javascript: void(0);" v-text="switchTo" @click.prevent="changeRole"></a>
                </div>
            </common-header>
        </div>

        <main class="main-wrap" ref="main">
            <popup-error v-if="error" :code="error" @close="error = null"/>
            <router-view/>
        </main>

        <feedback v-if="showFeedback" @hide="changeFeedback(false)"
                  :component="'TAT'"
        />

        <div class="footer-wrap js-footer"
             ref="footer"
             v-show="$store.state.showFooter"
             :class="{'footer-wrap-bg': $store.state.filledFooter}">

            <common-footer :user-locale="$store.getters.getUserLocale"
                           :change-locale="changeLocale"
                           @show="changeFeedback(true)"
            />
        </div>

        <personal-data-cookie-tooltip v-if="$store.getters.showCookiePd"
                             @accept="$store.dispatch('acceptUserPdCookie', {userId: $store.getters.getUserId, baseUrl: BASE_URL})"
        />
    </vue-perfect-scrollbar>
</template>

<script>
    import { jeratixVersionInfo } from 'utils/VersionInfo';
    import { mapGetters, mapState } from 'vuex';
    import { ObjectUtils } from "./utils/ObjectUtils";
    import { LOGIN_URL, BASE_URL } from "./utils/Constants";
    import redirect from 'utils/Redirect';

    export default {
        name: 'App',
        data() {
            return {
                languageTypes: {
                    'ru-RU': 'ru',
                    'en-US': 'en',
                    'undefined': 'ru',
                    'default': 'ru'
                },
                settings: {
                    minScrollbarLength: 60
                },
                isScrollViewed: true,
                showFeedback: false,
                error: false,
                BASE_URL
            };
        },
        components: {
            Feedback: () => import('common/components/Feedback'),
            CommonHeader: () => import('common/components/CommonHeader'),
            CommonFooter: () => import('common/components/CommonFooter'),
            ErrorPageHeader: () => import('./components/common/ErrorPageHeader'),
            PersonalDataCookieTooltip: () => import('common/components/PersonalDataCookieTooltip'),
            PopupError: () => import('common/components/error/PopupError')
        },
        head: {
            meta () {
                return [
                    {"charset": 'utf-8', undo: false},
                    {"http-equiv": "X-UA-Compatible", "content": "IE=edge", undo: false},
                    {"name": "description", "content": "Home page", undo: false},
                    {"name": "viewport", "content": "width=1000", undo: false},
                    {"name": "revision", "content": jeratixVersionInfo, undo: false}
                ];
            },
            link () {
                return [
                    {"rel": "apple-touch-icon", "type": "image/png", "href": "/training/static/img/favicon/favicon-training.png", undo: false},
                    {"rel": "apple-touch-icon", "sizes": "57x57", "href": "/training/static/img/favicon/favicon-training-57.png", undo: false},
                    {"rel": "apple-touch-icon", "sizes": "72x72", "href": "/training/static/img/favicon/favicon-training-72.png", undo: false},
                    {"rel": "apple-touch-icon", "sizes": "76x76", "href": "/training/static/img/favicon/favicon-training-76.png", undo: false},
                    {"rel": "apple-touch-icon", "sizes": "114x114", "href": "/training/static/img/favicon/favicon-training-114.png", undo: false},
                    {"rel": "apple-touch-icon", "sizes": "120x120", "href": "/training/static/img/favicon/favicon-training-120.png", undo: false},
                    {"rel": "apple-touch-icon", "sizes": "144x144", "href": "/training/static/img/favicon/favicon-training-144.png", undo: false},
                    {"rel": "apple-touch-icon", "sizes": "152x152", "href": "/training/static/img/favicon/favicon-training-152.png", undo: false},
                    {"rel": "apple-touch-icon", "sizes": "180x180", "href": "/training/static/img/favicon/favicon-training-180.png", undo: false},
                    {"rel": "icon", "type": "image/png", "href": "/training/static/img/favicon/favicon-training.png", undo: false},
                    {"rel": "icon", "type": "image/svg+xml", "href": "/training/static/img/favicon/favicon.svg", undo: false},
                    {"rel": "stylesheet", "href": "https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700|Roboto:400,700&amp;subset=cyrillic,cyrillic-ext,latin-ext", undo: false}
                ];
            }
        },
        watch: {
            hasNavPanel(val) {
                if (val && this.showFooter) {
                    document.querySelector(".js-page-section").classList.add("page-footer-fixed-2-blocks");
                } else {
                    document.querySelector(".js-page-section").classList.remove("page-footer-fixed-2-blocks");
                }
            },
            showFooter(val) {
                if (val && this.hasNavPanel) {
                    document.querySelector(".js-page-section").classList.add("page-footer-fixed-2-blocks");
                } else {
                    document.querySelector(".js-page-section").classList.remove("page-footer-fixed-2-blocks");
                }
            }
        },
        created() {
            window.addEventListener('resize', this.notifyChildResize.bind(this));
            document.addEventListener('click', this.notifyChildClick.bind(this));
            this.$bus.$on('windowResize', this.pageScroll);
            this.$bus.$on('error', this.errorHandler);

            this.$store.dispatch('getUserData')
                .then(e => {
                    this.$store.commit('changeContentLoad', true);
                    this.language = this.languageTypes[this.getSelectOrganization.locale] || this.languageTypes['default'];
                    redirect(this, 'training');
                }).then(e =>
                    Promise.all([
                        this.$store.dispatch('getLicenseNotification'),
                        this.$store.dispatch('getProgressIndicatorsData')
                    ])
                );
        },
        updated() {
            this.pageScroll();
        },
        beforeDestroy() {
            this.$bus.$off('windowResize', this.pageScroll);
        },
        methods: {
            changeFeedback(val) {
                this.showFeedback = val;
            },
            pageScroll() {
                const container = this.$refs.ps;

                if (!container) {
                    return;
                }

                const root = this;
                setTimeout(() => {
                    container.$el.scrollTop = 0;
                    root.isScrollViewed = container.$el.offsetHeight < (ObjectUtils.getField(root.$refs.header, 'offsetHeight', 0) + ObjectUtils.getField(root.$refs.footer, 'offsetHeight', 0) + ObjectUtils.getField(root.$refs.main, 'offsetHeight', 0));
                    container.update();
                }, 300);
            },
            notifyChildResize() {
                this.$bus.$emit('windowResize');
            },
            notifyChildClick() {
                this.$bus.$emit('documentClick');
            },
            changeOrganization(organization) {
                this.$store.dispatch('changeOrganization', organization.id);
            },
            changeRole() {
                //TODO: компоненты для страницы менеджера и участника
                /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? this.$router.push({name: "Participant"}) : this.$router.push({name: "Manager"});
            },
            changeLocale(locale) {
                this.$store.dispatch('changeUserLocale', {userId: this.$store.getters.getUserId, locale: locale});
            },
            errorHandler(code) {
                this.error = code;
            }
        },
        computed: {
            orgInfo() {
                return {
                    org: this.organizationTitle,
                    orgInfo: this.organizationInfo,
                    orgLogo: '/training/static/img/logo-valadorus.svg'
                };
            },
            getOrganizations() {
                const existsOrganizations = this.$store.getters.getOrganizations;

                return Object.keys(existsOrganizations).map(key => {
                    return {
                        id: existsOrganizations[key].organizationId,
                        name: existsOrganizations[key].organizationName
                    };
                });
            },
            organizationTitle() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? this.translate('training.common.settings') : this.translate('training.common.accountUser');
            },
            organizationInfo() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? this.translate('training.common.settingsInfo') : this.translate('training.common.accountUserInfo');
            },
            mainLink() {
                //TODO: компоненты для страницы менеджера и участника
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? {name: "Manager"} : {name: "Participant"};
            },
            organizationUrl() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? "/organizations" : "/organizations/account/user";
            },
            isSwitchShowed() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) && this.hasUser || /^(\/p)$|^(\/p\/)/.test(this.$route.fullPath) && this.hasManager;
            },
            switchTo() {
                return /^(\/m)$|^(\/m\/)/.test(this.$route.fullPath) ? this.translate('training.common.participantSwitch') : this.translate('training.common.manager');
            },
            ...mapGetters([
                'getUserName',
                'getSelectOrganization',
                'hasUser',
                'hasManager',
                'getAvailableComponents'
            ]),
            ...mapState([
                'showFooter',
                'hasNavPanel'
            ])
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    @import "common.less";
    @import "calendar.less";
    @import "error-page.less";
    @import "home.less";
    @import "manager-completed.less";
    @import "manager-statistic.less";
    @import "manager-start-project.less";
    @import "manager-create-project-two-columns.less";
    @import "manager-create-project-finish.less";
    @import "participant-home.less";
    @import "participant-stage-greeting.less";
    @import "participant-stage-result.less";
    @import "assets/_training.less";
</style>
