<template>
    <div class="media-storage">
        <a class="btn-prev btn-prev--theme-dark anim-hover-left mt-2 ml-2" v-if="!isEmptyObject(editedItem)" @click="cancel">
            <i class="btn-prev__icon anim anim-icon arrow-left-icon"></i>
            <span class="btn-prev__text" v-lang.training.constructors.backToPage></span>
        </a>

        <viewer v-if="allUrls.length" :options="options" :images="allUrls" class="viewer" :class="{'viewer--height' : !isEmptyObject(editedItem)}">
            <template slot-scope="scope">
                <div class="image-wrapper" v-for="url in scope.images" :key="url" style="position: relative;">
                    <img class="image" :src="imageUrl(url)" :data-source="imageUrl(url)"/>
                    <div v-if="!isEmptyObject(editedItem)" class="plus-wrap" @click="handlerImageClick($event, url)">
                        <i class="plus-green-icon"></i>
                    </div>
                    <i v-else class="delete-icon delete-icon--big anim anim-icon" @click.self.stop="showTooltip(url)"></i>
                </div>
            </template>
        </viewer>

        <popup v-if="isPopupViewed" @close="hide">
            <div slot="main" class="text-center" v-lang.training.constructors.removeImage></div>
            <div slot="footer">
                <a @click="remove" class="text-link mr-2" href="javascript:void(0);" v-lang.training.common.ok></a>
                <a @click="hide" class="text-link" href="javascript:void(0);" v-lang.training.common.cancel></a>
            </div>
        </popup>
        <load v-if="!showContent" :height="'calc(100vh - 50px)'" :width="'calc(100% - 270px)'" :coord="{top: '50px', left: '270px'}"/>
    </div>
</template>

<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';

    export default {
        name: "MediaStorage",
        data() {
            return {
                showContent: false,
                isPopupViewed: false,
                removedUrl: null,
                options: {
                    url: 'data-source',
                    button: true,
                    navbar: false,
                    title: false,
                    toolbar: true,
                    tooltip: false,
                    rotatable: false,
                    scalable: false,
                    zoomable: true,
                    transition: true,
                    fullscreen: true,
                    keyboard: true,
                    movable: true,
                    inline: false
                }
            };
        },
        props: {
            editedItem: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            Popup: () => import("common/components/Popup")
        },
        async created() {
            this.showContent = false;
            await this.getAllImagesUrls();
            this.showContent = true;
        },
        computed: {
            ...mapGetters('manager', [
                'allUrls'
            ])
        },
        methods: {
            handlerImageClick(event, url) {
                if (this.isEmptyObject(this.editedItem)) {
                    return;
                }
                this.$emit("addMedia", url);
                event.stopPropagation();
            },
            cancel() {
                this.$emit("cancel");
            },
            imageUrl(url) {
                return `/training/service/rest/image/${url}`;
            },
            hide() {
                this.removedUrl = null;
                this.isPopupViewed = false;
            },
            showTooltip(url) {
                this.removedUrl = url;
                this.isPopupViewed = !this.isPopupViewed;
            },
            async remove() {
                if (!this.removedUrl) {
                    return null;
                }
                await this.removeImage({
                    url: this.removedUrl,
                    success: async () => {
                        await this.getQuiz(this.$route.params.id);
                        this.fillAllUrls({value: this.allUrls.filter(url => url !== this.removedUrl)});
                        this.hide();
                    },
                    error: () => {
                        alert("Error deletion");
                    }
                });
            },
            ...mapMutations('manager', [
                'fillAllUrls'
            ]),
            ...mapActions('manager', [
                'getAllImagesUrls',
                'removeImage',
                'getQuiz'
            ])
        }
    };
</script>
