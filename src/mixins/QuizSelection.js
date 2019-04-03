import { WAITING_TIME } from "@/utils/Constants";
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            selectedQuiz: null,
            minCountFoxSearch: 10,
            showContent: false,
            filter: '',
            timer: null
        };
    },
    components: {
        QuizRow: () => import("@/components/manager/constructor/list/QuizRow"),
        FooterDefault: () => import("common/components/Footer"),
        InputSearch: () => import('common/components/InputSearch')
    },
    watch: {
        filter(val, oldVal) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.findQuizes(val);
            }, WAITING_TIME);
        }
    },
    created() {
        this.$store.commit('setHasNavPanel', true);
        this.$bus.$on("selectQuiz", this.selectQuiz);
    },
    beforeDestroy() {
        this.$bus.$off("selectQuiz", this.selectQuiz);
    },
    updated() {
        this.$bus.$emit("windowResize");
    },
    computed: {
        ...mapGetters('manager', [
            'quizes'
        ])
    },
    methods: {
        selectQuiz(id) {
            this.selectedQuiz = id;
        },
        ...mapActions('manager', [
            'getAllQuizes',
            'findQuizes'
        ])
    }

};
