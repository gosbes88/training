<template>
    <div class="page-columns" :class="{'page-columns--2-columns': isMediaViewed}">
        <!--Колонка навигации-->
        <div class="page-columns__item page-columns__item-1 page-columns__item--nav">
            <aside-block @showPage="updatePage"  @cancel="cancelAddingMedia">
                <router-link v-if="createdTest" slot="back" :to="{name: 'QuizSelection', params: {id: createdTest}}" class="btn-prev btn-prev--theme-dark anim-hover-left">
                    <i class="btn-prev__icon anim anim-icon arrow-left-icon"></i>
                    <span class="btn-prev__text" v-lang.training.common.back></span>
                </router-link>
            </aside-block>
        </div>

        <!--Колонка контента-->
        <div v-show="!isMediaViewed" class="page-columns__item page-columns__item-2 constructor-main">
            <div class="designer-editor">
                <!--основная область представления-->
                <page-preview v-if="isResultViewed"/>
                <main-view-area v-show="!isResultViewed"/>
            </div>
        </div>

        <!--Колонка настройки элементов-->
        <div v-show="!isMediaViewed" class="page-columns__item page-columns__item-3 page-columns__item--br-left">
            <editor-settings>
                <a v-if="createdTest"
                   class="button-text title-editing mb-2"
                   href="javascript:void(0);"
                   @click="addQuizToTest"
                   v-lang.training.test.quizSave
                ></a>
            </editor-settings>
        </div>

        <media-storage v-if="isMediaViewed"
                       :edited-item="editedItem"
                       @addMedia="addMedia"
                       @cancel="cancelAddingMedia"
                       class="page-columns__item-2 constructor-main"
        />

        <load v-if="!showContent" :height="'calc(100vh - 50px)'" :coord="{top: '50px'}"/>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import { generateUUID, fillFormData } from "utils/DeveloperUtils";

    export default {
        name: "main-page-new-task",
        data() {
            return {
                showContent: false,
                page: null,
                editedItem: null
            };
        },
        head: {
            title() {
                return {
                    inner: this.translate('training.common.tasks')
                };
            }
        },
        components: {
            PagePreview: () => import("./mainContent/PagePreview"),
            MediaStorage: () => import('./mainContent/MediaStorage'),
            MainViewArea: () => import('./mainContent/MainViewArea'),
            AsideBlock: () => import('./aside/Aside'),
            EditorSettings: () => import('./settings/EditorSettings')
        },
        async created() {
            this.showContent = false;
            this.$bus.$on("selectFromMedia", this.showMedia);
            await this.getSettings();
            await Promise.all([this.getQuiz(this.$route.params.id), this.getAllImagesUrls()]);
            if (!this.getPages.length) {
                await this.addNewBlock({blockType: "PAGE"});
            }
            this.$bus.$emit('openPage', this.getPages[0].id);
            this.showContent = true;
        },
        beforeDestroy() {
            this.$bus.$off("selectFromMedia", this.showMedia);
        },
        computed: {
            createdTest() {
                return this.$route.params.createdTest;
            },
            isMediaViewed() {
                return this.page === 'MEDIA';
            },
            isResultViewed() {
                return this.page === 'RESULT';
            },
            ...mapGetters('manager', [
                'getPages',
                'quiz'
            ])
        },
        methods: {
            updatePage(val) {
                this.page = val;
                this.$bus.$emit("openPage", val);
            },
            addMedia(url) {
                this.$bus.$emit("addImage", {...this.editedItem, url});
                this.page = null;
                this.editedItem = null;
            },
            cancelAddingMedia() {
                if (this.page === 'MEDIA') {
                    this.page = null;
                }
                this.editedItem = null;
            },
            showMedia(itemData) {
                this.page = 'MEDIA';
                this.editedItem = itemData;
            },
            async addQuizToTest() {
                await this.changeTestQuiz(this.quiz.id);
                this.$router.push({name: 'QuizSelection', params: {id: this.createdTest}});
            },
            ...mapActions('manager', [
                'getQuiz',
                'addNewBlock',
                'getAllImagesUrls',
                'getSettings',
                'changeTestQuiz'
            ])
        }
    };
</script>
