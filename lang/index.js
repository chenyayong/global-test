import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zh from './config/zh';
import en from './config/en';
import ja from './config/ja';

Vue.use(VueI18n);

const messages = {
	zh,
	en,
	ja
};

const i18n = new VueI18n({
	locale: 'zh', // 设置地区
	messages // 设置地区信息
});

export default i18n;
