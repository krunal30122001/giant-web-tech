<template>
    <footer class="footer mt-auto py-2 fixed-bottom" :style="footerStyle">
        <div class="container">
            <div class="row justify-content-between align-items-center">
                <!-- Footer Left Content -->
                <div class="footer-text" :class="footerTextClass" :style="{ color: footerTextColor }">
                    © 2025
                    <a href="https://fundraiserssports.com" target="_blank" class="pe-1"
                        :style="{ color: footerTextColor }">
                        <img src="../assets/images/frs-logo.svg" alt="Fund Raisers Sports Logo" style="height: 16px;" />
                    </a>
                    <a href="https://fundraiserssports.com" target="_blank" :style="{ color: footerTextColor }">
                        Fund Raisers Sports
                    </a>, a division of
                    <a href="https://bricksrus.com" target="_blank" :style="{ color: footerTextColor }">
                        <img src="../assets/images/bru-logo.svg" alt="Bricks R Us Logo" style="height: 16px;">
                    </a> |
                    <a href="https://fundraiserssports.com/privacy-policy.html" target="_blank"
                        :style="{ color: footerTextColor }">Privacy Policy</a>
                </div>

                <!-- Social Media Icons -->
                <div v-if="showSocialIcons" class="col-12 col-md-3">
                    <div class="d-flex justify-content-center justify-content-md-end">
                        <a v-if="isValidLink(generalInfo.facebook_link)" :href="generalInfo.facebook_link"
                            target="_blank" class="mx-2">
                            <i class="bi bi-facebook fs-4" :style="{ color: socialIconColor }"></i>
                        </a>
                        <a v-if="isValidLink(generalInfo.twitter_link)" :href="generalInfo.twitter_link" target="_blank"
                            class="mx-2">
                            <i class="bi bi-twitter fs-4" :style="{ color: socialIconColor }"></i>
                        </a>
                        <a v-if="isValidLink(generalInfo.instagram_link)" :href="generalInfo.instagram_link"
                            target="_blank" class="mx-2">
                            <i class="bi bi-instagram fs-4" :style="{ color: socialIconColor }"></i>
                        </a>
                        <a v-if="isValidLink(generalInfo.pinterest_link)" :href="generalInfo.pinterest_link"
                            target="_blank" class="mx-2">
                            <i class="bi bi-pinterest fs-4" :style="{ color: socialIconColor }"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import { computed } from 'vue';
import { useCampaignStore } from '@/store/campaign';

export default {
    name: 'Footer',
    setup() {
        const campaignStore = useCampaignStore();
        const generalInfo = computed(() => campaignStore.generalInfo);

        const footerStyle = computed(() => ({
            backgroundColor: generalInfo.value?.menu_header_color || '', // Background color from API
        }));

        const footerTextColor = computed(() => generalInfo.value?.footer_text_colour || ''); // Footer text color from API

        const socialIconColor = computed(() => generalInfo.value?.footer_social_logo_colour || ''); // Social icons color from API

        const showSocialIcons = computed(() => {
            // Check if at least one social link is valid
            return (
                isValidLink(generalInfo.value?.facebook_link) ||
                isValidLink(generalInfo.value?.twitter_link) ||
                isValidLink(generalInfo.value?.instagram_link)
            );
        });

        const footerTextClass = computed(() => {
            // Set class based on the availability of social icons
            return showSocialIcons.value ? 'col-12 col-md-9' : 'col-12 text-center'; // Use full width if no icons
        });

        function isValidLink(link) {
            // Check if the link is not '0' and is a valid URL
            return link && link !== '0';
        }

        return {
            generalInfo,
            footerStyle,
            footerTextColor,
            socialIconColor,
            showSocialIcons,
            footerTextClass,
            isValidLink,
        };
    },
};
</script>

<style scoped>

.container {
    padding: 0 0;
}

.footer {
    z-index: 1;
    padding: 0 15px;
}

@media (max-width: 576px) {
    .footer-text {
        text-align: center !important;
    }
}
</style>
