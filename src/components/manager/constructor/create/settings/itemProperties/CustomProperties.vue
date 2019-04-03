<template>
    <div class="details-properties mb-2">
        <!--Настройки текста-->
        <div class="mb-2" v-if="block.contentType === 'TEXT'">
            <settings-text :block-type="blockType"
                           :block-id="blockId"
                           :page-id="pageId"
                           :interactive-element="interactiveElement"
                           @update="$event => $emit('update', $event)"
                           @addItem="$event => $emit('addItem', $event)"
            />
        </div>

        <!--Настройки изображения-->
        <div v-else-if="block.contentType === 'IMAGE'">
            <settings-image :block-type="blockType"
                            :block-id="blockId"
                            :page-id="pageId"
                            :interactive-element="interactiveElement"
                            @update="$event => $emit('update', $event)"
                            @addItem="$event => $emit('addItem', $event)"
            />
        </div>

        <div v-else-if="block.contentType === 'ELEMENT'">
            <h4 class="title-form" v-lang.training.settings.element></h4>
            <settings-element :block-type="blockType"
                              :block-id="blockId"
                              :page-id="pageId"
                              :interactive-element="interactiveElement"
                              @update="$event => $emit('update', $event)"
                              @addItem="$event => $emit('addItem', $event)"
            />
        </div>
    </div>
</template>

<script>
    import blockMixin from '@/mixins/BlockByType';

    export default {
        name: "CustomProperties",
        mixins: [ blockMixin ],
        components: {
            SettingsElement: () => import("./SettingsElement"),
            SettingsText: () => import("./SettingsText"),
            SettingsImage: () => import("./SettingsImage")
        }
    };
</script>
