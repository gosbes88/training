<template>
    <div class="quiz-page designer-editor__main">
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
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "PagePreview",
        components: {
            BlockItem: () => import("./blocks/BlockItem")
        },
        data() {
            return {
                pageId: null
            };
        },
        created() {
            this.$bus.$on("selectPageForView", this.selectPage);
        },
        beforeDestroy() {
            this.$bus.$off("selectPageForView", this.selectPage);
        },
        computed: {
            page() {
                if (!this.pageId) {
                    return this.getPages.length ? this.getPages[0] : {rows: []};
                }
                return this.blockByType('PAGE', this.pageId, this.pageId) || {rows: []};
            },
            ...mapGetters('manager', [
                'blockByType',
                'getPages'
            ])
        },
        methods: {
            selectPage(id) {
                this.pageId = id;
            },
            getItems(column) {
                if (column.items && column.items.length) {
                    return column.items;
                }

                return [];
            }
        }
    };
</script>
