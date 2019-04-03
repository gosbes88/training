<template>
    <div class="title-editing mb-2">
        <div class="title-editing__col-text">
            <h2 v-if="!isEdited"
                class="title-editing__text"
                href="javascript:void(0);"
                v-text="name"
                :title="name"
            ></h2>

            <input class="title-editing__inp"
                   ref="inp"
                   v-else
                   type="text"
                   v-focus
                   v-model="value"
                   @keyup.enter="save"
                   @focusout="save"
                   @keyup.esc="cancel"
                   @click.stop=""
                   placeholder="Новый тест"
            />
            <div class="input-buffer" ref="buffer"></div>
        </div>

        <div class="title-editing__col-icon">
            <a href="javascript:void(0);" v-show="!isEdited" @click.stop="isEdited = true">
                <i class="pencil-white-small-icon"></i>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "QuizName",
        props: {
            name: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                isEdited: false,
                value: ""
            };
        },
        watch: {
            name: {
                handler(val) {
                    this.value = val;
                },
                immediate: true
            }
        },
        updated() {
            this.inputAutoWidth();
        },
        methods: {
            inputAutoWidth() {
                if (!this.isEdited) {
                    return;
                }
                const elInput = this.$refs.inp;
                const elBuffer = this.$refs.buffer;

                elBuffer.innerText = elInput.value;
                elInput.style.width = elBuffer.getBoundingClientRect().width + 'px';
            },
            cancel() {
                this.value = this.name;
                this.isEdited = false;
            },
            save() {
                if (!this.value) {
                    return;
                }
                this.isEdited = false;
                this.$emit("update", this.value);
            }
        }
    };
</script>
