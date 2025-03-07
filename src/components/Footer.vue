<template>
    <footer class="footer" :style="footerStyle">
        <iframe 
            class="mlb-footer-iframe"
            scrolling="no"
            src="https://www.mlb.com/giants/third-party-footer/?no_links=false"
            style="height: 188px; width: 100%; border: none; display: block;" >
        </iframe>
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

        return {
            footerStyle
        };
    },
};
</script>

<style >
.footer {
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    margin: 0;
    padding: 0;
    overflow: hidden; /* Prevent scrolling */
}

.mlb-footer-iframe {
    height: 188px; /* Default height */
    width: 100%;
    border: none;
    display: block;
    overflow: hidden; /* Ensure no internal scrolling */
}

/* Adjust height for mobile screens */
@media (max-width: 768px) {
    .mlb-footer-iframe {
        height: 238px !important; /* Set height for mobile screens */
    }
}
</style>

