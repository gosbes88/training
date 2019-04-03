<template>
    <div v-if="getTest.quiz">
        <div v-for="page in getTest.quiz.pages" :key="page.id">
            <div v-for="row in page.rows" :key="row.id" class=" block-row quiz-page__row" :class="`row-columns-${row.columns.length}`">
                <div v-for="column in row.columns"
                     :key="column.id"
                     class="block-column-prepared"
                     :style="{'height': row.settings['height'], 'min-height': row.settings['height'], 'max-height': row.settings['height']}"
                >
                    <block-item v-for="item in getItems(column)"
                                :key="item.id"
                                :is-production="true"
                                :selected-items="[]"
                                :settings-align-items="row.settings"
                                :item="item"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: "Testing",
        components: {
            BlockItem: () => import("../../manager/constructor/create/mainContent/blocks/BlockItem")
        },
        async created() {
            await this.getTestAction();
        },
        computed: {
            ...mapGetters('participant', [
                'getTest'
            ])
        },
        methods: {
            getItems(column) {
                if (column.items && column.items.length) {
                    return column.items;
                }

                return [];
            },
            ...mapActions('participant', [
                'getTestAction'
            ])
        }
    }
</script>
