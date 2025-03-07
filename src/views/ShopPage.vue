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
                <h4 style="text-align: center;" class="sub-header-font">{{ shopPageData.sub_header_text }}</h4>
                <p style="text-align: center;">{{ shopPageData.page_title }}</p>
            </div>

            	
            <!-- Product Grid -->
            <div>
                <div v-for="(categoryData, category, categoryIndex) in categorizedProducts" :key="category" class="category-section">
                    <h4 class="category-heading sub-header-font text-center mt-5">{{ category }}</h4>
                    <p class="text-center mb-5">{{ categoryData.packages_description }}</p>
                    <div :class="['border-dark', { 'border-bottom': categoryIndex !== Object.keys(categorizedProducts).length - 1 }]" :id="`product-grid-${category}`">
                        <!-- Group products into rows of 4 -->
                        <div v-for="(productGroup, groupIndex) in getProductGroups(categoryData.products)" :key="groupIndex" class="row">
                            <!-- Blank div (col-md-2) -->
                            <div class="col-md-2 d-none d-md-block"></div>
                            
                            <!-- First product (col-md-4) -->
                            <div v-if="productGroup[0]" class="product-card col-md-4 col-6 p-3 text-center d-flex">
                                <div class="w-100 d-flex flex-column align-items-center text-center h-100">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <router-link :to="{ name: 'Product', params: { id: productGroup[0].item_id } }" class="text-decoration-none text-dark mt-auto">
                                            <img :src="getProductImage(productGroup[0])" class="img-fluid" :alt="productGroup[0].description" />
                                            <p class="mt-3 mb-0">{{ productGroup[0].description }}</p>
                                            <p class="fw-bold">{{ formatPrice(productGroup[0].price) }}</p>
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Second product (col-md-4) -->
                            <div v-if="productGroup[1]" class="product-card col-md-4 col-6 p-3 text-center d-flex">
                                <div class="w-100 d-flex flex-column align-items-center text-center h-100">
                                    <div class="d-flex flex-column flex-grow-1">
                                        <router-link :to="{ name: 'Product', params: { id: productGroup[1].item_id } }" class="text-decoration-none text-dark mt-auto">
                                            <img :src="getProductImage(productGroup[1])" class="img-fluid" :alt="productGroup[1].description" />
                                            <p class="mt-3 mb-0">{{ productGroup[1].description }}</p>
                                            <p class="fw-bold">{{ formatPrice(productGroup[1].price) }}</p>
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Blank div (col-md-2) -->
                            <div class="col-md-2 d-none d-md-block"></div>
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
                ? `https://forms.bricksrus.tech/images/${product.item_image_default}`
                : 'https://placehold.co/200x100';
        }

        function formatPrice(price) {
            return `$${parseFloat(price).toFixed(2)}`;
        }

        // Group products into arrays of 2 for the layout (since we now have 2 products per row)
        function getProductGroups(products) {
            const groups = [];
            for (let i = 0; i < products.length; i += 2) {
                groups.push(products.slice(i, i + 2));
            }
            return groups;
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
            getProductGroups
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