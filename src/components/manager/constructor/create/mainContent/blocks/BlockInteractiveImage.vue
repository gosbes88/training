<template>
    <draggable v-if="item.classType === 'POSITION'"
               v-model="interactiveItems"
               v-bind="{group: 'groups', animation: 150}"
               @start="drag = true"
               @end="drag = false"
               class="flex-center"
               :style="{'flex-direction': this.item.interactiveSettings['direction'] === 'ROW' ? 'row' : 'column'}"
    >
        <div v-for="element in interactiveItems" :key="element.id" class="flex-center" @click="selectItem(element.id)">
            <div class="flex-center" :style="{'justify-content': element.settings['justify-content']}">
                <div class="block-image__img-wrap" v-if="element.url" :style="element.settings">
                    <img class="block-image__img"
                         :src="`/training/service/rest/image/${element.url}`"
                         :alt="translate('training.constructors.image')"
                    />
                </div>
            </div>

            <!--При выборе режима перетаскивания-->
            <div v-if="item.interactiveSettings['positions']"
                 class="block-paragraph__drag"
                 :style="interactiveStyles"
                 @click.prevent.stop=""
            >
                <i class="block-paragraph__drag-icon drag-icon"></i>
            </div>
        </div>
    </draggable>
    <div v-else
         class="flex-center"
         :style="{'flex-direction': item.interactiveSettings['direction'] === 'ROW' ? 'row' : 'column'}"
    >
        <div v-for="element in interactiveItems" :key="element.id" class="flex-center" @click="selectItem(element.id)">
            <div class="flex-center" :style="{'justify-content': element.settings['justify-content']}" @click="handleClick">
                <div class="block-image__img-wrap" v-if="element.url" :style="element.settings">
                    <img class="block-image__img"
                         :src="`/training/service/rest/image/${element.url}`"
                         :alt="translate('training.constructors.image')"
                    />

                    <div v-show="checked(element.id) && isSelectionCenter"
                         class="block-image__checkbox"
                         :class="imageClasses"
                    ></div>
                </div>
            </div>

            <!--Чекбокс при множественном выборе-->
            <checkbox-square v-if="isCheckbox"
                             :style="interactiveStyles"
                             :styles="checkboxStyle"
                             :checked="checked(element.id)"
                             @check="check"
            />

            <!--При единичном выборе-->
            <radio-button v-else-if="isRadioButton"
                          :style="interactiveStyles"
                          :styles="radioStyle"
                          :checked="checked(element.id)"
                          @check="check"
            />
        </div>
    </div>

</template>

<script>
    import Interactive from '@/mixins/Interactive';

    export default {
        name: "BlockInteractiveImage",
        data() {
            return {
                imageCheckboxColor: {
                    'GREEN': '',
                    'BLUE': 'checkbox--blue',
                    'BLACK': 'checkbox--black'
                },
                imageCheckboxSize: {
                    'SMALL': 'block-image__checkbox--small',
                    'MEDIUM': '',
                    'BIG': 'block-image__checkbox--big'
                },
            };
        },
        components: {
            RadioButton: () => import('common/components/RadioButton'),
            CheckboxSquare: () => import('common/components/CheckboxSquare')
        },
        mixins: [ Interactive ],
        computed: {
            imageClasses() {
                return [this.imageCheckboxColor[this.item.interactiveSettings['checkboxColor']], this.imageCheckboxSize[this.item.interactiveSettings['checkboxSize']]]
                    .join(" ");
            },
            isSelectionCenter() {
                return this.item.classType === 'SELECT' && this.item.interactiveSettings['positions'] === 'CENTER';
            },
            isRadioButton() {
                return !this.isSelectionCenter && this.item.classType === 'SELECT'
                    && !this.item.multipleSelect;
            },
            isCheckbox() {
                return !this.isSelectionCenter && this.item.classType === 'SELECT'
                    && this.item.multipleSelect;
            }
        },
        methods: {
            handleClick() {
                if (this.isSelectionCenter) {
                    this.check();
                }
            }
        }
    };
</script>
