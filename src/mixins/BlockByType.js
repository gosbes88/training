import { mapGetters } from 'vuex';
import { isUUID } from "../../../../common/common.vue/src/utils/DeveloperUtils";

/**
 * Миксин для работы с блоками настроек для элементов, содержит данные блока, по которому
 * настройка параметров
 */
export default {
    props: {
        blockType: {
            type: String,
            required: true
        },
        blockId: {
            type: null,
            validator(val) {
                return val === null || isUUID(val);
            }
        },
        pageId: {
            type: null,
            validator(val) {
                return val === null || isUUID(val);
            }
        },
        interactiveElement: {
            type: null,
            required: false,
            validator(value) {
                return typeof value === 'object' || !value;
            }
        }
    },
    computed: {
        block() {
            return this.interactiveElement
                ? this.interactiveElement
                : this.blockByType(this.blockType, this.pageId, this.blockId);
        },
        ...mapGetters('manager', [
            'blockByType',
            'quizSettings'
        ])
    }
}
