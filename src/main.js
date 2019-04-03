import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import {sync} from 'vuex-router-sync';
import VueHead from 'vue-head';
import MultiLanguage from 'vue-multilanguage';
import language from './lang';
import VueResource from "vue-resource";
import { COMPONENTS_SAVE_TEST_SCROLL_POSITION, HTTP_STATUS, LOGIN_URL } from "./utils/Constants";
import { isIE } from "../../../common/common.vue/src/utils/DeveloperUtils";
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import VueAutosize from 'vue-autosize';
import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer';
import CommonPlugin from '../../../common/common.vue/src/plugins/Common';

Vue.config.productionTip = false;

//синхронизация роутера с хранилищем, чтобы иметь в хранилище доступ к переменным роутера
sync(store, router);

const bus = new Vue();

let xhr = null;
Object.defineProperties(Vue.prototype, {
    $bus: {
        get() {
            return bus;
        }
    },
    $xhr: {
        get() {
            return xhr;
        },
        set(value) {
            xhr = value;
        }
    }
});

Vue.use(VueHead, { separator: ''});
Vue.use(MultiLanguage, language);
Vue.use(VueResource);
Vue.use(CommonPlugin);
Vue.use(VueAutosize);
Vue.use(ElementUI, { locale });
Vue.use(Viewer);
Viewer.setDefaults({
    zIndexInline: 2017
});

Vue.http.headers.common['Pragma'] = 'no-cache';
Vue.http.headers.common['Cache-Control'] = 'no-cache';

router.beforeEach((to, from, next) => {
    if (from.fullPath === "/" && to.name === "error-403") {
        store.commit("setRedirectToBase", true);
    }
    Vue.http.get('/as/service/rest/user/validate-token')
        .then(response => response.body)
        .then(auth => {
            if (auth) {
                if (vue.$xhr) {
                    vue.$xhr.forEach(e => e.abort());
                    vue.$xhr = [];
                }
                if (vue.$store.state.user.orElse(null) && ((to.path.startsWith("/m") && !vue.$store.getters.hasManager) || (to.path.startsWith("/p") && !vue.$store.getters.hasUser))) {
                    next(false);
                } else {
                    next();
                }
            } else {
                window.location = window.location.origin + LOGIN_URL;
            }
        })
        .catch(error => console.log(error));
});

router.afterEach((to, from) => {
    store.commit('setHasNavPanel', false);
    store.commit('setErrorPage', false);
    store.commit('setFooterView', true);
    store.commit('setHeaderView', true);
    store.commit('changeFilledFooter', false);
    if (to.name === 'Manager' && !COMPONENTS_SAVE_TEST_SCROLL_POSITION.includes(from.name)) {
        window.sessionStorage.removeItem('surveysScrollPosition');
    }
    if ('Test' !== to.name) {
        window.sessionStorage.removeItem('test');
    }
});

Vue.http.interceptors.push((request, next) => {
    if (isIE()) {
        request.url += `${request.url.includes('?') ? '&' : '?'}d=${new Date().getTime()}`;
    }

    next(response => {
        if (response.status === 401) {
            window.location = window.location.origin + LOGIN_URL;
        } else if (HTTP_STATUS[response.status]) {
            bus.$emit("error", response.status);
        }
    });
});

export const vue = new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});
