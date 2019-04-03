<template>
    <div class="tests-list">
        <test-item v-for="test in tests"
                   :key="test.id"
                   :test="test"
                   :chart-position="{}"
                   :progress-position="{}"
        />
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "tests",
        components: {
            TestItem: () => import('./Test')
        },
        computed: {
            ...mapGetters('manager', [
                'tests'
            ])
        }
    };
</script>

<style lang="less" scoped>
    .tests-list {
        justify-content: space-around !important;
    }
</style>
