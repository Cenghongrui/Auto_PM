import { createRouter, createWebHistory } from 'vue-router';
import GeneratePage from './pages/GeneratePage.vue';
import EditorPage from './pages/EditorPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'generate', component: GeneratePage },
    { path: '/editor', name: 'editor', component: EditorPage },
  ],
});
