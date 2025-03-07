import { createRouter, createWebHistory } from 'vue-router';

const HomePage = () => import('@/views/HomePage.vue');
const AboutPage = () => import('@/views/AboutPage.vue');
const ShopPage = () => import('@/views/ShopPage.vue');
const McCoveyPage = () => import('@/views/McCoveyPage.vue');
const ProductPage = () => import('@/views/ProductPage.vue');
const McCoveyProductPage = () => import('@/views/McCoveyProductPage.vue');
const StoriesPage = () => import('@/views/StoriesPage.vue');
const FAQPage = () => import('@/views/FAQPage.vue');
const ContactPage = () => import('@/views/ContactPage.vue');
const CartPage = () => import('@/views/CartPage.vue');
const EditInscriptionPage = () => import('@/views/EditInscriptionPage.vue');
const CheckoutPage = () => import('@/views/CheckoutPage.vue');
const PaymentPage = () => import('@/views/PaymentPage.vue');
const ConfirmationPage = () => import('@/views/ConfirmationPage.vue');

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/about', name: 'About', component: AboutPage },
    { path: '/shop', name: 'Shop', component: ShopPage },
    { path: '/mccovey', name: 'McCovey', component: McCoveyPage },
    {
        path: '/product/:id',
        name: 'Product',
        component: ProductPage,
    },
    {
        path: '/mc-product/:id',
        name: 'McProduct',
        component: McCoveyProductPage,
    },
    { path: '/stories', name: 'Stories', component: StoriesPage },
    { path: '/faq', name: 'FAQ', component: FAQPage },
    { path: '/contact', name: 'Contact', component: ContactPage },
    { path: '/cart', name: 'Cart', component: CartPage },
    { path: '/edit-inscription/:productId', name: 'EditInscriptionPage', component: EditInscriptionPage, props: true },
    { path: '/checkout', name: 'Checkout', component: CheckoutPage },
    { path: '/payment', name: 'Payment', component: PaymentPage },
    { path: '/confirmation', name: 'Confirmation', component: ConfirmationPage },
];
const subfolder = import.meta.env.VITE_SUBFOLDER || 'jack01';
const appMode = import.meta.env.VITE_APP_MODE || 'development';

const router = createRouter({
    // history: createWebHistory(`/${subfolder}/`), // Set base URL for router
    history: appMode === 'development' 
        ? createWebHistory(`/${subfolder}/`)  // Development mode: includes subfolder
        : createWebHistory(), // Production mode: no subfolder
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

export default router;
