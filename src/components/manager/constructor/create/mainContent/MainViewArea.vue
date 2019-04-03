<template>
    <vue-perfect-scrollbar
        class="designer-editor__main"
        tagname="div"
        ref="ps"
        :settings="settings"
        :swicher="showScroll"
        @click.native.self="clickPage">

        <div ref="list" v-if="currentPageId && pageRows(currentPageId).length">
            <block-row v-for="(row, index) in pageRows(currentPageId)" :key="row.id"
                       :row="row"
                       :page-id="currentPageId"
                       :active-item.sync="activeItem"
            />
        </div>

        <div v-else class="flex-center text-link-gray">
            <i class="arrow-left-light"></i>
            <div class="empty-actions" v-lang.training.constructors.emptyActions></div>
        </div>
    </vue-perfect-scrollbar>
</template>

<script>
    import { mapGetters } from 'vuex';
    import DOMMixin from 'common/mixins/utilsDOM';
    import { updatePS, changeDOMElementClass, isUUID } from "utils/DeveloperUtils";

    export default {
        name: "MainViewArea",
        data() {
            return {
                showScroll: true,
                activeItem: null,
                currentPageId: null,
                settings: {
                    minScrollbarLength: 60
                }
            };
        },
        components: {
            BlockRow: () => import('./blocks/BlockRow')
        },
        mixins: [ DOMMixin ],
        created() {
            this.$bus.$on("openPage", this.setCurrentPage);
            this.$bus.$on('windowResize', this.isScroll);
            this.$bus.$on("activateItem", this.activateItem);
            this.$bus.$on('windowResize', this.psPageScroll);
        },
        beforeDestroy() {
            this.$bus.$off("openPage", this.setCurrentPage);
            this.$bus.$off('windowResize', this.isScroll);
            this.$bus.$off("activateItem", this.activateItem);
            this.$bus.$off('windowResize', this.psPageScroll);
        },
        updated() {
            this.psPageScroll();
            this.isScroll();
        },
        computed: {
            ...mapGetters('manager', [
                'pageRows'
            ])
        },
        methods: {
            activateItem(id) {
                console.log(id);
                this.activeItem = id;
            },
            clickPage() {
                this.$bus.$emit("activateType", {blockId: this.currentPageId, type: "PAGE" });
                this.$bus.$emit("clearSelected");
            },
            setCurrentPage(id) {
                if (id && !isUUID(id)) {
                    return;
                }
                this.currentPageId = id;

            },
            psPageScroll() {
                updatePS({
                    scroll: this.$refs.ps,
                    consumer: () => {
                        setTimeout(() => {
                            if (!this.$refs.ps) {
                                return;
                            }

                            this.showScroll = this.$refs.list.offsetHeight > this.$refs.ps.$el.offsetHeight;
                        }, 0);
                    }
                });
            },
            isScroll() {
                if (!this.$refs.ps) {
                    return;
                }
                const elem = this.$refs.ps.$el;
                changeDOMElementClass(elem, 'designer-editor__main--ind', elem.scrollHeight > elem.offsetHeight);
            }
        }
    };
</script>
