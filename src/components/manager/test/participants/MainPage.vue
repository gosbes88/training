<template>
    <div>
        <div :style="{'opacity': Number(showContent)}">
            <!--Блок количества выбранных сотрудников-->
            <participants-select-block :count="testParticipants.length"/>
            <div class="container-default">
                <div class="selection-participants-main">

                    <!--Блок сотрудников организации для добавления в опрос-->
                    <section class="selection-participants-main__col-1">
                        <div class="members-list">
                            <div class="members-list__item-1">
                                <div class="panel-search panel-search-employee">
                                    <search-block type="employee"
                                                  :disabled="isEmptyObject(filters) && currentEmployees.length === 0"
                                                  :key="1"
                                                  @updateFilters="updateFilters"
                                    />
                                </div>
                            </div>
                            <div class="members-list__item-2">
                                <employees-actions-block v-show="currentEmployees.length > 0 || getAddedEmployees.length > 0"
                                                         @addParticipants="addParticipants(getEmployeeDataIds)"
                                                         :participants-count="getAddedEmployees.length"
                                                         :employees-count="currentEmployees.length"
                                                         :is-empty-filters="isEmptyObject(filters)"
                                                         :is-filled-only-department="isFilledOnlyDepartment(filters)"
                                                         :department-name="getDepartment(filters.departmentId).name"
                                />
                            </div>
                            <vue-perfect-scrollbar class="members-list__item-3 members-list__scroll-left"
                                                   ref="addEmployeesContainer"
                                                   tagname="div"
                                                   :settings="settings"
                                                   :swicher="isEmployeesScrollViewed"
                            >
                                <employees-content-block :is-empty-filters="isEmptyObject(filters)"
                                                         :employees="currentEmployees"
                                                         :added-employees="getAddedEmployees"
                                                         ref="addEmployeesList"
                                />
                            </vue-perfect-scrollbar>
                        </div>
                    </section>

                    <!--Блок выбранных участников опроса-->
                    <section class="selection-participants-main__col-2">
                        <div class="members-list">
                            <load v-if="showParticipantsBlock" class="load-employees" :height="'calc(100% - 136px)'" :width="'calc(100% + 10px)'" :coord="{top: '136px', left: 0}" style="position: absolute; z-index: 10;"/>
                            <div class="members-list__item-1">
                                <div class="panel-search-participant">
                                    <search-block type="participant"
                                                  :disabled="testParticipants.length === 0"
                                                  :key="2"
                                                  @updateFilters="updateFilters"
                                    />
                                </div>
                            </div>
                            <div class="members-list__item-2">
                                <participants-actions-block v-show="currentParticipants.length > 0"
                                                            @removeParticipants="removeParticipants(participants.filter(p => !p.startedSurvey).map(p => p.id))"
                                                            :is-empty-filters="isEmptyObject(filterParticipants)"
                                                            :removable-participants-count="removableParticipantsCount"
                                                            :show-load-connections="showLoadConnections"
                                                            :update-participant-filters="updateParticipantFilters"
                                                            :participate-employees-ids="participateEmployeesIds"
                                />
                            </div>
                            <vue-perfect-scrollbar class="members-list__item-3 members-list__scroll-right"
                                                   tagname="div"
                                                   ref="participantContainer"
                                                   :settings="settings"
                                                   :swicher="isParticipantsScrollViewed">
                                <participants-content-block :update-participant-filters="updateParticipantFilters"
                                                            :is-empty-filters="isEmptyObject(filterParticipants)"
                                                            :participants="currentParticipants"
                                                            :added-participants="testParticipants"
                                />
                            </vue-perfect-scrollbar>
                        </div>
                    </section>

                </div>
            </div>
            <!--Футер страницы с выбором дальнейших шагов-->
            <participants-footer-block :count="testParticipants.length"
                                       :is-back-viewed="true"
                                       :back-title="translate('training.test.participantsBack')"
                                       @cancel="handleBack"
                                       @accept="handleNext"
            />
        </div>
        <!--Блок загрузки-->
        <load v-if="!showContent" :height="loadHeight" :coord="loadCoord"/>
    </div>
</template>

<script>
    import { Optional } from 'utils/Optional';
    import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
    import { fillFormData, sortByFullName, getErrorMessage, updatePS } from 'utils/DeveloperUtils';
    import { FORM_HEADERS, MAX_VISIBLE_EMPLOYEES_COUNT, WAITING_TIME } from '@/utils/Constants';
    import DOMMixin from 'common/mixins/utilsDOM';

    export default {
        name: "MainPageTestParticipants",
        data() {
            return {
                showContent: false,
                exitToPage: false,
                filters: {},
                filterParticipants: {},
                headers: {
                    ...FORM_HEADERS,
                    before(request) {
                        if (this.previousRequest) {
                            this.previousRequest.abort();
                        }
                        this.previousRequest = request;
                    }
                },
                participants: [],
                employeesData: [],
                showLoadConnections: true,
                showParticipantsBlock: false,
                settings: {
                    minScrollbarLength: 60,
                    suppressScrollX: true
                },
                isParticipantsScrollViewed: true,
                isEmployeesScrollViewed: true
            };
        },
        components: {
            ParticipantsFooterBlock: () => import("common/components/participants/footer/ParticipantsFooterBlock"),
            ParticipantsSelectBlock: () => import("common/components/participants/header/ParticipantsSelectBlock"),
            EmployeesActionsBlock: () => import("common/components/participants/actions/EmployeesActionsBlock"),
            ParticipantsActionsBlock: () => import("common/components/participants/actions/ParticipantsActionsBlock"),
            EmployeesContentBlock: () => import("common/components/participants/tables/EmployeesContentBlock"),
            ParticipantsContentBlock: () => import("common/components/participants/tables/ParticipantsContentBlock"),
            SearchBlock: () => import('common/components/participants/search/SearchBlock')
        },
        mixins: [DOMMixin],
        head: {
            title() {
                return {
                    inner: this.translate('training.test.participantsTitle')
                };
            }
        },
        watch: {
            employeeIdsByConnections(val) {
                this.showLoadConnections = false;
            }
        },
        async created() {
            this.$bus.$on("addParticipants", this.addParticipants);
            this.$bus.$on("removeParticipants", this.removeParticipants);
            this.$bus.$on("windowResize", this.updateScrolls);
            this.$bus.$on("windowResize", this.isSelectedEmployeesScroll);

            this.showContent = false;
            await this.getEmployees();
            if (!this.employees.orElse([]).length) {
                window.location = window.location.origin + "/organizations/employees/batch/?testId=" + this.test.id;
            }
            await Promise.all([this.getTest(this.$route.params.id), this.getDepartments(), this.getPositions()]);

            this.participants = this.testParticipants;
            this.employeesData = this.employees.orElse([]).filter(e => !this.participateEmployeesIds.includes(e.id));
            await this.getEmployeesConnections({showAdded: true, employeeIds: this.participants.slice(0, MAX_VISIBLE_EMPLOYEES_COUNT).map(p => p.employeeId)});
            //подгрузка независимо от наличия других загрузок, поэтому не идёт в очереди на выполнении
            this.getEmployeeIdsByConnections({
                employeeIds: this.participateEmployeesIds,
                types: ['DIRECT_MANAGER', 'DIRECT_SUBORDINATES', 'ALL_SUBORDINATES', 'COWORKERS'],
                addedEmployeeIds: this.participateEmployeesIds
            });
            this.showContent = true;
        },
        beforeDestroy() {
            this.$bus.$off("addParticipants", this.addParticipants);
            this.$bus.$off("removeParticipants", this.removeParticipants);
            this.$bus.$off("windowResize", this.updateScrolls);
            this.$bus.$off("windowResize", this.isSelectedEmployeesScroll);
        },
        updated() {
            this.isScrollEmployees();
            this.isSelectedEmployeesScroll();
        },
        computed: {
            loadHeight() {
                return this.exitToPage ? "100%" : "calc(100vh - 50px)";
            },
            loadCoord() {
                return this.exitToPage ? {top: 0, left: 0} : {top: '50px', left: 0};
            },
            removableParticipantsCount() {
                return (this.isEmptyObject(this.filterParticipants) ? this.testParticipants : this.participants).filter(p => !p.startedSurvey).length;
            },
            currentEmployees() {
                return this.employeesData.filter(employee => !this.participateEmployeesIds.includes(employee.id));
            },
            currentParticipants() {
                return this.employees.orElse([]).filter(employee => this.getParticipantIds.includes(employee.id));
            },
            getParticipantIds() {
                return this.participants.map(p => p.employeeId);
            },
            getEmployeeDataIds() {
                return this.employeesData.map(employee => employee.id);
            },
            getAddedEmployees() {
                return !this.isEmptyObject(this.filters)
                    ? this.employeesData.filter(employee => this.participateEmployeesIds.includes(employee.id))
                    : [];
            },
            ...mapGetters('manager', [
                'test',
                'testParticipants',
                'participateEmployeesIds'
            ]),
            ...mapGetters([
                'getDepartment',
                'getEmployeeIds'
            ]),
            ...mapState([
                'employees',
                'employeeIdsByConnections'
            ])
        },
        methods: {
            handleBack() {
                if (this.test.statusType !== 'NEW') {
                    this.exit();
                }
                this.$router.push({name: 'QuizSelection', params: {id: this.test.id}});
            },
            handleNext() {
                if (this.test.statusType !== 'NEW') {
                    this.exit();
                }
                this.$router.push({name: 'CommonInformation', params: {id: this.test.id}});
            },
            updateScrolls() {
                updatePS({scroll: this.$refs.addEmployeesContainer, consumer: () => {
                        if (!this.$refs.addEmployeesContainer) {
                            return;
                        }
                        this.isEmployeesScrollViewed = this.$refs.addEmployeesContainer.$el.scrollHeight > this.$refs.addEmployeesContainer.$el.offsetHeight;
                    }});

                updatePS({scroll: this.$refs.participantContainer, consumer: () => {
                        if (!this.$refs.participantContainer) {
                            return;
                        }
                        this.isParticipantsScrollViewed = this.$refs.participantContainer.$el.scrollHeight > this.$refs.participantContainer.$el.offsetHeight;
                    }});
            },
            isSelectedEmployeesScroll() {
                if (!this.$refs.participantContainer) {
                    return;
                }
                const elem = this.$refs.participantContainer.$el;
                this.changeDOMElementClass(elem, 'members-list__scroll', elem.scrollHeight > elem.offsetHeight);
            },
            isScrollEmployees() {
                const isHeightList = this.$refs.addEmployeesList;
                if (!isHeightList) {
                    return;
                }
                this.changeDOMElementClass(this.$refs.addEmployeesContainer.$el, 'members-list__scroll-left--ind', isHeightList.$el.offsetHeight > this.$refs.addEmployeesContainer.$el.offsetHeight);
            },
            exit() {
                this.exitToPage = true;
                this.showContent = false;
            },
            updateFilters(filters, type) {
                type === 'employee'
                    ? this.updateEmployeeFilters(filters)
                    : this.updateParticipantFilters(filters);
            },
            async updateEmployeeFilters(filters) {
                try {
                    this.$refs.addEmployeesContainer.$el.scrollTop = 0;
                    this.filters = filters || this.filters;
                    if (this.isEmptyObject(this.filters)) {
                        this.employeesData = this.employees.orElse([]).filter(e => !this.participateEmployeesIds.includes(e.id));
                    } else {
                        const response = await this.getEmployeesByFilters(this.filters);
                        this.employeesData  = response.data;
                    }
                } catch (e) {
                    getErrorMessage(e, 'Ошибка при получении списка сотрудников организации по заданным фильтрам');
                }
            },
            updateParticipantFilters(filters) {
                this.filterParticipants = filters || this.filterParticipants;
                this.$refs.participantContainer.$el.scrollTop = 0;
                if (this.isEmptyObject(this.filterParticipants)) {
                    this.showParticipantsBlock = true;
                    /*Отображается знак загрузки полсекунды, для UI, не несёт полезной нагрузки, только отображение*/
                    setTimeout(() => {
                        this.participants = this.testParticipants;
                        this.showParticipantsBlock = false;
                    }, WAITING_TIME);
                } else {
                    this.getParticipantsByFilters(this.filterParticipants);
                }
            },
            async getParticipantsByFilters(filters) {
                try {
                    this.showParticipantsBlock = true;
                    let response = await this.getEmployeesByFilters(filters);
                    response = response.data.map(employee => employee.id);
                    this.participants = this.testParticipants.filter(p => response.includes(p.employeeId));
                    this.showParticipantsBlock = false;
                } catch (e) {
                    getErrorMessage(e, 'Ошибка при получении списка участников опроса по заданным фильтрам');
                }
            },
            async getEmployeesByFilters(filters) {
                const { filter, position, departmentId } = filters;
                const obj = {filter, position, departmentId, employeeIds: [], includeDismissed: false};
                return await this.$http.post('/organizations/service/rest/employees/search', fillFormData(obj), this.headers);
            },
            async updateParticipantsData({isAdded, employeesIds}) {
                isAdded
                    ? await this.addParticipantsToTest({employeesIds})
                    : await this.removeParticipantsToTest({employeesIds});
            },
            async addParticipants(employeesIds) {
                try {
                    this.showParticipantsBlock = true;
                    await this.updateParticipantsData({isAdded: true, employeesIds});
                    if (this.isEmptyObject(this.filterParticipants)) {
                        this.participants = this.testParticipants;
                    } else {
                        await this.getParticipantsByFilters(this.filterParticipants);
                    }
                    await Promise.all([this.getConnections(), this.updateEmployeesData()]);
                    this.updateScrolls();
                    if (!this.testParticipants.length || this.testParticipants.length === this.employees.orElse([]).length) {
                        setTimeout(() => this.showParticipantsBlock = false, WAITING_TIME);
                    } else {
                        this.showParticipantsBlock = false;
                    }
                } catch (e) {
                    getErrorMessage(e, 'Ошибка при добавлении участника');
                }
            },
            async removeParticipants(employeesIds) {
                this.showParticipantsBlock = true;
                await this.updateParticipantsData({isAdded: false, employeesIds});
                this.participants = this.isEmptyObject(this.filterParticipants)
                    ? this.testParticipants
                    : this.participants.filter(p => !ids.includes(p.id));
                await Promise.all([this.getConnections(), this.updateEmployeesData()]);
                this.updateScrolls();
                if (!this.testParticipants.length || this.testParticipants.length === this.employees.orElse([]).length) {
                    setTimeout(() => this.showParticipantsBlock = false, WAITING_TIME);
                } else {
                    this.showParticipantsBlock = false;
                }
            },
            async getConnections() {
                if (this.testParticipants.length && this.testParticipants.length !== this.employees.orElse([]).length) {
                    this.showLoadConnections = true;
                    await this.getEmployeesConnections({showAdded: true, employeeIds: this.participants.slice(0, MAX_VISIBLE_EMPLOYEES_COUNT).map(p => p.employeeId), addedEmployeeIds: this.participateEmployeesIds});
                    this.getEmployeeIdsByConnections({
                        employeeIds: this.participateEmployeesIds,
                        types: ['DIRECT_MANAGER', 'DIRECT_SUBORDINATES', 'ALL_SUBORDINATES', 'COWORKERS'],
                        addedEmployeeIds: this.participateEmployeesIds
                    });
                } else {
                    this.fillAllEmployeesConnections({value: {}});
                    this.fillEmployeeIdsByConnections({value: {}});
                }
            },
            async updateEmployeesData() {
                if (this.isEmptyObject(this.filters)) {
                    this.employeesData = this.employees.orElse([]).filter(e => !this.participateEmployeesIds.includes(e.id));
                } else {
                    let response = await this.getEmployeesByFilters(this.filters);
                    this.employeesData = response.data;
                }

                this.employeesData.sort(sortByFullName);
            },
            isFilledOnlyDepartment(filters) {
                if (typeof filters !== "object" || Object.keys(filters).length === 0) {
                    return false;
                }
                const filledCount = filters => {
                    let count = 0;
                    for (let key in filters) {
                        if (filters.hasOwnProperty(key) && filters[key]) {
                            ++count;
                        }
                    }
                    return count;
                };
                return Object.keys(filters).some(field => field === 'departmentId' && filters[field]) ? filledCount(filters) === 1 : false;
            },
            ...mapActions('manager', [
                'getTest',
                'addParticipantsToTest',
                'removeParticipantsToTest'
            ]),
            ...mapActions([
                'getDepartments',
                'getPositions',
                'getEmployees',
                'getEmployeesConnections',
                'getEmployeeIdsByConnections'
            ]),
            ...mapMutations([
                'fillAllEmployeesConnections',
                'fillEmployeeIdsByConnections'
            ])
        }
    };
</script>
