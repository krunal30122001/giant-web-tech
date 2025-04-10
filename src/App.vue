<template>
    <div id="app">
        <div v-if="isLoading" class="loader-container">
            <div class="loader"></div>
            <p class="loading-text">Loading campaign data...</p>
        </div>        
        <div v-else>  
            <div v-if="verified"> 
                <Header />            
                <router-view />
                <Footer />
            </div>

            <div v-else class="container-md">
                <div class="c-box">    
                    <div class="content">
                        <form @submit.prevent="checkCodeInput">
                            <div class="form-group row pt-2">
                                <div class="col-12 m-0 align-self-center">
                                    <label class="fw-bold"><span class="text-danger">*</span> Please enter your U.S. Soccer Brick Program access code</label>
                                    <input v-model="formData.code" id="form_code" type="text" name="code"
                                        :class="['form-control', 'rounded-0', 'bg-transparent', 'mt-2', errorClass('code')]"
                                        placeholder="Enter Code" @input="clearError('code')" />
                                    <p class="error-m mt-1" v-if="errors.code">{{ errors.code }}</p>
                                </div>
                                <div class="col-12 mt-2">
                                    <button type="submit" class="btn">Verify Code</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>                 
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { useCampaignStore } from '@/store/campaign';
import { ref, computed, onMounted, watch } from 'vue';
import { setButtonStyles, setBoxStyles } from '@/utils/buttonStyles';
import { useCookies } from 'vue3-cookies';
const { cookies } = useCookies();

export default {
    name: 'App',
    components: { Header, Footer },

    setup() {
        const campaignName = import.meta.env.VITE_CAMPAIGN_NAME;
        const appMode = import.meta.env.VITE_APP_MODE;
        const campaignStore = useCampaignStore();
        const homePageData = computed(() => campaignStore.homePageData);
        const themeData = computed(() => campaignStore.themeData);
        const isLoading = computed(() => campaignStore.isLoading);
        const generalInfo = computed(() => campaignStore.generalInfo);
        const verified = ref(false);
        const formData = ref({ code: '' });
        const errors = ref({});

        onMounted(async () => {
            // console.log(`App running in ${appMode} mode for campaign: ${campaignName}`);
            await campaignStore.loadCampaignData(campaignName);
            setButtonStyles(themeData.value?.general_information);
            setBoxStyles(homePageData.value);

            const storedData = sessionStorage.getItem('verifiedCode');

            if (storedData) {
                verified.value = true;
            }
            // Watch for changes in generalInfo and update body styles and favicon accordingly.
            watch(
                generalInfo,
                (data) => {
                    data ? updatePageAppearance(data) : resetPageAppearance();
                },
                { immediate: true }
            );
        });

        async function checkCodeInput() {
            if (validateForm()) {                
                try {     
                    const response = await campaignStore.checkCode(formData.value.code);                                                          
                    if (response.status == "success") {
                        verified.value = true;  
                        // Store response in session storage
                        sessionStorage.setItem('verifiedCode', JSON.stringify(response));
                        cookies.set('verifiedCode', response, '1d');                      
                    } else {                                            
                        errors.value.code = response.message || 'Invalid code';
                    }
                } catch (error) {
                    errors.value.code = 'Error verifying the code. Please try again.';
                }
            }
        }
        
        function validateForm() {
            errors.value = {};

            // Validate First Name
            if (!formData.value.code) {
                errors.value.code = 'Code is required';
            }        
            // Return true if no errors, otherwise false
            return Object.keys(errors.value).length === 0;
        }

        function errorClass(field) {
            return errors.value[field] ? 'border-danger shadow bg-danger-subtle' : 'border-dark';
        }
        function clearError(field) {
            errors.value[field] = '';
        }

        // Function to update body background, favicon, and title.
        function updatePageAppearance({ background_image, site_fav_icon, site_name, font_style_url, font_style }) {
            setBodyBackground(background_image);
            setFaviconAndTitle(site_fav_icon, site_name);
            setFontStyle(font_style_url, font_style);
        }

        function setFontStyle(fontStyleUrl, fontStyle) {
            // Remove any existing dynamically loaded font styles to avoid duplication.
            const existingLink = document.querySelector('link[rel="stylesheet"][data-dynamic-font]');
            if (existingLink) {
                existingLink.remove();
            }

            // Load the font from the provided URL if given
            if (fontStyleUrl) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = fontStyleUrl;
                link.setAttribute('data-dynamic-font', 'true');
                document.head.appendChild(link);
            }

            // Set font family only if font style is provided
            if (fontStyle) {
                document.body.style.fontFamily = fontStyle;
            }
        }

        function setBodyBackground(imageUrl) {
            document.body.style.background = imageUrl
                ? `url(${imageUrl}) no-repeat center center / cover fixed`
                : '';
        }

        function setFaviconAndTitle(faviconUrl, siteName) {
            // Ensure the favicon link element exists or create a new one.
            let link = document.querySelector("link[rel='icon']") || createFaviconLink();
            link.href = faviconUrl || 'favicon.ico';

            // Update the page title with a fallback to a default value.
            document.title = siteName || 'U.S. Soccer Brick Program';
        }

        function createFaviconLink() {
            const link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
            return link;
        }

        function resetPageAppearance() {
            setBodyBackground('');
            setFaviconAndTitle('', 'U.S. Soccer Brick Program');
        }

        watch(isLoading, (loading) => {
            document.body.classList.toggle('loading', loading);
        });

        return { isLoading, campaignName, formData, checkCodeInput, verified, errors, errorClass, clearError };
    },
};
</script>

<style scoped>
.container-md {
    max-width: 700px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.c-box {
    position: relative;
    padding: 50px 30px 50px 30px;    
    border: 8px solid #fff;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.79);    
}

.c-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--box-background-color);
    opacity: calc(var(--box-opacity) / 100);
    z-index: 0;
}
/* Loader Styles */
.loader-container {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
.content {
    position: relative;
    z-index: 1;
}

.loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #cc0000;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-text {
    margin-top: 20px;
    font-size: 1rem;
    color: #333;
    text-align: center;
}

body.loading {
    overflow: hidden;
}
</style>
