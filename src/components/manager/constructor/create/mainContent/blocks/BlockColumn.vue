<template>
    <div class="block-column"
         :class="{'block-column--active': selectedColumnId === column.id || selectedItemId}"
         @click.stop="selectColumn"
    >
        <block-item v-for="item in items"
                    :item="item"
                    :key="item.id"
                    :settings-align-items="settingsAlignItems"
                    @select="selectItem"
                    @changeItems="changeItems"
        />
    </div>
</template>

<script>
    import { isUUID } from "utils/DeveloperUtils";
    import { mapMutations, mapActions } from 'vuex';

    export default {
        name: "BlockColumn",
        data() {
            return {
                selectedItemId: null
            };
        },
        components: {
            BlockItem: () => import("./BlockItem")
        },
        props: {
            column: {
                type: Object,
                default: () => ({})
            },
            selectedColumnId: {
                type: null,
                validator(val) {
                    return isUUID(val) || val === null;
                }
            },
            settingsAlignItems: {
                type: Object,
                default: () => ({})
            },
            pageId: {
                type: null,
                validator(val) {
                    return isUUID(val) || val === null;
                }
            }
        },
        created() {
            this.$bus.$on('changeSelectedBlock', this.checkColumn);
            this.$bus.$on("clearSelected", this.clearSelected);
        },
        beforeDestroy() {
            this.$bus.$off('changeSelectedBlock', this.checkColumn);
            this.$bus.$off("clearSelected", this.clearSelected);
        },
        methods: {
            async changeItems({parentId, items}) {
                this.updateItem({field: 'items', value: items, itemId: parentId, pageId: this.pageId});
                await this.updateBlockItem({blockId: parentId, pageId: this.pageId})
            },
            checkColumn(id) {
                if (this.column.id === id) {
                    this.selectColumn();
                }
            },
            selectColumn() {
                this.$emit("select", this.column.id);
            },
            clearSelected() {
                this.selectedItemId = null;
            },
            selectItem(val = null) {
                const id = val;
                this.$bus.$emit("clearSelected");
                this.selectedItemId = id;
                this.selectColumn();
                this.$bus.$emit("activateType", {blockId: this.selectedItemId, type: "ITEM"});
            },
            ...mapMutations('manager', [
                'updateItem'
            ]),
            ...mapActions('manager', [
                'updateBlockItem'
            ])
        },
        computed: {
            items() {
                return this.column.items || [];
            }
        }
    };
</script>
