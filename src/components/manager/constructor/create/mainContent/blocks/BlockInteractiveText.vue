<template>
    <draggable v-if="item.classType === 'POSITION'"
               v-model="interactiveItems"
               v-bind="{group: 'groups', animation: 150}"
               @start="drag = true"
               @end="drag = false"
               class="flex-center block-paragraph"
               :style="{'flex-direction': item.interactiveSettings['direction'] === 'ROW' ? 'row' : 'column'}"
    >
        <div v-for="element in interactiveItems" :key="element.id" class="flex-center" @click="selectItem(element.id)">
            <div class="flex-center"
                 v-text="element.content"
                 :style="element.settings || {}"
            ></div>

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
         class="flex-center block-paragraph"
         :style="{'flex-direction': item.interactiveSettings['direction'] === 'ROW' ? 'row' : 'column'}"
    >
        <div v-for="element in item.items" :key="element.id" class="flex-center" @click="selectItem(element.id)">
            <div class="flex-center"
                 v-text="element.content"
                 :style="element.settings || {}"
                 @click="clickHandler"
            ></div>

            <!--Чекбокс при множественном выборе-->
            <checkbox-square v-if="item.classType === 'SELECT' && item.multipleSelect"
                             :style="interactiveStyles"
                             :checked="checked(element.id)"
                             :styles="checkboxStyle"
                             @check="check"
            />

            <!--При единичном выборе-->
            <radio-button v-else-if="item.classType === 'SELECT' && !item.multipleSelect"
                          :style="interactiveStyles"
                          :styles="radioStyle"
                          :checked="checked(element.id)"
                          :name="item.groupName"
                          @check="check"
            />
        </div>
    </div>
</template>

<script>
    import Interactive from '@/mixins/Interactive';

    export default {
        name: "BlockInteractiveText",
        components: {
            RadioButton: () => import('common/components/RadioButton'),
            CheckboxSquare: () => import('common/components/CheckboxSquare')
        },
        mixins: [ Interactive ],
        methods: {
            clickHandler() {
                if (this.item.classType === 'SELECT') {
                    this.check();
                }
            }
        }
    };
</script>
