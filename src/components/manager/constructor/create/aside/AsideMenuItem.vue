<template>
    <div class="nav-aside__item nav-aside__item--ind-left">
        <a class="link-rotate" :class="{'link-rotate--active': isActive}" href="javascript:void(0);">
            <h3 class="link-rotate__title nav-title" v-text="title" @click="handler"></h3>
        </a>
    </div>
</template>

<script>
    export default {
        name: "AsideMenuItem",
        props: {
            title: {
                type: String,
                default: ''
            },
            isActive: {
                type: Boolean,
                default: false
            },
            handler: {
                type: Function,
                default: () => {}
            }
        }
    };
</script>
