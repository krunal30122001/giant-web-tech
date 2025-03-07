<template>
  <div class="container" v-if="themeData">
      <div class="box">
          <div class="header pb-4 header-font">
              <h2 class="m-0"> Select a Replica</h2>
          </div>
          <div>
              <p style="text-align: center;">If you had a tile at McCovey Cove and are interested in purchasing a replica to match your newly installed brick please select the same size replica as your original tile from the list below. For assistance, please call 1-833-215-4532</p>
          </div>
            
          <!-- Product Grid -->
          <div>
              <div class="border-dark" id="product-grid">
                <div class="row">
                  <div class="col-md-2 d-none d-md-block"></div>

                  <div v-for="product in products" :key="product.id" class="product-card col-md-4 col-6 p-3 text-center d-flex">
                    <div class="w-100 d-flex flex-column align-items-center text-center h-100">
                      <div class="d-flex flex-column flex-grow-1">
                        <a @click.prevent="goToProduct(product.id)" class="text-decoration-none text-dark mt-auto" style="cursor: pointer;">
                          <img :src="product.image" class="img-fluid" :alt="product.name" />
                          <p class="mt-3 mb-0">{{ product.name }}</p>
                          <p class="fw-bold">{{ product.price }}</p>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-2 d-none d-md-block"></div>
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
  name: 'McCovey',
  setup() {
      const campaignStore = useCampaignStore();
      const themeData = computed(() => campaignStore.themeData);
      const shopPageData = computed(() => campaignStore.shopPageData);
      const productData = computed(() => campaignStore.productData);
      console.log(productData.value, "productData")
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
  data() {
  return {
    products: [
      {
        id: 2296,
        name: "4x8 McCovey Brick Replica",
        price: "$95.00",
        image: "https://forms.bricksrus.tech/images/brick-1171275085.png",
      },
      {
        id: 2298,
        name: "8x8 McCovey Brick Replica",
        price: "$135.00",
        image: "https://forms.bricksrus.tech/images/keepsakecertificate12.png",
      },
    ],
  };
},
methods: {
  goToProduct(id) {
    this.$router.push(`/mc-product/${id}`);
  },
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