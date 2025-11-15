import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from './Layouts/AppLayout.vue';
import Home from './pages/Home.vue';
import About from './pages/About.vue';
import Contact from './pages/Contact.vue';
import Profile from './pages/Profile.vue';
import List from './pages/List.vue';
import Catalogs from './pages/Catalogs.vue';
import Search from './pages/Search.vue';
import './style.css'

const root = document.getElementById('app');

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // { path: "/:pathMatch(.*)*",component: NotFound },
        { path: "/", name: "home", component: Home },
        { path: "/about",name: "about",component: About },
        { path: "/contact",name: "contact",component: Contact },
        { path: "/profile",name: "profile",component: Profile },
        { path: "/listproducts",name: "listproducts",component: List},
        { path: "/listcatalogs",name: "listcatalogs",component: Catalogs },
        { path: "/searchproduct",name: "searchproduct",component: Search },
    ]
  });
  if (root) {
    createApp(AppLayout).use(router).mount(root);
  }
  
// createApp(App).mount('#app')
