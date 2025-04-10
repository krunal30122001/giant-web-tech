<template>
    <div class="container" v-if="themeData">
        <div class="box">
            <div class="header pb-4 header-font">
                <h2 class="m-0">{{ shopPageData.header_text }}</h2>
                <!-- <i class="bi bi-info-circle fs-4" data-bs-toggle="modal" data-bs-target="#infoModal"
                    style="cursor: pointer;"></i> -->
            </div>

            <!-- Modal -->
            <!-- <div class="modal fade" id="infoModal" data-bs-backdrop="true" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg" style="margin-bottom: 100px; margin-top: 130px;">
                    <div class="modal-content modal-dialog-scrollable">
                        <div class="modal-header">
                            <button type="button" class="btn-close shadow-none border-0 no-hover" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">
                            <h2 class="header-font">Brick Package</h2>
                            <p v-html="shopPageData.briks_package_description" class="border-bottom pb-4"></p>
                        </div>
                    </div>
                </div>
            </div> -->

            <div>
                <h4 class="sub-header-font">{{ shopPageData.sub_header_text }}</h4>
                <p>{{ shopPageData.page_title }}</p>
            </div>

            <!-- Product Grid -->
            <div>
                <div v-for="(categoryData, category, categoryIndex) in categorizedProducts" :key="category"
                    class="category-section">
                    <h4 class="category-heading sub-header-font text-center mt-5">{{ category }}</h4>
                    <p class="text-center mb-5">{{ categoryData.packages_description }}</p>
                    <div :class="['row', 'border-dark', { 'border-bottom': categoryIndex !== Object.keys(categorizedProducts).length - 1 }]"
                        :id="`product-grid-${category}`">
                        <div v-for="(product, index) in categoryData.products.filter(p => p.description !== 'DONATION')" 
                            :key="index"
                            class="product-card col-md-4 col-6 p-3 text-center d-flex">
                            <div class="w-100 d-flex flex-column align-items-center text-center h-100">
                                <div class="d-flex flex-column flex-grow-1">
                                    <router-link :to="{ name: 'Product', params: { id: product.item_id } }"
                                        class="text-decoration-none text-dark mt-auto">
                                        <img :src="getProductImage(product)" class="img-fluid"
                                            :alt="product.description" />
                                        <p class="mt-3 mb-0">{{ product.description }}</p>
                                        <p class="fw-bold">{{ formatPrice(product.price) }}</p>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useCampaignStore } from '@/store/campaign';
import { setHeaderFontStyles, setSubHeaderFontStyles } from '@/utils/buttonStyles';

export default {
    name: 'ShopPage',
    setup() {
        const campaignStore = useCampaignStore();
        const themeData = computed(() => campaignStore.themeData);
        const shopPageData = computed(() => campaignStore.shopPageData);
        const productData = computed(() => campaignStore.productData);

        function getProductImage(product) {
            return product.item_image_default
                ? `https://vortexforms.com/images/${product.item_image_default}`
                : 'https://placehold.co/200x100';
        }

        function formatPrice(price) {
            return `$${parseFloat(price).toFixed(2)}`;
        }

        const categorizedProducts = computed(() => {
            const categories = {};
            Object.values(productData.value || {}).forEach((product) => {
                const category = product.product_package_type || '';
                if (!categories[category]) {
                    categories[category] = {
                        products: [],
                        packages_description: product.packages_decription_text || '',
                    };
                }
                categories[category].products.push(product);
            });
            return categories;
        });

        onMounted(() => {
            setHeaderFontStyles(themeData.value?.general_information);
            setSubHeaderFontStyles(themeData.value?.general_information);
        });

        return {
            themeData,
            shopPageData,
            productData,
            categorizedProducts,
            getProductImage,
            formatPrice,
        };
    },
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.header i {
    position: absolute;
    right: 0;
}

.product-card {
    transition: transform 0.3s;
}

.product-card:hover {
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .box {
        margin: 0 15px;
    }
}
</style>