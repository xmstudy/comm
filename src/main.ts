import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "vant/lib/index.css";
import { Icon } from "vant";

createApp(App).use(router).use(Icon).mount("#app");
