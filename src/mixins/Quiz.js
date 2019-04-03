/**
 * quizName - вывод имени шаблона или дефолтного названия
 */

export default {
    computed: {
        quizName() {
            if (this.quiz.name) {
                return this.quiz.name;
            }
            if (this.quiz.createdTime) {
                const limiter = this.quiz.createdTime.indexOf("T");
                const date = this.quiz.createdTime.toString().substr(0, limiter);
                const time = this.quiz.createdTime.toString().substr(limiter + 1, 8);
                return this.translate('training.constructors.quizDefaultName') + ' ' + date + ' ' + time;
            }
            return "";
        },
        quizRates() {
            if (!this.quiz.rates || !this.quiz.rates.length) {
                return "";
            }
            return this.quiz.rates.map(r => r.name).join(", ");
        }
    }
};
