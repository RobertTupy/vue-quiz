import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

import App from "./App.vue";
import Antd from "ant-design-vue";
import router from "./router";

import "ant-design-vue/dist/antd.css";
const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(Antd);
app.use(router);
app.use(pinia);

app.mount("#app");
