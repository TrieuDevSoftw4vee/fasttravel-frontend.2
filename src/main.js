import {createApp} from 'vue';
import App from './App.vue';
import router from './router/index.js';
import './styles.css';
import './theme-blue.css';
import './figma.css';
import './upcoming-trips.css';
createApp(App).use(router).mount('#app');
