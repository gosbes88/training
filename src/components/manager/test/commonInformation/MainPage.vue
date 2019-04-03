<template>
    <appeal :show-content="showContent"
            :task="test"
            :page-title="translate('training.test.title')"
            :head-title="translate('training.test.commonInformation')"
            :task-name-label="translate('training.test.name')"
            @goToNext="save"
            @update="update"
    />
</template>

<script>
    import { mapMutations, mapActions, mapGetters } from 'vuex';

    export default {
        name: "MainPageTestCommonInformation",
        data() {
            return {
                showContent: false
            };
        },
        components: {
            Appeal: () => import('common/components/appeal/Main')
        },
        async created() {
            this.showContent = false;
            await this.getTest(this.$route.params.id);
            if (this.test.statusType !== 'NEW') {
                this.$router.push({name: 'Finish', params: { id: this.$route.params.id}});
                return;
            }
            if (!this.test.lastStage || this.test.lastStage !== 'CommonInformation') {
                this.fillTest({value: {...this.test, lastStage: "CommonInformation"}});
                this.saveTest();
            }
            this.showContent = true;
        },
        computed: {
            ...mapGetters('manager', [
                'test'
            ])
        },
        methods: {
            update({type, value}) {
                this.changeField({type, value});
                this.updateTest({field: type, value});
            },
            async save() {
                await this.saveTest();
                this.$router.push({name: 'Finish', params: {id: this.test.id}});
            },
            ...mapMutations('manager', [
                'fillTest',
                'changeField'
            ]),
            ...mapActions('manager', [
                'updateTest',
                'getTest',
                'saveTest'
            ])
        }
    };
</script>
