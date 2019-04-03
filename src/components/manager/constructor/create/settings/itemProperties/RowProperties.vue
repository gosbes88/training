<template>
    <div class="row-settings">
        <div class="row-settings__col">
            <h4 class="title-form" v-lang.training.settings.rowAlign></h4>
            <div class="row-toolbar">
                <div class="row-toolbar__item">
                    <a class="row-toolbar__icon row-align-top-icon"
                       href="javascript: void(0);"
                       :class="{'row-toolbar__icon--active': settings['align-items'] === 'flex-start' }"
                       @click="setAlign('flex-start')"
                       title="Выровнять содержимое по верху"
                    ></a>
                </div>

                <div class="row-toolbar__item">
                    <a class="row-toolbar__icon row-align-center-icon"
                       href="javascript: void(0);"
                       :class="{'row-toolbar__icon--active': settings['align-items'] === 'center' }"
                       @click="setAlign('center')"
                       title="Выровнять содержимое по центру"
                    ></a>
                </div>

                <div class="row-toolbar__item">
                    <a class="row-toolbar__icon row-align-bottom-icon"
                       href="javascript: void(0);"
                       :class="{'row-toolbar__icon--active': settings['align-items'] === 'flex-end' }"
                       @click="setAlign('flex-end')"
                       title="Выровнять содержимое по низу"
                    ></a>
                </div>
            </div>
        </div>

        <div class="row-settings__col">
            <h4 class="title-form" v-lang.training.settings.rowSize></h4>

            <div class="form-layout-columns mt-1">
                <div class="form-layout-columns__item">
                    <div class="select-row">
                        <select-block class="select-font-size"
                                      :elements="rowSizes"
                                      :selectedElement="fontSizeCurrent"
                                      :classSelectedElementWrapper="'select--inline'"
                                      @selectElement="selectSize"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import blockMixin from '@/mixins/BlockByType';

    export default {
        name: "RowProperties",
        props: {

        },
        data() {
            return {
                settings: {},
                rowSizes: [],
                fontSizeCurrent: {}
            };
        },
        mixins: [ blockMixin ],
        watch: {
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
            fillSettings(block) {
                const existsSettings = block && !this.isEmptyObject(block.settings);

                this.settings = existsSettings
                    ? JSON.parse(JSON.stringify(block.settings))
                    : this.quizSettings.rowSettings;

                const isSettingsFull = Object.keys(block.settings || {}).length === Object.keys(this.quizSettings.rowSettings).length;
                if (!isSettingsFull) {
                    this.settings = {...this.quizSettings.rowSettings, ...this.settings};
                }

                this.rowSizes = [
                    {id: '128px', name: this.translate('training.constructors.fontSmall')},
                    {id: '192px', name: this.translate('training.constructors.fontMiddle')},
                    {id: '384px', name: this.translate('training.constructors.fontBig')}
                ];

                this.fontSizeCurrent = this.settings['height']
                    ? this.rowSizes.find(e => e.id === this.settings['height'])
                    : this.rowSizes[0];

                if (!existsSettings || !isSettingsFull) {
                    this.updateSettings();
                }
            },
            selectSize({id, name}) {
                this.settings['height'] = id;
                this.fontSizeCurrent = {id, name};
                this.updateSettings();
            },
            setAlign(value) {
                this.settings['align-items'] = value;
                this.updateSettings();
            },
            updateSettings() {
                this.$emit('update', {field: 'settings', value: this.settings});
            }
        }
    };
</script>
