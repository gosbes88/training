<template>
    <vue-perfect-scrollbar tagname="div"
                           ref="ps"
                           :settings="settings"
                           :swicher="showScroll"
    >
        <div ref="content" class="editor-settings">
            <slot/>

            <template v-if="isUUID(currentPageId)">
                <!--Действия по добавлению/удалению блоков-->
                <item-actions-block v-if="currentPageId"
                                    :block-type="blockType"
                                    :block-id="blockId"
                                    :page-id="currentPageId"
                                    @add="addBlock"
                                    @remove="remove"
                />

                <div class="br-dashed" v-if="blockType !== 'PAGE'"></div>

                <row-properties v-if="blockType !== 'PAGE'"
                                :block-type="'ROW'"
                                :block-id="getRowId"
                                :page-id="currentPageId"
                                @update="updateRowSettings"
                />

                <div class="br-dashed" v-if="blockType === 'ITEM'"></div>

                <!--Базовые свойства элемента(тип содержимого, простой или интерактивный и т.д.)-->
                <basic-properties v-if="blockType === 'ITEM'"
                                  :block-type="blockType"
                                  :block-id="blockId"
                                  :page-id="currentPageId"
                                  @update="updateBlock"
                />

                <!--Детализация свойств-->
                <custom-properties v-if="blockType === 'ITEM' && block.itemType !== 'INTERACTIVE'"
                                   :block-type="blockType"
                                   :block-id="blockId"
                                   :page-id="currentPageId"
                                   @update="updateBlock"
                />

                <div class="br-dashed" v-if="blockType === 'ITEM' && block.itemType === 'INTERACTIVE' && block.classType"></div>

                <!--Свойства интерактивности-->
                <interactive-properties v-if="blockType === 'ITEM' && block.itemType === 'INTERACTIVE' && block.classType"
                                        :block-type="blockType"
                                        :block-id="blockId"
                                        :page-id="currentPageId"
                                        @update="updateBlock"
                />


                <template v-if="blockType === 'ITEM' && block.itemType === 'INTERACTIVE' && block.classType">
                    <h4 class="title-middle mb-1" v-lang.training.constructors.addElement></h4>
                    <!--Детализация свойств-->
                    <a class="designer-toolbar__link button-text mr-2"
                       v-if="block.contentType === 'TEXT' && !isInteractiveElementViewed"
                       href="javascript:void(0);"
                       @click="addInteractiveElement(block.contentType)"
                       v-lang.training.constructors.TEXT
                    ></a>
                    <a class="designer-toolbar__link button-text"
                       v-else-if="block.contentType === 'IMAGE' && !isInteractiveElementViewed"
                       href="javascript:void(0);"
                       @click="addInteractiveElement(block.contentType)"
                       v-lang.training.constructors.IMAGE
                    ></a>

                    <a class="designer-toolbar__link button-text"
                       v-else
                       href="javascript:void(0);"
                       @click="interactiveElement = null"
                       v-lang.training.common.cancel
                    ></a>
                </template>

                <!--Отображение настроек для вложенного элемента внутри интерактивного-->
                <custom-properties class="mt-1"
                                   v-if="isInteractiveElementViewed"
                                   :block-type="'ITEM'"
                                   :block-id="blockId"
                                   :page-id="currentPageId"
                                   :interactive-element="interactiveElement"
                                   @update="updateInteractiveItem"
                                   @addItem="addItemToBlock"
                />
            </template>
            <div class="nav-list nav-list--theme-dark nav-list--ind-left" v-else-if="currentPageId">
                <div v-for="page in getPages"
                     :key="page.id"
                     class="nav-list__item"
                >
                    <div :class="{'link-edit--active': page.id === selectedPageForView}"
                         class="link-edit"
                         @click="selectPageForView(page.id)">

                        <div class="link-edit__title">
                            <a href="javascript:void(0);" v-text="page.name"></a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <popup v-if="showPopup" @close="showPopup = false" @confirm="removePage">
            <div slot="main">
                <p class="confirm-content">{{ translate('training.constructors.removePAGE') | question }}</p>
            </div>
        </popup>
    </vue-perfect-scrollbar>
</template>

<script>
    import { updatePS, isUUID, generateUUID } from "utils/DeveloperUtils";
    import { mapMutations, mapActions, mapGetters } from 'vuex';

    export default {
        name: "EditorSettings",
        data() {
            return {
                showScroll: true,
                showPopup: false,
                parentType: {
                    "ITEM": "COLUMN",
                    "COLUMN": "ROW",
                    "ROW": "PAGE",
                    "PAGE": null
                },
                currentPageId: null,
                blockType: 'PAGE',
                blockId: null,
                interactiveElement: null,
                selectedPageForView: null,
                settings: {
                    minScrollbarLength: 60
                }
            }
        },
        components: {
            RowProperties: () => import("./itemProperties/RowProperties"),
            BasicProperties: () => import("./itemProperties/BasicProperties"),
            InteractiveProperties: () => import("./itemProperties/InteractiveProperties"),
            CustomProperties: () => import("./itemProperties/CustomProperties"),
            ItemActionsBlock: () => import("./ItemActionsBlock"),
            Popup: () => import("common/components/Popup")
        },
        watch: {
            currentPageId(val) {
                if (val === 'RESULT') {
                    setTimeout(() => {
                        this.selectPageForView(this.getPages[0].id);
                    }, 0);
                }
            }
        },
        filters: {
            question(val) {
                return val + '?';
            }
        },
        created() {
            this.$bus.$on('selectInteractiveElement', this.selectInteractiveElement);
            this.$bus.$on('activateType', this.activateBlock);
            this.$bus.$on("openPage", this.setCurrentPage);
            this.$bus.$on('windowResize', this.psPageScroll);
        },
        beforeDestroy() {
            this.$bus.$off('selectInteractiveElement', this.selectInteractiveElement);
            this.$bus.$off("openPage", this.setCurrentPage);
            this.$bus.$off('activateType', this.activateBlock);
            this.$bus.$off('windowResize', this.psPageScroll);
        },
        updated() {
            this.psPageScroll();
        },
        computed: {
            block() {
                return this.blockByType(this.blockType, this.currentPageId, this.blockId);
            },
            isInteractiveElementViewed() {
                return this.blockType === 'ITEM' && this.interactiveElement;
            },
            getRowId() {
                if (this.blockType === 'ROW') {
                    return this.blockId;
                }
                return this.getParentBlock("ROW", this.currentPageId, this.blockId).id;
            },
            ...mapGetters('manager', [
                'blockByType',
                'getPages',
                'getParentBlock'
            ])
        },
        methods: {
            addInteractiveElement(type) {
                this.interactiveElement = {id: generateUUID(), contentType: type};
            },
            selectInteractiveElement({elementId, parentId}) {
                if (this.interactiveElement && this.interactiveElement.id === elementId) {
                    this.interactiveElement = null;
                } else {
                    const item = this.blockByType('ITEM', this.currentPageId, parentId);
                    this.interactiveElement = (item.items || []).find(i => i.id === elementId);
                }
            },
            selectPageForView(val) {
                this.selectedPageForView = val;
                this.$bus.$emit("selectPageForView", val);
            },
            isUUID(val) {
                return isUUID(val);
            },
            async updateRowSettings({field, value}) {
                if (field === 'settings') {
                    await this.updateRow({pageId: this.currentPageId, blockId: this.getRowId, settings: value})
                }
            },
            async updateInteractiveItem({field, value}) {
                this.interactiveElement = {...this.interactiveElement, [field]: value};
                this.updateItem({field: 'items', value: this.interactiveElement, itemId: this.blockId, pageId: this.currentPageId});
                await this.updateBlockItem({blockId: this.blockId, pageId: this.currentPageId});
            },
            async addItemToBlock(value) {
                this.updateItem({field: 'items', value: {...this.interactiveElement, ...value}, itemId: this.blockId, pageId: this.currentPageId});
                await this.updateBlockItem({blockId: this.blockId, pageId: this.currentPageId});
                this.interactiveElement = null;
            },
            async updateBlock({ field, value }) {
                this.updateItem({field, value, itemId: this.blockId, pageId: this.currentPageId});
                await this.updateBlockItem({blockId: this.blockId, pageId: this.currentPageId});
            },
            activateBlock({ blockId, type }) {
                this.blockType = type;
                this.blockId = blockId;
            },
            setCurrentPage(id) {
                this.currentPageId = id;
                const page = id ? this.blockByType('PAGE', this.currentPageId, this.currentPageId) : null;
                this.blockType = this.getBlockType(page);
                this.blockId = this.getBlockId(page);
                if (page && page.rows && page.rows.length) {
                    setTimeout(() => this.$bus.$emit('activateItem', this.blockId), 0);
                }
            },
            getBlockType(page) {
                if (page) {
                    return page.rows && page.rows.length ? 'ITEM' : 'PAGE';
                }
                return null;
            },
            getBlockId(page) {
                if (page) {
                    return page.rows && page.rows.length
                        ? page.rows[0].columns[0].items[0].id
                        : this.currentPageId;
                }
                return null
            },
            async addBlock({type, blockId}) {
                await this.addNewBlock({ blockType: type, pageId: this.currentPageId, blockId: blockId || this.block.id});
            },
            /**
             * Удаление текущего блока с переходом фокуса на его родителя
             */
            remove(type) {
                debugger;

                if (type === 'PAGE') {
                    this.showPopup = true;
                } else {
                    console.log(type, this.blockType);
                    const newType = type === this.blockType
                        ? this.parentType[type]
                        : this.blockType;
                    const newBlockId = type === this.blockType
                        ? this.getParentBlock(newType, this.currentPageId, this.blockId).id
                        : this.blockId;

                    //     const [blockType, pageId, blockId] = [type, this.currentPageId, this.block.id];
                        this.blockType = newType;
                        this.blockId = newBlockId;
                        this.$bus.$emit('changeSelectedBlock', this.blockId);
                    //     await this.removeBlock({blockType, pageId, blockId});
                }
                // const newType = this.parentType[type];
                // const newBlockId = this.getParentBlock(newType, this.currentPageId, this.blockId).id;
                // if (type === 'PAGE') {
                //     const pageId = this.currentPageId;
                //     this.$bus.$emit("openPage", null);
                //     await this.removeBlock({blockType: type, pageId});
                // } else {
                //     const [blockType, pageId, blockId] = [type, this.currentPageId, this.block.id];
                //     this.blockType = newType;
                //     this.blockId = newBlockId;
                //     this.$bus.$emit('changeSelectedBlock', this.blockId);
                //     await this.removeBlock({blockType, pageId, blockId});
                // }
            },
            async removePage() {
                const pageId = this.currentPageId;
                this.$bus.$emit("openPage", null);
                await this.removeBlock({blockType: 'PAGE', pageId});
                this.showPopup = false;
            },
            psPageScroll() {
                updatePS({
                    scroll: this.$refs.ps,
                    consumer: () => {
                        setTimeout(() => {
                            if (!this.$refs.ps) {
                                return;
                            }

                            this.showScroll = this.$refs.content.offsetHeight > this.$refs.ps.$el.offsetHeight;
                        }, 0);
                    }
                });
            },
            ...mapMutations('manager', [
                'updateItem',
                'fillQuizData'
            ]),
            ...mapActions('manager', [
                'updateRow',
                'updateBlockItem',
                'removeBlock',
                'addNewBlock'
            ])
        }
    };
</script>

<style lang="less">
    .confirm-content {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
