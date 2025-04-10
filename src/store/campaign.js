import { defineStore } from "pinia";
import {
  fetchCampaignData,
  uploadStory,
  checkCode,
  fetchPromoCodeData,
} from "@/api/campaignService"; // Adjust the path as needed

export const useCampaignStore = defineStore("campaign", {
  state: () => ({
    campaignData: null,
    isLoading: true,
    isStoryUploading: false,
    discountAmount: 0,
    error: null,
  }),
  actions: {
    async loadCampaignData(campaignId) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await fetchCampaignData(campaignId);
        this.campaignData = data;
      } catch (error) {
        this.error = "Failed to load campaign data";
        console.error("Error in Store:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async uploadStory(formData) {
      this.isStoryUploading = true;
      this.error = null;
      try {
        const response = await uploadStory(formData);
        return response;
      } catch (error) {
        this.error = "Failed to upload story";
        console.error("Error uploading story:", error);
        throw error;
      } finally {
        this.isStoryUploading = false;
      }
    },    
    async checkCode(code) {      
      this.ischeckCodeUploading = true;
      this.error = null;
      try {
          const response = await checkCode(code);                
          return response;
      } catch (error) {
          this.error = "Failed to check code";
          console.error("Error checking code:", error);
          throw error;
      } finally {
          this.ischeckCodeUploading = false;
      }
    },
    async applyPromoCode(code, campaing_name) {
      try {
        const promoData = await fetchPromoCodeData(code, campaing_name);
        return promoData;
      } catch (error) {
        // console.error('Error applying promo code:', error);
        this.error = "Failed to apply promo code";
        return null;
      }
    },
  },
  getters: {
    campaign: (state) => state.campaignData?.campaign,
    countries: (state) => state.campaignData?.countries,
    states: (state) => state.campaignData?.states,
    themeData: (state) => state.campaignData?.theme,
    homePageData: (state) => state.campaignData?.theme?.home_page,
    aboutPageData: (state) => state.campaignData?.theme?.about_page,
    generalInfo: (state) => state.campaignData?.theme?.general_information,
    shopPageData: (state) => state.campaignData?.theme?.shop_page,
    productPageData: (state) => state.campaignData?.theme?.product_page,
    productData: (state) => Object.values(state.campaignData?.product || {}),
    products: (state) => state.campaignData?.product,
    shoppingCartPages: (state) =>
      state.campaignData?.theme?.shopping_cart_pages,
    inscriptionExamples: (state) =>
      state.campaignData?.theme?.inscription_examples || [],
    contactInfo: (state) => state.campaignData?.theme?.contact || {},
    storiesData: (state) =>
      state.campaignData?.theme?.stories?.stories_data || [],
    faqData: (state) => state.campaignData?.theme?.faq || [],
    termsConditions: (state) =>
      state.campaignData?.theme?.terms_conditions?.terms_conditions || null,
    confirmationPage: (state) =>
      state.campaignData?.theme?.confirmation_page || null,

    locationpreferenceAllowed: (state) => {
      return state.campaignData?.campaign?.options
        ?.is_locationpreference_allowed;
    },
    multilogoAllowed: (state) => {
      return state.campaignData?.campaign?.options?.is_multilogo_allowed;
    },
    inscriptionText: (state) => {
      return (
        state.campaignData?.campaign?.options?.inscription?.is_all_uppercase ||
        false
      );
    },
    convenienceAmount: (state) => {
      const convenienceOptions =
        state.campaignData?.campaign?.options?.convenience;
      return convenienceOptions?.is_allowed ? convenienceOptions?.fee || 0 : 0;
    },

    promocodeAllowed: (state) => {
      return state.campaignData?.campaign?.options?.is_promocode_allowed;
    },
  },
});
