<template>
    <div class="block-paragraph flex-center"
         v-text="item.content"
         :style="itemPosition"
    ></div>
</template>

<script>
    export default {
        name: "BlockText",
        data() {
            return {
                positions: {
                    'LEFT': {
                        'text-align': 'left',
                        'justify-content': 'flex-start'
                    },
                    'CENTER': {
                        'text-align': 'center',
                        'justify-content': 'center'
                    },
                    'RIGHT': {
                        'text-align': 'right',
                        'justify-content': 'flex-end'
                    }
                }
            };
        },
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
                const textSettings = Object.keys(this.item.settings || {}).reduce((result, item) => {
                    if (item !== 'position') {
                        result[item] = this.item.settings[item];
                    }
                    return result;
                }, {});

                return {
                    ...textSettings,
                    ...this.positions[this.item.settings['position']],
                    'align-items' : this.settingsAlignItems['align-items']
                };
            }
        }
    };
</script>
