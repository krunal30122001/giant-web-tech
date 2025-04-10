<template>
    <div class="container" v-if="homePageData">
        <div class="h-box text-center">
            <div class="content">
                <h3 :style="campaignNameStyle">{{ homePageData.campaign_name_text }}</h3>
                <h4 :style="taglineStyle">{{ homePageData.tagline_text }}</h4>
                <router-link class="btn" to="/about">{{ homePageData.title_box_button_text }}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useCampaignStore } from '@/store/campaign';
import { setButtonStyles, setBoxStyles } from '@/utils/buttonStyles';

export default {
    name: 'HomePage',
    setup() {
        const campaignStore = useCampaignStore();
        const homePageData = computed(() => campaignStore.homePageData);
        const themeData = computed(() => campaignStore.themeData);

        const campaignNameStyle = computed(() => {
            return homePageData.value
                ? {
                    color: homePageData.value.campaign_name_font_color,
                    fontSize: homePageData.value.campaign_name_font_size + 'px',
                }
                : {};
        });

        const taglineStyle = computed(() => {
            return homePageData.value
                ? {
                    color: homePageData.value.tagline_font_color,
                    fontSize: homePageData.value.tagline_font_size + 'px',
                }
                : {};
        });

        onMounted(() => {
            setButtonStyles(themeData.value?.general_information);
            setBoxStyles(homePageData.value);
        });

        return {
            homePageData,
            campaignNameStyle,
            taglineStyle,
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 700px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 300px 0 250px 0;
}
.h-box {
    position: relative;
    padding: 30px;
    border: 8px solid #fff;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.79);
}
.h-box::before {
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

.content {
    position: relative;
    z-index: 1;
}

@media (min-width: 315px) and (max-width: 426px) {
    h3{
        font-size: 40px !important;
    }
    h4{
        font-size: 40px !important;
    }
}

@media (min-width: 315px) and (max-width: 767px) {
    .h-box {
        margin: 0 15px;
    }
}
</style>
