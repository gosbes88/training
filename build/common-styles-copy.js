'use strict';

const copyStyles = require("../../../common/common.vue/src/build/common-styles-copy");
const path = require("path");

copyStyles(path.resolve(__dirname, '../training/static/fonts'), path.resolve(__dirname, '../training/static/img'));
