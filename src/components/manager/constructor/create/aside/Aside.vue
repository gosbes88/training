<template>
    <aside class="nav-aside nav-aside--ind">

        <div class="nav-head mb-5">
            <div class="nav-head__item">
                <slot name="back">
                    <router-link :to="{name: 'QuizList'}" class="btn-prev btn-prev--theme-dark anim-hover-left">
                        <i class="btn-prev__icon anim anim-icon arrow-left-icon"></i>
                        <span class="btn-prev__text" v-lang.training.common.back></span>
                    </router-link>
                </slot>
            </div>

            <div class="nav-head__item"></div>
        </div>

        <!--Имя шаблона-->
        <quiz-name class="nav-title" :name="quizName" @update="updateQuizName"/>

        <!--список страниц-->
        <div class="nav-aside__item">

            <div class="drop-down-list">
                <a class="link-rotate" href="javascript:void(0);" @click="visible = !visible">
                    <i class="link-rotate__icon arrow-light-right-icon"
                       :class="{'link-rotate__icon--rotate': visible}"
                    ></i>
                    <h3 class="link-rotate__title nav-title" v-lang.training.constructors.list></h3>
                </a>

                <div class="nav-list" v-show="visible">
                    <page-link v-for="(page, index) in getPages"
                               :key="page.id"
                               :page-item="page"
                               :active-page-id="activePageId"
                               @edit="updatePageName"
                               @select="selectPage"
                    />

                    <div class="nav-list__line"></div>

                    <div class="nav-list__item">
                        <div class="link-edit">
                            <div class="link-edit__title">
                                <a href="javascript: void(0);"
                                   class="link-edit__title-link"
                                   v-lang.training.constructors.createPage
                                   @click.prevent="createNewPage"
                                ></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--структура-->
        <aside-menu-item :title="translate('training.constructors.structure')" :is-active="activePageId === 'STRUCTURE'" :handler="seeStructure"/>

        <!--проверка-->
        <aside-menu-item :class="{'block-disabled': errors.length || !getPages.length}" :title="translate('training.constructors.check')" :is-active="activePageId === 'RESULT'" :handler="seeResult"/>

        <!--Медиахранилище-->
        <aside-menu-item :title="translate('training.constructors.media')" :is-active="activePageId === 'MEDIA'" :handler="seeMediaStorage"/>
    </aside>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import quiz from '@/mixins/Quiz';

    export default {
        name: "Aside",
        components: {
            AsideMenuItem: () => import('./AsideMenuItem'),
            PageLink: () => import('./PageLink'),
            QuizName: () => import("./QuizName")
        },
        data() {
            return {
                visible: true,
                activePageId: null
            };
        },
        mixins: [ quiz ],
        created() {
            this.$bus.$on("openPage", this.selectPage);
        },
        beforeDestroy() {
            this.$bus.$off("openPage", this.selectPage);
        },
        methods: {
            async updateQuizName(name) {
                await this.renameQuiz(name);
            },
            async updatePageName({ id, name }) {
                await this.renamePage({name, pageId: id});
            },
            async createNewPage() {
                await this.addNewBlock({blockType: "PAGE"});
                this.selectPage(this.getPages[this.getPages.length - 1].id);
            },
            selectPage(id) {
                if (this.activePageId === id) {
                    return;
                }
                this.activePageId = id;
                this.$emit("showPage", id);
                this.$emit("cancel");
                this.$bus.$emit("openPage", id);
            },
            seeResult() {
                if (this.errors.length) {
                    return;
                }
                this.activePageId = 'RESULT';
                this.$emit("showPage", this.activePageId);
                this.$emit("cancel");
            },
            seeStructure() {
                //TODO: просмотр структуры шаблона
                this.activePageId = 'STRUCTURE';
                this.$emit("showPage", this.activePageId);
                this.$emit("cancel");
            },
            seeMediaStorage() {
                this.$emit("cancel");
                this.activePageId = 'MEDIA';
                this.$emit("showPage", this.activePageId);
            },
            ...mapActions('manager', [
                'addNewBlock',
                'renamePage',
                'renameQuiz',
            ])
        },
        computed: {
            ...mapGetters('manager', [
                'getPages',
                'errors',
                'quiz'
            ])
        }
    };
</script>
