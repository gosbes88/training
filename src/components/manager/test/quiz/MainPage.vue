<template>
    <div class="container-default">
        <div class="container-small" :style="{'opacity': !showContent}">
            <div class="page-head">
                <h1 class="title-big-page" v-lang.training.test.quizSelection></h1>
            </div>

            <div class="competence-title">
                <span v-lang.training.constructors.listSelect></span>&nbsp;
                <a href="javascript: void(0);" @click.prevent="createOwnQuiz" v-lang.training.constructors.yourQuiz></a>
            </div>

            <input-search v-if="quizes.length >= minCountFoxSearch"
                          :placeholder="translate('training.constructors.quizSearch')"
                          :search-wrapper-class="'search-block'"
                          :search-icon-class="'search-block__icon'"
                          :input-class="'search-block__inp'"
                          @change="$event => filter = $event"
            />

            <div class="quiz-list" v-if="quizes.length">
                <quiz-row v-for="quiz in quizes" :key="quiz.id" :quiz="quiz" :handle-select="changeTestQuiz"/>
            </div>

            <footer-default class="js-page-nav-footer" :show-left-item="true" :show-right-item="true">
                <div slot="leftItem">
                    <router-link class="anim-hover-left" :to="{name: 'Manager'}">
                        <i class="anim anim-icon arrow-left-green-mini-icon"></i>
                        <span v-lang.training.common.back></span>
                    </router-link>
                </div>
                <div slot="rightItem">
                    <button class="text-link button-link anim-hover-right" :class="{ 'button-gray--disabled': !selectedQuiz }" @click="toNextStep">
                        <span v-lang.training.common.next></span>
                        <i class="anim anim-icon" :class="{ 'arrow-right-gray-mini-icon': !selectedQuiz, 'arrow-right-green-mini-icon': selectedQuiz }"></i>
                    </button>
                </div>
            </footer-default>
        </div>
        <!--Блок отображения загрузки-->
        <load v-if="!showContent" :height="'calc(100vh - 100px)'" :coord="{left: 0, top: '50px'}"/>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import QuizSelectionMixin from "@/mixins/QuizSelection";

    export default {
        name: "SelectQuizMainPage",
        data() {
            return {

            };
        },
        mixins: [ QuizSelectionMixin ],
        head: {
            title() {
                return {
                    inner: this.translate("training.test.quizSelection")
                };
            }
        },
        async created() {
            this.showContent = false;
            await Promise.all([this.getAllQuizes(), this.getTest(this.$route.params.id)]);
            if (this.test.quiz && this.test.quiz.id) {
                this.$bus.$emit("selectQuiz", this.test.quiz.id);
            }
            this.showContent = true;
        },
        computed: {
            ...mapGetters('manager', [
                'test'
            ])
        },
        methods: {
            async createOwnQuiz() {
                try {
                    const response = await this.$http.post('/training/service/rest/m/quiz/new');

                    this.$router.push({
                        name: 'Constructor',
                        params: {id: response.body, createdTest: this.test.id},
                        query: {createdTest: this.test.id}
                    });
                } catch (e) {
                    console.log(e);
                }
            },
            toNextStep() {
                if (!this.selectedQuiz || !this.test.quiz || !this.test.quiz.id) {
                    return;
                }
                this.$router.push({name: 'Participants', params: {id: this.test.id}});
            },
            ...mapActions('manager', [
                'getTest',
                'changeTestQuiz'
            ])
        }
    };
</script>
