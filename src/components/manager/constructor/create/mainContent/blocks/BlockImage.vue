<template>
    <div class="flex-center" :style="itemPosition">
        <img class="block-image__img"
             :src="`/training/service/rest/image/${item.url}`"
             :style="item.settings"
             :alt="translate('training.constructors.image')"
        />
    </div>
</template>

<script>
    export default {
        name: "BlockImage",
        props: {
            item: {
                type: Object,
                default: () => ({})
            },
            settingsAlignItems: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            itemPosition() {
               return {
                   'justify-content' : this.item.settings['justify-content'],
                   'align-items' : this.settingsAlignItems['align-items']
               };
            }

        }
    };
</script>
