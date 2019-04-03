<template>
    <div class="properties-interactivity mb-3">
        <h3 class="title-middle" v-lang.training.constructors.interactiveSettings></h3>

        <div class="interactive-settings">
            <!--Блок выбора размещения контента-->
            <div class="interactive-settings__col">
                <h4 class="title-form" v-lang.training.constructors.POSITION></h4>

                <div class="position-toolbar">
                    <a class="position-toolbar__item position-toolbar__icon position-left-icon"
                       :class="{'position-toolbar__icon--active': interactiveSettings['positions'] === 'LEFT'}"
                       href="javascript:void(0)"
                       :title="translate('training.constructors.LEFT')"
                       @click="changePosition('LEFT')"
                    >
                    </a>

                    <a v-show="block.contentType === 'IMAGE' && block.classType === 'SELECT'" class="position-toolbar__item position-toolbar__icon position-center-icon"
                       :class="{'position-toolbar__icon--active': interactiveSettings['positions'] === 'CENTER'}"
                       href="javascript:void(0)"
                       :title="translate('training.constructors.CENTER')"
                       @click="changePosition('CENTER')"
                    >
                    </a>

                    <a class="position-toolbar__item position-toolbar__icon position-right-icon"
                       :class="{'position-toolbar__icon--active': interactiveSettings['positions'] === 'RIGHT'}"
                       href="javascript:void(0)"
                       :title="translate('training.constructors.RIGHT')"
                       @click="changePosition('RIGHT')"
                    >
                    </a>
                </div>
            </div>

            <!--Блок расположения контента в элементе-->
            <div class="interactive-settings__col">
                <h4 class="title-form" v-lang.training.settings.rowDirection></h4>

                <div class="block-direction">
                    <div class="block-direction__item">
                        <a class="block-direction__icon position-right-icon"
                           href="javascript: void(0);"
                           :class="{'block-direction__icon--active': interactiveSettings['direction'] === 'ROW'}"
                           @click="setDirection('ROW')"
                        ></a>
                    </div>

                    <div class="block-direction__item">
                        <a class="block-direction__icon direction-column-icon"
                           href="javascript: void(0);"
                           :class="{'block-direction__icon--active': interactiveSettings['direction'] === 'COLUMN'}"
                           @click="setDirection('COLUMN')"
                        ></a>
                    </div>
                </div>
            </div>

            <!--Блок уникальных настроек для выбора - размер и цвет чекбокса-->
            <template v-if="block.classType === 'SELECT'">
                <!--Блок выбора группы-->
                <div class="interactive-settings__col">
                    <h4 class="title-form" v-lang.training.settings.selectionGroup></h4>

                    <div class="mt-1 group-toolbar">
                        <a class="group-toolbar__item group-toolbar__icon radio-button-icon"
                           :class="{'group-toolbar__icon--active': !block.multipleSelect}"
                           href="javascript:void(0)"
                           :title="translate('training.settings.radioButton')"
                           @click="changeSelection(false)"
                        >
                        </a>

                        <a class="group-toolbar__item group-toolbar__icon check-button-icon"
                           :class="{'group-toolbar__icon--active': block.multipleSelect}"
                           href="javascript:void(0)"
                           :title="translate('training.settings.checkbox')"
                           @click="changeSelection(true)"
                        >
                        </a>
                    </div>
                </div>

                <div class="interactive-settings__col">
                    <h4 class="title-form" v-lang.training.settings.checkboxSize></h4>

                    <div class="size-toolbar mt-1">
                        <a class="size-toolbar__item size-toolbar__icon size-checkbox-small"
                           :class="{'size-toolbar__icon--active': interactiveSettings['checkboxSize'] === 'SMALL' }"
                           href="javascript:void(0)"
                           :title="translate('training.constructors.fontSmall')"
                           @click="setCheckboxSize('SMALL')"
                        >
                        </a>

                        <a class="size-toolbar__item size-toolbar__icon size-checkbox-middle"
                           :class="{'size-toolbar__icon--active': interactiveSettings['checkboxSize'] === 'MEDIUM' }"
                           href="javascript:void(0)"
                           :title="translate('training.constructors.fontMiddle')"
                           @click="setCheckboxSize('MEDIUM')"
                        >
                        </a>

                        <a class="size-toolbar__item size-toolbar__icon size-checkbox-big"
                           :class="{'size-toolbar__icon--active': interactiveSettings['checkboxSize'] === 'BIG' }"
                           href="javascript:void(0)"
                           :title="translate('training.constructors.fontBig')"
                           @click="setCheckboxSize('BIG')"
                        >
                        </a>
                    </div>
                </div>

                <div class="interactive-settings__col">
                    <h4 class="title-form" v-lang.training.settings.checkboxColor></h4>

                    <div class="checkbox-color mt-1">
                        <div class="checkbox-color__item checkbox-color__green"
                             :class="{'checkbox-color__item--active': interactiveSettings['checkboxColor'] === 'GREEN'}"
                             @click="setCheckboxColor('GREEN')"
                        ></div>
                        <div class="checkbox-color__item checkbox-color__blue"
                             :class="{'checkbox-color__item--active': interactiveSettings['checkboxColor'] === 'BLUE'}"
                             @click="setCheckboxColor('BLUE')"
                        ></div>
                        <div class="checkbox-color__item checkbox-color__black"
                             :class="{'checkbox-color__item--active': interactiveSettings['checkboxColor'] === 'BLACK'}"
                             @click="setCheckboxColor('BLACK')"
                        ></div>
                    </div>
                </div>
            </template>
        </div>

        <!--<div class="mb-2">-->
            <!--<div class="title-form mb-1">Количество границ</div>-->
            <!--<i class="el-icon-edit"></i>-->
            <!--<el-radio-group v-model="interactiveSettings['rangeCount']" :size="'medium'" :text-color="'#6fbe10'">-->
                <!--<el-radio :label="1">1 граница</el-radio>-->
                <!--<el-radio :label="2">2 границы</el-radio>-->
            <!--</el-radio-group>-->
        <!--</div>-->

        <!--<div class="">-->
            <!--<label class="title-form">Диапазон значений</label>-->

            <!--<div class="form-layout-columns">-->
                <!--<div class="form-layout-columns__item">-->
                    <!--<el-input-number size="mini" v-model="interactiveSettings['min']"></el-input-number>-->
                <!--</div>-->
                <!--<div class="form-layout-columns__item">-->
                    <!--<el-input-number size="mini" v-model="interactiveSettings['max']"></el-input-number>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
    import blockMixin from '@/mixins/BlockByType';

    export default {
        name: "InteractiveProperties",
        data() {
            return {
                interactiveSettings: {}
            };
        },
        mixins: [ blockMixin ],
        watch: {
            block (value){
                if (!this.isEmptyObject(value)) {
                    this.fillProperties(value);
                }
            }
        },
        created() {
            this.fillProperties(this.block);
        },
        methods: {
            fillProperties(block) {
                const existsInteractiveSettings = block && !this.isEmptyObject(block.interactiveSettings);

                this.interactiveSettings = existsInteractiveSettings
                    ? JSON.parse(JSON.stringify(this.block.interactiveSettings))
                    : this.quizSettings.interactiveSettings;

                const keysCount =  Object.keys(block.interactiveSettings || {}).length;
                if (block.classType !== 'SELECT') {
                    delete this.interactiveSettings['checkboxSize'];
                    delete this.interactiveSettings['checkboxColor'];
                } else {
                    delete this.interactiveSettings['selections'];
                }

                const isPropertiesFull = block.classType === 'SELECT'
                    ? keysCount === Object.keys(this.quizSettings.interactiveSettings).length
                    : keysCount === 2;

                if (!isPropertiesFull) {
                    this.interactiveSettings = block.classType === 'SELECT'
                        ? {...this.quizSettings.interactiveSettings, ...this.interactiveSettings}
                        : {
                            positions: this.interactiveSettings['positions'] || this.quizSettings.interactiveSettings['positions'],
                            direction: this.interactiveSettings['direction'] || this.quizSettings.interactiveSettings['direction']
                        };
                }

                if (!existsInteractiveSettings || !isPropertiesFull) {
                    this.updateInteractiveSettings();
                }
            },
            setCheckboxSize(value) {
                if (this.interactiveSettings['checkboxSize'] === value) {
                    return;
                }
                this.interactiveSettings['checkboxSize'] = value;
                this.updateInteractiveSettings();
            },
            setCheckboxColor(value) {
                if (this.interactiveSettings['checkboxColor'] === value) {
                    return;
                }
                this.interactiveSettings['checkboxColor'] = value;
                this.updateInteractiveSettings();
            },
            changePosition(value) {
                if (this.interactiveSettings['positions'] === value) {
                    return;
                }
                this.interactiveSettings['positions'] = value;
                this.updateInteractiveSettings();
            },
            changeSelection(value) {
                if (this.block.multipleSelect === value) {
                    return;
                }
                this.$emit('update', {field: 'multipleSelect', value});
            },
            setDirection(value) {
                if (this.interactiveSettings['direction'] === value) {
                    return;
                }
                this.interactiveSettings['direction'] = value;
                this.updateInteractiveSettings();
            },
            updateInteractiveSettings() {
                this.$emit('update', {field: 'interactiveSettings', value: this.interactiveSettings});
            }
        }
    };
</script>
