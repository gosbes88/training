'use strict';

const path = require("path");
const config = require('../config');
const copyText = require('../../../common/common.vue/src/build/resources-text');

const targetDir = path.resolve(__dirname, '../target');

copyText(targetDir, '../../training/training.web/src/main/resources/strings', config);
