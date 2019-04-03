<template>
    <div v-show="isPopupViewed" class="flex-popup-wrap flex-popup-show">
        <div class="flex-popup" @click.self="closePopup">
            <div class="flex-popup__content popup-add-question">
                <i @click="closePopup" class="flex-popup__close close-light-icon"></i>

                <div class="flex-article">
                    <div class="flex-article__head mb-2">
                        <h3 class="popup-add-question__title" v-lang.training.result.answers></h3>
                    </div>
                    <div class="flex-article__main mb-2">
                        <div class="selected-employees-list__item" v-for="(item, index) in answers" :key="index">
                            <div class="employees-table__cell employees-table__user-info">
                                <div class="us">
                                    <div class="us__con">
                                        <div class="us__fam" v-text="item.task"></div>
                                        <div v-for="(val, ind) in item.values" :key="ind">
                                            <div class="us__dep" v-text="val"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "result-answers-popup",
        props: {
            isPopupViewed: {
                type: Boolean,
                default: false
            },
            answers: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            closePopup() {
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>

</style>
