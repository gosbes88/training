<template>
    <div class="block-row" :style="rowSettings" style="background: rgba(0,0,0,.1);">
        <block-column v-for="column in columns"
                      :column="column"
                      :selected-column-id="selectedColumnId"
                      :key="column.id"
                      :style="{'height': row.settings['height'], 'min-height': row.settings['height'], 'max-height': row.settings['height']}"
                      :settings-align-items="row.settings"
                      :page-id="pageId"
                      @select="selectColumn"
        />
    </div>
</template>

<script>
    import { isUUID } from "utils/DeveloperUtils";

    export default {
        name: "BlockRow",
        data() {
            return {
                selectedColumnId: null
            };
        },
        props: {
            row: {
                type: Object,
                default: () => ({})
            },
            pageId: {
                type: null,
                validator(val) {
                    return isUUID(val) || val === null;
                }
            },
            activeItem: {
                type: null,
                validator(val) {
                    return val === null || typeof val === 'string';
                }
            }
        },
        watch: {
            activeItem: {
                handler(val) {
                    if (val) {
                        debugger;
                        const column = this.columns.find(c => c.items.some(i => i.id === val));
                        if (column) {
                            console.log(column);
                            this.selectColumn(column.id);
                            this.activeItem = null;
                        }
                    }
                },
                immediate: true
            }
        },
        components: {
            BlockColumn: () => import('./BlockColumn')
        },
        created() {
            this.$bus.$on("clearSelected", this.clearSelected);
        },
        beforeDestroy() {
            this.$bus.$off("clearSelected", this.clearSelected);
        },
        computed: {
            columns() {
                return this.row.columns || [];
            },
            rowSettings() {
                return this.columns.length
                    ? {...(this.row.settings || {}), 'height' : 'auto'}
                    : this.row.settings;
            }
        },
        methods: {
            clearSelected() {
                this.selectedColumnId = null;
            },
            selectColumn(val = null) {
                this.selectedColumnId = val;
            }
        }
    };
</script>
