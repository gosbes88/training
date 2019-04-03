<template>
    <div class="flex-center" @click.stop="select">

        <!--текст-->
        <div v-if="item.contentType === 'TEXT' && (item.content || (item.items && item.items.length))"
             :is="blockText"
             :is-production="isProduction"
             :selected-items="selectedItems"
             :settings-align-items="settingsAlignItems"
             @check="check"
             @selectInteractiveElement="selectInteractiveElement"
             @changeItems="changeItems"
             :item="item"
        ></div>

        <!--картинка-->
        <div v-else-if="item.contentType === 'IMAGE' && (item.url || (item.items && item.items.length))"
             :is="blockImage"
             class="block-image"
             :is-production="isProduction"
             :selected-items="selectedItems"
             :settings-align-items="settingsAlignItems"
             @check="check"
             @selectInteractiveElement="selectInteractiveElement"
             @changeItems="changeItems"
             :item="item"
        ></div>

        <!--элемент-->
        <div v-else-if="item.contentType === 'ELEMENT' && (item.content || item.items)" class="block-image flex-center">
            <div class="flex-center">
                <span v-text="item.settings['type']"></span>
                <span v-text="item.content"></span>
            </div>
        </div>
    </div>
</template>

<script>
    import { isUUID } from "utils/DeveloperUtils";

    export default {
        name: "BlockItem",
        props: {
            item: {
                type: Object,
                default: () => ({})
            },
            isProduction: {
                type: Boolean,
                default: false
            },
            selectedItems: {
                type: Array,
                default: () => []
            },
            settingsAlignItems: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            BlockText: () => import('./BlockText'),
            BlockInteractiveText: () => import('./BlockInteractiveText'),
            BlockImage: () => import('./BlockImage'),
            BlockInteractiveImage: () => import('./BlockInteractiveImage')
        },
        created() {
            this.$bus.$on("activateItem", this.activateItem);
        },
        beforeDestroy() {
            this.$bus.$off("activateItem", this.activateItem);
        },
        methods: {
            activateItem(id) {
                if (id === this.item.id) {
                    this.select();
                }
            },
            select() {
                this.$emit("select", this.item.id);
            },
            /*Выбор интерактивного элемента*/
            check(id) {
                this.$emit("check", id);
            },
            selectInteractiveElement({elementId, parentId}) {
                if (!this.isProduction) {
                    this.$bus.$emit('selectInteractiveElement', {elementId, parentId});
                }
            },
            /*parentId - id элемента, в котором находится список элементов, items - список элементов*/
            changeItems({parentId, items}) {
                this.$emit("changeItems", {parentId, items});
            }
        },
        computed: {
            blockText() {
                return this.item.itemType === 'INTERACTIVE' ? 'BlockInteractiveText' : 'BlockText';
            },
            blockImage() {
                return this.item.itemType === 'INTERACTIVE' ? 'BlockInteractiveImage' : 'BlockImage';
            }
        }
    };
</script>
