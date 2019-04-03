<template>
    <div class="nav-list__item">
        <div class="link-edit" :class="{'link-edit--active': activePageId === pageItem.id}" @click="select">
            <div class="link-edit__title">
                <a v-if="!isEdited"
                   ref="textLink"
                   class="link-edit__title-link"
                   href="javascript:void(0);"
                   v-text="pageItem.name"></a>

                <input class="link-edit__inp"
                       ref="inp"
                       v-else type="text"
                       v-focus
                       v-model="name"
                       @keyup.enter="save"
                       @focusout="save"
                       @keyup.esc="cancel"
                       @click.stop=""
                />
            </div>

            <a v-show="activePageId === pageItem.id && !isEdited" class="link-edit__icon" href="javascript:void(0);" @click.stop="handleClick">
                <i class="pencil-white-small-icon"></i>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageLink",
        props: {
            pageItem: {
                type: Object,
                default: () => ({})
            },
            activePageId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                iaActive: false,
                isEdited: false,
                name: this.pageItem.name
            };
        },
        methods: {
            cancel() {
                this.name = this.pageItem.name;
                this.isEdited = false;
            },
            save() {
                if (!this.name) {
                    return;
                }
                this.isEdited = false;
                this.$emit("edit", {id: this.pageItem.id, name: this.name});
            },
            select() {
                this.$emit("select", this.pageItem.id);
            },
            handleClick() {
                this.isEdited = true;
            }
        }
    };
</script>
