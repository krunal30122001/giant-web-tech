<template>
    <div class="container" v-if="aboutPageData">
        <div class="box">
            <h2 class="text-center header-font">{{ aboutPageData.header_text }}</h2>
            <p v-html="aboutPageData.about_text"></p>

            <div class="row align-items-center">
                <div class="col-md-5 d-flex justify-content-center">
                    <img :src="aboutPageData.about_page_image" style="width: 100%; height: auto;" alt="About Image" />
                </div>
                <div class="col-md-7">
                    <h5 class="fw-bold pt-3 sub-header-font">{{ aboutPageData.second_header_text }}</h5>
                    <p v-html="aboutPageData.subheader_text"></p>
                </div>
            </div>

            <div class="text-center mt-5">
                <router-link class="btn" to="/shop">{{ aboutPageData.button_text }}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useCampaignStore } from '@/store/campaign';
import { setButtonStyles, setHeaderFontStyles, setSubHeaderFontStyles } from '@/utils/buttonStyles';

export default {
    name: 'AboutPage',
    setup() {
        const campaignStore = useCampaignStore();
        const aboutPageData = computed(() => campaignStore.aboutPageData);
        const themeData = computed(() => campaignStore.themeData);

        onMounted(() => {
            setButtonStyles(themeData.value?.general_information);
            setHeaderFontStyles(themeData.value?.general_information);
            setSubHeaderFontStyles(themeData.value?.general_information);
        });

        return {
            aboutPageData,
        };
    },
};
</script>

<style scoped>
@media (max-width: 768px) {
    .box {
        margin: 0 15px;
    }
}
</style>
