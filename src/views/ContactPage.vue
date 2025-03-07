<template>
  <div class="container" v-if="contactPageData">
    <div class="box">
      <img :src="contactPageData.contact_background_image" class="img-fluid w-100 contact-image" />
      <div class="row text-center">
        <div class="col-md-4 col-12 p-3">
          <div class="icon-wrapper">
            <i class="bi bi-telephone icon"></i>
          </div>
          <h2 class="mt-3 mb-0 sub-header-font">CONTACT US</h2>
          <p class="mt-3 mb-0 fw-medium">{{ contactPageData.phone_number }}</p>
          <p class="mt-3 text-break">{{ contactPageData.email_address }}</p>
        </div>
        <div class="col-md-4 col-12 p-3">
          <div class="icon-wrapper">
            <i class="bi bi-geo-alt icon"></i>
          </div>
          <h2 class="mt-3 mb-0 sub-header-font">MAILING ADDRESS</h2>
          <p v-html="contactPageData.mailing_address" class="mt-3 mb-0"></p>
        </div>
        <div class="col-md-4 col-12 p-3">
          <div class="icon-wrapper">
            <i class="bi bi-clock icon"></i>
          </div>
          <h2 class="mt-3 mb-0 sub-header-font">OPENING HOURS</h2>
          <p v-html="contactPageData.business_hours" class="mt-3 mb-0"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useCampaignStore } from '@/store/campaign';
import { setSubHeaderFontStyles } from '@/utils/buttonStyles';

export default {
  name: 'ContactPage',
  setup() {
    const campaignStore = useCampaignStore();
    const themeData = computed(() => campaignStore.themeData);
    const contactPageData = computed(() => themeData.value?.contact || {});
    onMounted(() => {
      setSubHeaderFontStyles(themeData.value?.general_information);
    });
    return {
      contactPageData,
    };
  },
};
</script>

<style scoped>
.contact-image {
  /* max-height: 500px; */
  object-fit: cover;
}

.icon-wrapper {
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.icon {
  font-size: 48px;
}

@media (max-width: 768px) {
  .box {
    margin: 0 15px;
  }
}
</style>
