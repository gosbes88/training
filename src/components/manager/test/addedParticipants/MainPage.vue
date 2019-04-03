<template>
    <participant-page :task="test"
                      :participants="testParticipants"
                      :show-content.sync="showContent"
                      :back-url="{name: 'Finish', params: {id : test.id}}"
                      :percent-by-id="percentById"
    />
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import { EMPLOYEES_LIMIT } from '@/utils/Constants';

    export default {
        name: "AddedParticipantsMainPage",
        data() {
            return {
                showContent: false
            };
        },
        components: {
            ParticipantPage: () => import('common/components/addedParticipants/ParticipantsPage')
        },
        async created() {
            this.$store.commit('setHasNavPanel', true);
            this.showContent = false;
            this.fillEmployees({values: null});
            await this.getTest(this.$route.params.id);
            const params = {filter: null, position: null, departmentId: null, employeeIds: this.getParticipateEmployeesIds, limit: EMPLOYEES_LIMIT, offset: 0, sort: 'ASC', includeDismissed: false};
            await Promise.all([this.getDepartmentsByEmployees(this.getParticipateEmployeesIds), this.getPositionsByEmployees(this.getParticipateEmployeesIds), this.getEmployeesByFilters(params)]);
            this.showContent = true;
            this.$bus.$on('windowResize', this.updatePage);
        },
        beforeDestroy() {
            this.$bus.$off('windowResize', this.updatePage);
        },
        computed: {
            getParticipateEmployeesIds() {
                return this.testParticipants.map(p => p.employeeId);
            },
            percentById() {
                return this.testParticipants.reduce((result, p) => {
                    const answers = p.answers && p.answers.length ? p.answers.length : 0;
                    return {...result, [p.employeeId]: (answers / this.testPages.length * 100)};
                }, {});
            },
            ...mapGetters('manager', [
                'test',
                'testParticipants',
                'testPages'
            ])
        },
        updated() {
            this.updatePage(0);
        },
        mounted() {
            this.updatePage();
        },
        methods: {
            back(path) {
                this.showContent = false;
                this.$router.push(path);
            },
            updatePage(time = 200) {
                setTimeout(() => {
                    this.pageNavFooter();
                }, time);
            },
            pageNavFooter: function() {
                if(document.querySelector(".js-page-nav-footer")) {
                    const elBlock = document.querySelector(".js-page-nav-footer-wrap");
                    const footerCoorY = document.querySelector(".js-footer").getBoundingClientRect().top;
                    const elCoorY = document.querySelector('.js-page-nav-footer').getBoundingClientRect().top;
                    const elHeight = document.querySelector('.js-page-nav-footer').offsetHeight;

                    if (footerCoorY === (elHeight + elCoorY)) {
                        elBlock.classList.add("page-nav-footer__wrap--show");
                        document.querySelector(".js-footer").classList.add("footer-wrap--sticky");
                    } else {
                        elBlock.classList.remove("page-nav-footer__wrap--show");
                        document.querySelector(".js-footer").classList.remove("footer-wrap--sticky");
                    }
                }
            },
            ...mapActions('manager', [
                'getTest'
            ]),
            ...mapActions([
                'getDepartmentsByEmployees',
                'getPositionsByEmployees',
                'getEmployeesByFilters'
            ]),
            ...mapMutations([
                'fillEmployees'
            ])
        }
    };
</script>

<style lang="less" scoped>
    .pointer {
        cursor: pointer;
    }
</style>
