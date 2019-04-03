<template>
    <div class="settings-image-wrap">

        <div class="settings-image">
            <div class="settings-image__col mb-2">
                <h4 class="title-form" v-lang.training.settings.image></h4>
                <div class="image-align">
                    <div class="image-align__item">
                        <a class="image-align__icon image-align-left"
                           :class="{'image-align__icon--active': isStart}"
                           href="javascript:void(0);"
                           :title="translate('training.settings.imageLeft')"
                           @click="setAlign('flex-start')"
                        >
                        </a>
                    </div>

                    <div class="image-align__item">
                        <a class="image-align__icon image-align-center"
                           :class="{'image-align__icon--active': isCenter}"
                           href="javascript:void(0);"
                           :title="translate('training.settings.imageCenter')"
                           @click="setAlign('center')"
                        >
                        </a>
                    </div>

                    <div class="image-align__item">
                        <a class="image-align__icon image-align-right"
                           :class="{'image-align__icon--active': isEnd}"
                           href="javascript:void(0);"
                           :title="translate('training.settings.imageRight')"
                           @click="setAlign('flex-end')"
                        >
                        </a>
                    </div>
                </div>
            </div>

            <div class="settings-image__col mb-2">
                <label class="title-form" for="image-width" v-lang.training.settings.imageWidth></label>

                <div class="select-row">
                    <select-block id="image-width"
                                  :elements="getImagesWidth"
                                  :selectedElement="getImageWidthCurrent"
                                  :classSelectedElementWrapper="'select--inline'"
                                  @selectElement="selectWidth"
                    >
                    </select-block>
                </div>
            </div>

            <div class="settings-image__col mb-2">
                <label class="title-form" for="image-height" v-lang.training.settings.imageHeight></label>

                <div class="select-row">
                    <select-block id="image-height"
                                  :elements="getImagesHeight"
                                  :selectedElement="getImageHeightCurrent"
                                  :classSelectedElementWrapper="'select--inline'"
                                  @selectElement="selectHeight"
                    >
                    </select-block>
                </div>
            </div>
        </div>

        <div>
            <h4 class="title-form" v-lang.training.constructors.IMAGE></h4>
            <div class="settings-image__item mb-2 flex-center">
                <el-upload class="upload-demo"
                           :action="`/training/service/rest/image/upload`"
                           drag
                           :multiple="false"
                           accept=" .jpg, .jpeg, .png, .bmp, .tif, .tiff, .svg"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload"
                >
                    <el-button slot="trigger" type="success" size="medium" v-text="loadImageTitle"/>
                </el-upload>
            </div>

            <div v-if="allUrls.length" class="settings-image__item mb-2 flex-center">
                <el-button type="success" size="medium" v-lang.training.constructors.downloadGallery @click="loadFromMediaStorage"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import blockMixin from '@/mixins/BlockByType';
    import { generateUUID } from 'utils/DeveloperUtils';

    export default {
        name: "settingsImage",
        data() {
            return {
                url: '',
                settings: {},
                getImageWidthCurrent: {},
                getImagesWidth: [],
                getImagesHeight: [],
                getImageHeightCurrent: {}
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
            this.$bus.$on("addImage", this.addImage);
            this.fillSettings(this.block);
        },
        beforeDestroy() {
            this.$bus.$off("addImage", this.addImage);
        },
        computed: {
            loadImageTitle() {
                return this.url
                    ? this.translate('training.constructors.imageUpdateUpload')
                    : this.translate('training.constructors.imageFirstUpload');
            },
            isStart() {
                return this.settings['justify-content'] === 'flex-start';
            },
            isCenter() {
                return this.settings['justify-content'] === 'center';
            },
            isEnd() {
                return this.settings['justify-content'] === 'flex-end';
            },
            ...mapGetters('manager', [
                'quiz',
                'allUrls'
            ])
        },
        methods: {
            addImage({item, page, url}) {
                if (this.blockId === item && this.pageId === page) {
                    this.url = url;
                    this.saveContent();
                }
            },
            loadFromMediaStorage() {
                this.$bus.$emit("selectFromMedia", {page: this.pageId, item: this.blockId});
            },
            fillSettings(block = {}) {
                const existsProperties = block && !this.isEmptyObject(block.settings);
                this.settings = existsProperties
                    ? JSON.parse(JSON.stringify(block.settings))
                    : this.quizSettings.imageSettings;

                const keys = Object.keys(this.settings);
                keys.forEach(key => {
                    if (!this.quizSettings.imageSettings[key]) {
                        delete this.settings[key];
                    }
                });

                const isSettingsFull = Object.keys(block.settings || {}).length === Object.keys(this.quizSettings.imageSettings).length;
                if (!isSettingsFull) {
                    this.settings = {...this.quizSettings.imageSettings, ...this.settings};
                }

                this.getImagesWidth = [
                    {id: '256px', name: this.translate('training.constructors.imageSmall')},
                    {id: '341px', name: this.translate('training.constructors.imageMiddle')},
                    {id: '512px', name: this.translate('training.constructors.imageBig')},
                    {id: '100%', name: this.translate('training.constructors.imageInherit')}
                ];
                this.getImagesHeight = [
                    {id: '128px', name: this.translate('training.constructors.imageSmall')},
                    {id: '192px', name: this.translate('training.constructors.imageMiddle')},
                    {id: '384px', name: this.translate('training.constructors.imageBig')},
                    {id: '100%', name: this.translate('training.constructors.imageInheritHeight')}
                ];

                this.getImageWidthCurrent = this.settings['width']
                    ? this.getImagesWidth.find(e => e.id === this.settings['width'])
                    : this.getImagesWidth[0];
                this.getImageHeightCurrent = this.settings['height']
                    ? this.getImagesHeight.find(e => e.id === this.settings['height'])
                    : this.getImagesHeight[0];
                this.url = block ? block.url : '';

                if (!existsProperties || !isSettingsFull) {
                    this.updateProperties();
                }
            },
            handleAvatarSuccess(res, file) {
                this.url = res;
                this.saveContent();
            },
            beforeAvatarUpload(file) {
                const isLt4M = file.size / 1024 / 1024 < 4;

                if (!isLt4M) {
                    console.error('Avatar picture size can not exceed 4MB!');
                    return;
                }
                return isLt4M;
            },
            setAlign(position) {
                this.settings['justify-content'] = position;
                this.updateProperties();
            },
            selectWidth({ id, name }) {
                this.settings['width'] = id;
                this.getImageWidthCurrent = this.getImagesWidth.find(e => e.id === id);
                this.updateProperties();
            },
            selectHeight({ id, name }) {
                this.settings['height'] = id;
                this.getImageHeightCurrent = this.getImagesHeight.find(e => e.id === id);
                this.updateProperties();
            },
            updateProperties() {
                this.$emit('update', {field: 'settings', value: this.settings});
            },
            saveContent() {
                this.interactiveElement
                    ? this.addItem()
                    : this.$emit('update', {field: 'url', value: this.url});
            },
            addItem() {
                this.$emit('addItem', {settings: this.settings, url: this.url});
                this.content = '';
                this.fillSettings();
            }
        }
    };
</script>
