<template>
    <div class="fixed-wrapper">
        <iframe 
            src="https://www.mlb.com/giants/third-party-header/?no_links=false"
            class="custom-iframe">
        </iframe>
        <header class="navbar navbar-expand-lg" :style="navbarStyle">
            <div class="container">
                <!-- Nav Logo -->
                <router-link class="navbar-brand" to="/">
                    <img v-if="generalInfo?.campaign_logo" :src="generalInfo.campaign_logo" alt="Logo" width="240"
                        height="75" />
                </router-link>

                <!-- Main Navbar Links (Visible only on large screens) -->
                <ul class="navbar-nav main-nav w-100 d-none d-lg-flex justify-content-center align-items-center mb-0">
                    <li class="nav-item border-end border-dark">
                        <router-link class="nav-link" to="/" exact-active-class="active-link">Home</router-link>
                    </li>
                    <li class="nav-item border-end border-dark">
                        <router-link class="nav-link" to="/about" exact-active-class="active-link">About</router-link>
                    </li>
                    <li class="nav-item border-end border-dark">
                        <router-link class="nav-link" to="/shop" exact-active-class="active-link">Shop</router-link>
                    </li>
                    <li class="nav-item border-end border-dark">
                        <router-link class="nav-link" to="/mccovey" exact-active-class="active-link">McCovey</router-link>
                    </li>
                    <li class="nav-item border-end border-dark">
                        <router-link class="nav-link" to="/stories" exact-active-class="active-link">Stories</router-link>
                    </li>
                    <li class="nav-item border-end border-dark">
                        <router-link class="nav-link" to="/faq" exact-active-class="active-link">FAQ</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/contact" exact-active-class="active-link">Contact</router-link>
                    </li>
                </ul>

                <!-- Cart Icon and Sidebar Toggle Button -->
                <div class="d-flex align-items-center ms-auto">
                    <!-- Cart Icon (Visible in both views) -->
                    <router-link class="btn-outline-secondary position-relative p-2 shadow-none border-0 no-hover"
                        to="/cart">
                        <i class="bi bi-bag" style="font-size: 2.5rem;"></i>
                        <!-- Cart badge with item count -->
                        <span class="position-absolute mt-1 top-50 start-50 translate-middle badge">{{ cartCount }}</span>
                    </router-link>

                    <!-- Nav SideBar (Mobile view sidebar toggle button) -->
                    <button type="button" class="navbar-toggler shadow-none border-0" data-bs-toggle="offcanvas"
                        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <i class="bi bi-list" style="font-size: xx-large;"></i>
                    </button>
                </div>

                <!-- SideBar Header (Mobile view sidebar) -->
                <div class="offcanvas offcanvas-end p-4" id="navbarNav" :style="navbarStyle">
                    <div class="offcanvas-header justify-content-end">
                        <button type="button" class="shadow-none bg-transparent border-0" data-bs-dismiss="offcanvas">
                            <i class="bi bi-x-lg" data-bs-dismiss="offcanvas" style="font-size: x-large;"></i>
                        </button>
                    </div>
                    <!-- SideBar Body (Visible only on small screens) -->
                    <div class="offcanvas-body">
                        <ul class="navbar-nav sidebar-nav text-end">
                            <li class="nav-item active border-bottom border-dark mt-5">
                                <router-link class="nav-link" to="/" exact-active-class="active-link"
                                    @click="closeOffCanvas">Home</router-link>
                            </li>
                            <li class="nav-item border-bottom border-dark">
                                <router-link class="nav-link" to="/about" exact-active-class="active-link"
                                    @click="closeOffCanvas">About</router-link>
                            </li>
                            <li class="nav-item border-bottom border-dark">
                                <router-link class="nav-link" to="/shop" exact-active-class="active-link"
                                    @click="closeOffCanvas">Shop</router-link>
                            </li>
                            <li class="nav-item border-bottom border-dark">
                                <router-link class="nav-link" to="/mccovey" exact-active-class="active-link"
                                    @click="closeOffCanvas">McCovey</router-link>
                            </li>
                            <li class="nav-item border-bottom border-dark">
                                <router-link class="nav-link" to="/stories" exact-active-class="active-link"
                                    @click="closeOffCanvas">Stories</router-link>
                            </li>
                            <li class="nav-item border-bottom border-dark">
                                <router-link class="nav-link" to="/faq" exact-active-class="active-link"
                                    @click="closeOffCanvas">FAQ</router-link>
                            </li>
                            <li class="nav-item border-bottom border-dark">
                                <router-link class="nav-link" to="/contact" exact-active-class="active-link"
                                    @click="closeOffCanvas">Contact</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useCampaignStore } from '@/store/campaign';
import { useCartStore } from '@/store/cart';

export default {
    name: 'Header',
    setup() {
        const campaignStore = useCampaignStore();
        const cartStore = useCartStore();
        const generalInfo = computed(() => campaignStore.generalInfo);
        const cartCount = computed(() => cartStore.totalItems || 0);

        const navbarStyle = computed(() => ({
            backgroundColor: campaignStore.generalInfo?.menu_header_color || '#ffffff',
        }));

        const closeOffCanvas = () => {
            const offCanvasElement = document.querySelector('.offcanvas');
            if (offCanvasElement) {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offCanvasElement);
                bsOffcanvas?.hide();
            }
        };

        // Method to set custom styles for navigation based on general info
        const setButtonStyles = () => {
            const generalInfo = campaignStore.generalInfo;
            if (generalInfo) {
                document.documentElement.style.setProperty('--menu-link-color', generalInfo.menu_link_color || '#000');
                document.documentElement.style.setProperty('--menu-hover-link-color', generalInfo.menu_hover_link_color || '#fff');
                document.documentElement.style.setProperty('--menu_header_icon_color', generalInfo.menu_header_icon_color || '#fff');
            }
        };

        onMounted(() => {
            setButtonStyles();
        });

        return {
            generalInfo,
            cartCount,
            navbarStyle,
            closeOffCanvas,
        };
    },
};
</script>

<style scoped>
.container {
    padding: 0 0;
}

.navbar{
    --bs-navbar-brand-margin-end: 0rem;
}

@media (min-width: 315px) and (max-width: 375px) {
    .navbar-brand img {
        width: 200px !important;
        height: 65px !important;
    }
}

@media (min-width: 315px) and (max-width: 767px) {
    .navbar-brand {
        margin-left: 1rem;
    }
}

@media (min-width: 992px) {
    .main-nav {
        display: flex !important;
    }

    .sidebar-nav {
        display: none;
    }
}

.offcanvas.show~.main-nav {
    display: none !important;
}

.offcanvas.offcanvas-end {
    width: 250px;
}

.offcanvas.show .sidebar-nav .nav-item a {
    padding: 10px 16px 10px 16px;
}

.navbar-nav>li>.nav-link {
    text-transform: uppercase;
    padding: 5px 30px;
    font-size: 1rem;
    font-weight: 700;
}

.nav-link {
    color: var(--menu-link-color) !important;
}

.nav-link:hover {
    color: var(--menu-hover-link-color) !important;
    transition: color 0.3s ease;
}

.nav-link.active-link {
    color: var(--menu-hover-link-color) !important;
}

.no-hover:hover,
.no-hover:focus,
.no-hover:active {
    background-color: transparent !important;
    color: inherit !important;
    box-shadow: none;
}

.bi {
    color: var(--menu_header_icon_color) !important;
}

.badge {
    color: var(--menu-link-color) !important;
}

/* Ensure the wrapper is fixed at the top */
.fixed-wrapper {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    background: white;
    z-index: 1030; /* High z-index to ensure visibility */
}

/* Adjust the iframe */
.custom-iframe {
    width: 100%;
    height: 56px;
    border: none;
    display: block;
}

/* Navbar adjustments */
.navbar {
    position: relative; /* Prevents overlap issues */
    width: 100%;
    background-color: var(--menu-header-color, #ffffff);
    z-index: 1031;
}

</style>