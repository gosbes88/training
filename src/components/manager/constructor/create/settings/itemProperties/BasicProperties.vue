<template>
    <div class="basic-item-settings mb-2" :class="{'basic-item-settings--3-columns' : block.itemType === 'INTERACTIVE'}">
        <div class="basic-item-setting__col">
            <div class="select-row">
                <select-block :elements="getItemTypes"
                              :selected-element="itemTypeCurrent"
                              :class-selected-element-wrapper="'select--inline'"
                              @selectElement="updateItemType"
                />
            </div>
        </div>

        <div class="basic-item-setting__col">
            <div class="select-row" :class="{'disabled': !block.itemType}">
                <select-block :elements="getContentTypes"
                              :selected-element="contentTypeCurrent"
                              :class-selected-element-wrapper="'select--inline'"
                              @selectElement="updateContentType"
                />
            </div>
        </div>

        <div class="basic-item-setting__col" v-if="block.itemType === 'INTERACTIVE'">
            <div class="select-row" :class="{'disabled': classTypeDisabled}" >
                <select-block :elements="getClassTypes"
                              :selected-element="classTypeCurrent"
                              :class-selected-element-wrapper="'select--inline'"
                              @selectElement="updateClassType"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import blockMixin from '@/mixins/BlockByType';

    export default {
        name: "BasicProperties",
        data() {
            return {
                itemTypes: ['STATIC', 'INTERACTIVE'],
                contentTypes: {
                    INTERACTIVE: ['TEXT', 'IMAGE'/*, 'ELEMENT'*/],
                    STATIC: ['TEXT', 'IMAGE']
                },
                classTypes: {
                    ELEMENT: ['NUMBER', 'TEXT'],
                    OTHER: ['SELECT', 'POSITION']
                },
                STATIC: [],
                itemTypeCurrent: {},
                contentTypeCurrent: {},
                classTypeCurrent: {},
                defaultItemType: {},
                defaultContentType: {},
                defaultClassType: {}
            };
        },
        mixins: [ blockMixin ],
        created() {
            this.defaultItemType = {id: this.translate('training.constructors.itemType'), name: this.translate('training.constructors.itemType')};
            this.defaultContentType = {id: this.translate('training.constructors.contentType'), name: this.translate('training.constructors.contentType')};
            this.defaultClassType = {id: this.translate('training.constructors.classType'), name: this.translate('training.constructors.classType')};
            this.itemTypeCurrent = this.block.itemType
                ? {id: this.block.itemType, name: this.translate(`training.constructors.${this.block.itemType}`)}
                : this.defaultItemType;
            this.contentTypeCurrent = this.block.contentType
                ? {id: this.block.contentType, name: this.translate(`training.constructors.${this.block.contentType}`)}
                : this.defaultContentType;
            this.classTypeCurrent = this.block.classType
                ? {id: this.block.classType, name: this.translate(`training.constructors.${this.block.classType}`)}
                : this.defaultClassType;
        },
        watch: {
            /**
             * Логика по отображению выбранных параметров для элемента в зависимости от допустимых значений
             */
            block(val, oldVal) {
                if (this.isEmptyObject(val)) {
                    return;
                }
                if (val.id !== oldVal.id) {
                    return;
                }
                this.itemTypeCurrent = val.itemType
                    ? {id: val.itemType, name: this.translate(`training.constructors.${val.itemType}`)}
                    : this.defaultItemType;

                if (val.itemType !== oldVal.itemType && val.itemType === 'STATIC') {
                        this.contentTypeCurrent = this.defaultContentType;
                        this.$emit("update", {field: 'contentType', value: null});
                        this.$emit("update", {field: 'content', value: null});
                        this.$emit("update", {field: 'settings', value: {}});
                        this.classTypeCurrent = this.defaultClassType;
                        this.$emit("update", {field: 'classType', value: null});
                } else {
                    this.contentTypeCurrent = {id: val.contentType, name: this.translate(`training.constructors.${val.contentType}`)};

                    if (val.contentType !== oldVal.contentType) {
                            this.$emit("update", {field: 'content', value: null});
                            this.$emit("update", {field: 'settings', value: {}});
                            this.classTypeCurrent = this.defaultClassType;
                            this.$emit("update", {field: 'classType', value: null});
                    } else {
                        this.classTypeCurrent = {id: val.classType, name: this.translate(`training.constructors.${val.classType}`)};
                    }
                }

                if (!val.contentType) {
                    this.contentTypeCurrent = this.defaultContentType;
                }
                if (!val.classType) {
                    this.classTypeCurrent = this.defaultClassType;
                }
            }
        },
        computed: {
            classTypeDisabled() {
                return this.block.itemType !== 'INTERACTIVE' || !this.block.contentType;
            },
            getItemTypes() {
                return this.itemTypes.map(it => ({id: it, name: this.translate(`training.constructors.${it}`)}));
            },
            getContentTypes() {
                return (this.contentTypes[this.block.itemType] || [])
                    .map(it => ({id: it, name: this.translate(`training.constructors.${it}`)}));
            },
            getClassTypes() {
                return (this.classTypes[this.block.contentType] || this.classTypes['OTHER'])
                    .map(it => ({id: it, name: this.translate(`training.constructors.${it}`)}));
            }
        },
        methods: {
            updateItemType({ id, name }) {
                this.itemTypeCurrent = { id, name };
                this.$emit("update", {field: 'itemType', value: id});
            },
            updateContentType({ id, name }) {
                this.contentTypeCurrent = { id, name };
                this.$emit("update", {field: 'contentType', value: id});
            },
            updateClassType({ id, name }) {
                this.classTypeCurrent = { id, name };
                this.$emit("update", {field: 'classType', value: id});
            }
        }
    };
</script>
