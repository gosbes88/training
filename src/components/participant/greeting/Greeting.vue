<template>
    <greeting-base
        :show-content="showContent"
        :current-component="'TAT'"
        :task="getTestData"
        :task-manager="getManagerTest"
        @startTask="startTest"
    />
</template>

<script>
    import { getErrorMessage } from 'utils/DeveloperUtils';

    export default {
        name: "Greeting",
        data() {
            return {
                showContent: false,
                //todo dummy data
                testData: {
                    id: 'ddd',
                    name: 'Test' + 'ddd',
                    mode: 'WIZARD',
                    startDate: null,
                    endDate: null,
                    statusType: 'NEW',
                    appeal: 'Hello, there!'
                },
                managerTestData: {
                    avatar: 'aaa.png',
                    id: '05b6c8b9-444c-4e48-ad4e-4a358c17c467',
                    name: 'Test',
                    lastName: 'Test',
                    position: 'position'
                }
            };
        },
        components: {
            GreetingBase: () => import('common/components/participant/greeting/GreetingBase.vue')
        },
        created() {
            this.$store.commit('setFooterView', false);
            this.$store.commit('setHeaderView', false);
            this.showContent = true;
        },
        computed: {
            getTestData() {
                return this.testData;
            },
            getManagerTest() {
                return this.managerTestData;
            }
        },
        methods: {
            startTest() {
                this.$http.post(`/training/service/rest/p/tests/${this.$route.params.id}/start`)
                    .then(response => {
                        if (response.ok) {
                            this.$router.push({name: 'Answer', params: {id: this.$route.params.id}});
                        }
                    })
                    .catch(e => getErrorMessage(e, 'Ошибка при старте тестирования участника \n'));
            }
        }

    }
</script>
