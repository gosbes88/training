/*Стили для интерактивных элементов*/

export default {
    data() {
        return {
            checkboxColor: {
                'GREEN': '',
                'BLUE': 'check-blue-icon',
                'BLACK': 'check-black-icon'
            },
            radioColor: {
                'GREEN': '',
                'BLUE': 'inp-radio--blue',
                'BLACK': 'inp-radio--black'
            }
        };
    },
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        isProduction: {
            type: Boolean,
            default: false
        },
        selectedItems: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        checkboxStyle() {
            switch (this.item.interactiveSettings['checkboxSize']) {
                case 'MEDIUM':
                    return {
                        wrapper: 'checkbox-square',
                        icon: 'checkbox-square__icon ' + this.checkboxColor[this.item.interactiveSettings['checkboxColor']]
                    };
                case 'SMALL':
                    return {
                        wrapper: 'checkbox-square-small',
                        icon: 'checkbox-square-small__icon ' + this.checkboxColor[this.item.interactiveSettings['checkboxColor']]
                    };
                case 'BIG':
                    return {
                        wrapper: 'checkbox-square-big',
                        icon: 'checkbox-square-big__icon ' + this.checkboxColor[this.item.interactiveSettings['checkboxColor']]
                    };
            }
        },
        radioStyle() {
            switch (this.item.interactiveSettings['checkboxSize']) {
                case 'MEDIUM':
                    return {
                        input: 'inp-radio ' + this.radioColor[this.item.interactiveSettings['checkboxColor']],
                        label: 'radio-label'
                    };
                case 'SMALL':
                    return {
                        input: 'inp-radio inp-radio-small ' + this.radioColor[this.item.interactiveSettings['checkboxColor']],
                        label: 'radio-label--small'
                    };
                case 'BIG':
                    return {
                        input: 'inp-radio inp-radio-big ' + this.radioColor[this.item.interactiveSettings['checkboxColor']],
                        label: 'radio-label--big'
                    };
            }
        },
        interactiveStyles() {
            const isPositionLeft = this.item.interactiveSettings['positions'] === 'LEFT';
            const base = {'order': isPositionLeft ? -1 : 1};
            return {...base, margin: isPositionLeft ? '0 20px 0 0' : '0 0 0 20px'};
        },
        interactiveItems: {
            get() {
                return this.item.items;
            },
            set(value) {
                this.$emit("changeItems", {parentId: this.item.id, items: value});
            }
        }
    },
    methods: {
        check() {
            if (!this.isProduction) {
                return;
            }
            this.$emit("check", this.item.id);
        },
        selectItem(id) {
            this.$emit("selectInteractiveElement", {elementId: id, parentId: this.item.id});
        },
        checked(id) {
            return this.isProduction ? this.selectedItems.includes(id) : true;
        }
    }
};
