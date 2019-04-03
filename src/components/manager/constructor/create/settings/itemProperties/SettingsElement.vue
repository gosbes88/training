<template>
    <div class="element-settings">
        <div class="element-settings__item mb-2">
            <label class="title-form" for="element-type"></label>
            <div class="select-row">
                <select-block id="element-type"
                              :elements="getElementTypes"
                              :selectedElement="currentElementType"
                              :classSelectedElementWrapper="'select--inline'"
                              @selectElement="selectElementType"
                >
                </select-block>
            </div>
        </div>
        <div class="element-settings__item mb-2">
            <label class="title-form" for="content" v-lang.training.constructors.content></label>
            <textarea id="content"
                      class="inp-textarea"
                      v-autosize="content"
                      v-model="content"
                      :placeholder="translate('training.constructors.contentPlaceholder')"
                      rows="1"
            ></textarea>
        </div>

        <div class="flex-center">
            <button class="text-link button-link"
                    :class="{'disabled': !content || !content.trim() || block.content === content || !Object.keys(properties).length}"
                    @click="saveContent"
                    v-lang.training.constructors.add
            >
            </button>
        </div>
    </div>
</template>

<script>
    import blockMixin from '@/mixins/BlockByType';

    export default {
        name: "SettingsElement",
        data() {
            return {
                elementTypes: [
                    // 'CHECKBOX',
                    // 'RADIO',
                    'RANGE',
                    'TEXT'
                ],
                currentElementType: {},
                defaultElementType: {},
                properties: {},
                content: ''
            };
        },
        mixins: [ blockMixin ],
        watch: {
            block (value){
                if (!this.isEmptyObject(this.block)) {
                    this.properties = !this.isEmptyObject(this.block.settings)
                        ? JSON.parse(JSON.stringify(this.block.settings))
                        : {};
                    this.content = this.block ? this.block.content : '';
                }
            }
        },
        created() {
            const existsProperties = this.block && !this.isEmptyObject(this.block.settings);
            this.properties = existsProperties
                ? JSON.parse(JSON.stringify(this.block.settings))
                : {};
            this.defaultElementType = {id: null, name: this.translate('training.constructors.elementType')};
            this.currentElementType = this.properties['type']
                ? this.getElementTypes.find(e => e.id === this.properties['type'])
                : this.defaultElementType;
        },
        computed: {
            getElementTypes() {
                return this.elementTypes.map(id => ({id, name: this.translate(`training.constructors.${id}`)}));
            }
        },
        methods: {
            selectElementType({ id, name }) {
                this.currentElementType = {id, name};
                this.properties['type'] = id;
                this.updateProperties();
            },
            updateProperties() {
                this.$emit('update', {field: 'settings', value: this.properties});
            },
            saveContent() {
                this.$emit('update', {field: 'content', value: this.content});
            }
        }
    };
</script>
