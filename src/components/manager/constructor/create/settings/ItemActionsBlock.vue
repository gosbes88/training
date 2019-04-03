<template>
    <div class="designer-toolbar mb-2">
        <div class="designer-toolbar__item">
            <a class="designer-toolbar__link button-text" href="javascript:void(0);" @click="addRow">
                <i class="designer-toolbar__icon add-row-icon" :title="translate('training.constructors.addRow')"></i>
            </a>
        </div>

        <div class="designer-toolbar__item">
            <a class="designer-toolbar__link button-text" href="javascript:void(0);" @click="removeElement('ROW')" :class="{'disabled': !availableRow}">
                <i class="designer-toolbar__icon" :title="removeTitle('ROW')">УС</i>
            </a>
        </div>

        <div class="designer-toolbar__item">
            <a class="designer-toolbar__link button-text" href="javascript:void(0);" @click="addColumn" :class="{'disabled': !availableColumn}">
                <i class="designer-toolbar__icon add-column-icon" :title="translate('training.constructors.addColumn')"></i>
            </a>
        </div>

        <div class="designer-toolbar__item">
            <a class="designer-toolbar__link button-text" href="javascript:void(0);" @click="removeElement('COLUMN')" :class="{'disabled': blockType === 'COLUMN' && !availableColumnForDelete}">
                <i class="designer-toolbar__icon" :title="removeTitle('COLUMN')">УК</i>
            </a>
        </div>

        <div class="designer-toolbar__item">
            <a class="designer-toolbar__link button-text" href="javascript:void(0);" @click="removeElement('PAGE')">
                <i class="designer-toolbar__icon remove-icon remove-icon--big remove-icon--green" :title="removeTitle('PAGE')"></i>
            </a>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { MAX_COLUMN_TO_ROW } from '@/utils/Constants';
    import blockMixin from '@/mixins/BlockByType';

    export default {
        name: "ItemActionsBlock",
        mixins: [ blockMixin ],
        methods: {
            addColumn() {
                this.$emit("add", {type: 'COLUMN', blockId: this.getParentBlock('ROW', this.pageId, this.blockId).id});
            },
            addRow() {
                this.$emit("add", {type: 'ROW', blockId: this.pageId});
            },
            removeElement(type) {
                this.$emit("remove", type);
            },
            removeTitle(type) {
                return this.translate(`training.constructors.remove${type}`);
            }
        },
        computed: {
            availableColumn() {
                switch (this.blockType) {
                    case 'ROW':
                        return this.blockByType(this.blockType, this.pageId, this.blockId).columns.length < MAX_COLUMN_TO_ROW;
                    case 'COLUMN':
                    case 'ITEM':
                        return this.getParentBlock('ROW', this.pageId, this.blockId).columns.length < MAX_COLUMN_TO_ROW;
                    default:
                        return false;
                }
            },
            availableColumnForDelete() {
                switch (this.blockType) {
                    case 'ROW':
                        return this.blockByType(this.blockType, this.pageId, this.blockId).columns.length > 1;
                    case 'COLUMN':
                    case 'ITEM':
                        return this.getParentBlock('ROW', this.pageId, this.blockId).columns.length > 1;
                    default:
                        return false;
                }
            },
            availableRow() {
                return this.blockByType('PAGE', this.pageId, this.pageId).rows.length > 0;
            },
            ...mapGetters('manager', [
                'getParentBlock'
            ])
        }
    };
</script>
