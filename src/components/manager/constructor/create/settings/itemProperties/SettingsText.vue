<template>
    <div class="text-settings-wrap">

        <div class="text-settings">
            <div class="text-settings__col">
                <h4 class="title-form" v-lang.training.settings.text></h4>

                <div class="text-toolbar">
                    <div class="text-toolbar__item">
                        <a class="text-toolbar__icon text-left-icon"
                           :class="{'text-toolbar__icon--active': settings['position'] === 'LEFT' }"
                           href="javascript:void(0)"
                           :title="translate('training.settings.alignLeft')"
                           @click="setAlign('LEFT')"
                        >
                        </a>
                    </div>

                    <div class="text-toolbar__item">
                        <a class="text-toolbar__icon text-center-icon"
                           :class="{'text-toolbar__icon--active': settings['position'] === 'CENTER' }"
                           href="javascript:void(0)"
                           :title="translate('training.settings.alignCenter')"
                           @click="setAlign('CENTER')"
                        >
                        </a>
                    </div>

                    <div class="text-toolbar__item">
                        <a class="text-toolbar__icon text-right-icon"
                           :class="{'text-toolbar__icon--active': settings['position'] === 'RIGHT' }"
                           href="javascript:void(0)"
                           :title="translate('training.settings.alignRight')"
                           @click="setAlign('RIGHT')"
                        >
                        </a>
                    </div>

                    <div class="text-toolbar__item">
                        <a class="text-toolbar__icon text-bold-icon"
                           :class="{'text-toolbar__icon--active': settings['font-weight'] === 'bold' }"
                           href="javascript:void(0)"
                           :title="translate('training.settings.fontBold')"
                           @click="setBold(settings['font-weight'] === 'bold')"
                        >
                        </a>
                    </div>

                    <div class="text-toolbar__item">
                        <a class="text-toolbar__icon text-italics-icon"
                           :class="{'text-toolbar__icon--active': settings['font-style'] === 'italic' }"
                           href="javascript:void(0)"
                           :title="translate('training.settings.fontItalics')"
                           @click="setItalics(settings['font-style'] === 'italic')"
                        >
                        </a>
                    </div>
                </div>
            </div>

            <div class="text-settings__col">
                <h4 class="title-form" v-lang.training.settings.fontSize></h4>

                <div class="form-layout-columns">
                    <div class="form-layout-columns__item">
                        <div class="select-row">
                            <select-block class="select-font-size"
                                          id="text-size"
                                          :elements="getTextSizes"
                                          :selectedElement="getTextSizeCurrent"
                                          :classSelectedElementWrapper="'select--inline'"
                                          @selectElement="selectFont"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-settings__col">
                <h4 class="title-form" v-lang.training.settings.fontColor></h4>
                <div class="text-center">
                    <input class="inp-color" type="color" v-model="color">
                </div>
            </div>

            <div class="text-settings__col">
                <label class="title-form" for="content" v-lang.training.constructors.content></label>
                <textarea id="content"
                          class="inp-textarea"
                          v-autosize="content"
                          v-model="content"
                          :placeholder="translate('training.constructors.contentPlaceholder')"
                          rows="1"
                ></textarea>
            </div>
        </div>

        <div class="flex-center mt-2">
            <button class="text-link button-link"
                    :class="{'disabled': !content || !content.trim() || block.content === content}"
                    @click="saveContent"
                    v-lang.training.constructors.add
            >
            </button>
        </div>
    </div>
</template>

<script>
    import blockMixin from '@/mixins/BlockByType';
    import { generateUUID } from 'utils/DeveloperUtils';

    export default {
        name: "settingsText",
        data() {
            return {
                color: null,
                getTextSizeCurrent: null,
                getTextSizes: [],
                settings: {},
                content: ''
            };
        },
        mixins: [ blockMixin ],
        watch: {
            color(value, oldValue) {
                if (value !== oldValue) {
                    this.settings['color'] = value;
                    this.updateProperties();
                }
            },
            block (value){
                if (!this.isEmptyObject(value)) {
                    this.fillSettings(value);
                }
            }
        },
        created() {
            this.fillSettings(this.block);
        },
        methods: {
            fillSettings(block = {}) {
                const existsProperties = block && !this.isEmptyObject(block.settings);
                this.settings = existsProperties
                    ? JSON.parse(JSON.stringify(block.settings))
                    : this.quizSettings.itemSettings;


                const keys = Object.keys(this.settings);
                keys.forEach(key => {
                    if (!this.quizSettings.itemSettings[key]) {
                        delete this.settings[key];
                    }
                });

                const isSettingsFull = Object.keys(block.settings || {}).length === Object.keys(this.quizSettings.itemSettings).length;
                if (!isSettingsFull) {
                    this.settings = {...this.quizSettings.itemSettings, ...this.settings};
                }

                this.getTextSizes = [
                    {id: '10px', name: this.translate('training.constructors.fontSmall')},
                    {id: '14px', name: this.translate('training.constructors.fontMiddle')},
                    {id: '20px', name: this.translate('training.constructors.fontBig')}
                ];
                this.getTextSizeCurrent = this.settings['font-size']
                    ? this.getTextSizes.find(e => e.id === this.settings['font-size'])
                    : this.getTextSizes[0];

                this.color = this.settings['color'];
                this.content = block ? block.content : '';
                if (!existsProperties) {
                    this.updateProperties();
                }
            },
            selectFont({ id, value }) {
                this.settings['font-size'] = id;
                this.getTextSizeCurrent = this.getTextSizes.find(e => e.id === id);
                this.updateProperties();
            },
            setAlign(value) {
                this.settings['position'] = value;
                this.updateProperties();
            },
            setBold(isBold) {
                this.settings['font-weight'] = isBold ? 'normal' : 'bold';
                this.updateProperties();
            },
            setItalics(isItalic) {
                this.settings['font-style'] = isItalic ? 'normal' : 'italic';
                this.updateProperties();
            },
            updateProperties() {
                this.$emit('update', {field: 'settings', value: this.settings});
            },
            saveContent() {
                this.interactiveElement
                    ? this.addItem()
                    : this.$emit('update', {field: 'content', value: this.content});
            },
            addItem() {
                this.$emit('addItem', {settings: this.settings, content: this.content});
                this.content = '';
            }
        }
    };
</script>
