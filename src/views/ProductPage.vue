<template>
    <div class="container" v-if="product">
        <div class="box">
            <div class="text-center">
                <h2 class="header-font">{{ productPageData.header_text }}</h2>
                <p>
                    {{ productPageData.page_title }}
                    <strong data-bs-toggle="modal" data-bs-target="#guidelinesModal" class="text-decoration-underline"
                        style="cursor: pointer;">
                        our inscription guidelines
                    </strong>
                </p>
            </div>

            <!-- Modal for Guidelines -->
            <div class="modal fade" id="guidelinesModal" data-bs-backdrop="true" tabindex="-1"
                aria-labelledby="guidelinesModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" style="margin-bottom: 130px; margin-top: 130px;">
                    <div class="modal-content modal-dialog-scrollable">
                        <div class="modal-header">
                            <button type="button" class="btn-close shadow-none border-0 no-hover"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h2 class="text-center header-font">Inscription Guidelines</h2>
                            <p v-html="productPageData.inscription_guidelines_link"></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Information and Form -->
            <div class="row pt-4">
                <div class="col-lg-7 col-12 align-self-center overlay-section">
                    <img :src="selectedProductImage" alt="Product Image" class="img-fluid overlay-image" />
                    <div v-if="isLogoAllowed && product?.description?.toLowerCase().includes('logo')">
                        <div class="overlay-text" :style="{ top: isLogoAllowed ? '70%' : '50%' }">
                            <h2 v-for="n in product?.max_lines" :key="n">
                                <span v-if="brickInscriptionLines[n - 1]">{{ brickInscriptionLines[n - 1] }}</span>
                                <span v-else><br /></span>
                            </h2>
                        </div>
                    </div>
                    <div v-else>
                        <div class="overlay-text">
                            <h2 v-for="n in product?.max_lines" :key="n">
                                <span v-if="brickInscriptionLines[n - 1]">{{ brickInscriptionLines[n - 1] }}</span>
                                <span v-else><br /></span>
                            </h2>
                        </div>
                    </div>
                </div>

                <div class="col-lg-5 col-12 align-self-center">
                    <h5 class="fw-bold pt-3 sub-header-font">{{ product.description }}</h5>
                    <p>{{ formatPrice(product.price) }}</p>
                    <hr>
                    <h5 class="fw-bold sub-header-font">Brick Inscription:</h5>
                    <div class="form">
                        <div v-for="line in product.max_lines" :key="line" class="form-group row pt-2">
                            <div class="col-lg-2 col-12 m-0 pe-0 align-self-center">
                                <label :for="'line' + line">Line {{ line }}:</label>
                            </div>
                            <div class="col-lg-10 col-12 m-0">
                                <input :id="'line' + line" type="text"
                                    class="form-control rounded-0 bg-transparent border-dark"
                                    :maxlength="product.max_characters" v-model="brickInscriptionLines[line - 1]"
                                    @input="setBrickInscriptionLine(line - 1, $event.target.value)" />
                            </div>
                        </div>
                    </div>

                    <p class="pt-4">
                        Need inspiration?
                        <a data-bs-toggle="modal" data-bs-target="#inspirationModal" class="text-dark"
                            style="cursor: pointer;">Click here</a>
                        for inscription examples.
                    </p>
                </div>
            </div>

            <!-- Modal for Inspiration Examples -->
            <div class="modal fade" id="inspirationModal" data-bs-backdrop="true" tabindex="-1"
                aria-labelledby="inspirationModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" style="margin-bottom: 130px; margin-top: 130px;">
                    <div class="modal-content modal-dialog-scrollable">
                        <div class="modal-header">
                            <button type="button" class="btn-close shadow-none border-0 no-hover"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h2 class="text-center header-font">Inscription Examples</h2>
                            <div class="text-center mt-4">
                                <div class="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                                    <div class="col border-bottom border-dark"
                                        v-for="inscription in inscriptionExamples" :key="inscription.inscription_title">
                                        <h4>{{ inscription.inscription_title }}</h4>
                                        <div v-for="product in inscription.value" :key="product.product_name">
                                            <p class="m-0 fw-bold">{{ product.product_name }}</p>
                                            <p v-if="!product.value">No inscription available</p>
                                            <p v-else v-html="formatValue(product.value)"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p class="my-4">{{ productPageData.package_notes }}</p>

            <hr class="mt-4">

            <!-- Location Placement Section -->
            <div v-if="isLocationAllowed && locationOptions && locationOptions.length">
                <h5 class="fw-bold">Placement</h5>
                <div class="row mb-2">
                    <label class="col-md-5">Choose your brick's location in the timeline:</label>
                    <div class="col-md-7">
                        <select class="form-select rounded-0 bg-transparent" :class="errorClass('selectedLocation')"
                            v-model="selectedLocation" @change="clearError('selectedLocation')">
                            <option value="">-- Please select a Placement --</option>
                            <option v-for="location in locationOptions" :key="location.key" :value="location.key">
                                {{ location.name }}
                            </option>
                        </select>
                        <div v-if="errors.selectedLocation" class="text-danger mt-1">{{ errors.selectedLocation }}</div>
                    </div>
                    <div>
                        <a href="https://brickorder.com/pdf/Historical%20Coliseum%20Events%20Per%20Decade.pdf"
                            target="_blank" class="text-dark">
                            View historical Coliseum events per decade.
                        </a>
                    </div>
                </div>
                <hr class="my-4">
            </div>

            <!-- Logo Selection Section -->
            <div v-if="isLogoAllowed && logoOptions && logoOptions.length">
                <h5 class="fw-bold">Select a Logo Option</h5>
                <div class="row mb-2">
                    <label class="col-md-5">Select a preferred logo on your brick:</label>
                    <div class="col-md-7">
                        <select class="form-select rounded-0 bg-transparent" :class="errorClass('selectedOption')"
                            v-model="selectedOption" @change="clearError('selectedOption')">

                            <option value="">-- Please select an option --</option>
                            <option v-for="option in logoOptions" :key="option.item_number" :value="option.item_number">
                                {{ option.brief_descr }}
                            </option>
                        </select>
                        <div v-if="errors.selectedOption" class="text-danger mt-1">{{ errors.selectedOption }}</div>
                    </div>
                </div>
                <hr class="mt-4">
            </div>

            <!-- Additional Items Section -->
            <div>
                <h5 class="fw-bold sub-header-font">Additional Items</h5>
                <p>{{ productPageData.product_additional_items_text }}</p>
                <div class="row">
                    <div v-for="child in product.children" :key="child.item_id"
                        class="product-card col-md-4 col-12 p-3 d-flex">
                        <div class="w-100 d-flex flex-column h-100">
                            <div class="d-flex flex-column flex-grow-1 justify-content-end">
                                <div class="overlay-section">
                                    <img :src="selectedChildProductImage(child)" class="img-fluid overlay-image"
                                        :alt="child.description" />
                                    <!-- <div v-if="isLogoAllowed && logoOptions.length"> -->
                                    <div v-if="isLogoAllowed && product?.description?.toLowerCase().includes('logo')">
                                        <div class="overlay-text" :style="{ top: isLogoAllowed ? '70%' : '50%' }">
                                            <p class="m-0 fw-bold" v-if="child.item_type_description !== 'Display Case'"
                                                v-for="n in product.max_lines" :key="n">
                                                <span v-if="brickInscriptionLines[n - 1]">
                                                    {{ brickInscriptionLines[n - 1] }}
                                                </span>
                                                <span v-else><br /></span>
                                            </p>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="overlay-text">
                                            <p class="m-0 fw-bold" v-if="child.item_type_description !== 'Display Case'"
                                                v-for="n in product.max_lines" :key="n">
                                                <span v-if="brickInscriptionLines[n - 1]">
                                                    {{ brickInscriptionLines[n - 1] }}
                                                </span>
                                                <span v-else><br /></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <p class="mt-3 mb-0">{{ child.description }}</p>
                                <div class="d-flex align-items-center mt-2">
                                    <p class="mb-0">${{ child.price }}</p>
                                    <!-- Separate quantity management for each product -->
                                    <div class="ms-auto d-flex align-items-center">
                                        <i class="bi bi-dash me-2" @click="decreaseQuantity(child.item_id)"
                                            style="cursor: pointer;"></i>
                                        <p class="mb-0">{{ quantities[child.item_id] || 0 }}</p>
                                        <i class="bi bi-plus ms-2" @click="increaseQuantity(child.item_id)"
                                            style="cursor: pointer;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Button Add to cart -->
            <div class="text-end mt-4">
                <button class="btn" @click="addToCart">Add to cart</button>
            </div>
        </div>
    </div>
    <div v-else>Loading...</div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { setButtonStyles, setHeaderFontStyles, setSubHeaderFontStyles } from '@/utils/buttonStyles';
import { useCartStore } from '@/store/cart';
import { useCampaignStore } from '@/store/campaign';

export default {
    name: 'Product',
    setup() {
        const campaignStore = useCampaignStore();
        const cartStore = useCartStore();
        const route = useRoute();

        const selectedOption = ref('');
        const selectedLocation = ref('');
        const errors = ref({});

        const themeData = computed(() => campaignStore.themeData);
        const productPageData = computed(() => campaignStore.productPageData);
        const productData = computed(() => campaignStore.products);
        const productId = ref(route.params.id);

        const product = computed(() => productData.value ? productData.value[productId.value] : null);
        const inscriptionExamples = computed(() => themeData.value ? themeData.value.inscription_examples : []);

        const maxCharacters = product?.value.max_characters;

        const getProductImage = (product) => {
            return product.value?.item_image_blank
                ? `https://vortexforms.com/images/${product.value.item_image_blank}`
                : 'https://placehold.co/200x100';
        };

        const getChildProductImage = (child) => {
            return child.item_image_default
                ? `https://vortexforms.com/images/${child.item_image_default}`
                : 'https://placehold.co/200x100';
        };

        const inscription_uppercase = computed(() => campaignStore.inscriptionText);

        const brickInscriptionLines = ref(new Array(product.value?.max_lines || 3).fill(''));

        const setBrickInscriptionLine = (lineIndex, text) => {
            brickInscriptionLines.value[lineIndex] = inscription_uppercase.value
                ? text.toUpperCase()
                : text.toLowerCase();
        };

        const isLocationAllowed = computed(() => campaignStore.locationpreferenceAllowed);
        const isLogoAllowed = computed(() => campaignStore.multilogoAllowed);

        const locationOptions = computed(() => {
            const locations = product.value?.options?.location_preference?.locations || {};
            return Object.entries(locations).map(([key, value]) => ({
                key,
                name: value
            }));
        });

        const logoOptions = computed(() => {
            const logoData = product.value?.options?.logo;

            if (!logoData) return [];

            if (Array.isArray(logoData)) {
                return logoData.map((logo) => ({
                    brief_descr: logo.brief_descr,
                    item_number: logo.item_number,
                    description: logo.description,
                    item_image_blank: logo.item_image_blank,
                    item_image_default: logo.item_image_default,
                    item_logo_image: logo.item_logo_image,
                }));
            }

            if (typeof logoData === "object") {
                return Object.values(logoData).map((logo) => ({
                    brief_descr: logo.brief_descr,
                    item_number: logo.item_number,
                    description: logo.description,
                    item_image_blank: logo.item_image_blank,
                    item_image_default: logo.item_image_default,
                    item_logo_image: logo.item_logo_image,
                }));
            }

            return [];
        });

        const selectedProductImage = computed(() => {
            const selectedLogo = logoOptions.value.find(
                (logo) => logo.item_number === selectedOption.value
            );
            return selectedLogo?.item_image_blank
                ? selectedLogo.item_image_blank
                : getProductImage(product);
        });

        const selectedChildProductImage = (child) => {
            const selectedLogo = logoOptions.value.find(
                (logo) => logo.item_number === selectedOption.value
            );
            if (selectedLogo && child.item_type_description !== 'Display Case') {
                return selectedLogo.item_image_default;
            }
            return getChildProductImage(child);
        };

        onMounted(() => {
            setButtonStyles(themeData.value?.general_information);
            setHeaderFontStyles(themeData.value?.general_information);
            setSubHeaderFontStyles(themeData.value?.general_information);
        });

        return {
            campaignStore,
            cartStore,
            themeData,
            productPageData,
            productData,
            product,
            maxCharacters,
            inscription_uppercase,
            inscriptionExamples,
            isLocationAllowed,
            isLogoAllowed,
            logoOptions,
            locationOptions,
            selectedOption,
            selectedLocation,
            selectedProductImage,
            selectedChildProductImage,
            brickInscriptionLines,
            errors,
            setBrickInscriptionLine,
        };
    },
    data() {
        return {
            quantities: {},
        };
    },
    methods: {
        formatPrice(price) {
            return `$${parseFloat(price).toFixed(2)}`;
        },
        formatValue(value) {
            return value.replace(/\n/g, '<br>');
        },
        increaseQuantity(itemId) {
            if (!this.quantities[itemId]) {
                this.quantities[itemId] = 0; // Initialize if not already set
            }
            this.quantities[itemId]++; // Increment the quantity
        },
        decreaseQuantity(itemId) {
            if (this.quantities[itemId] && this.quantities[itemId] > 0) {
                this.quantities[itemId]--; // Decrement the quantity
            }
        },
        validateForm() {
            this.errors = {};
            if (this.isLocationAllowed && this.locationOptions.length && !this.selectedLocation) {
                this.errors.selectedLocation = 'Please select a location placement.';
            }
            if (this.isLogoAllowed && this.logoOptions.length && !this.selectedOption) {
                this.errors.selectedOption = 'Please select a logo option.';
            }
            return Object.keys(this.errors).length === 0;
        },
        clearError(field) {
            delete this.errors[field];
        },
        errorClass(field) {
            return this.errors[field] ? 'border-danger shadow bg-danger-subtle' : 'border-dark';
        },
        addToCart() {
            if (!this.validateForm()) {
                return;
            }
            const cartItem = {
                item_id: this.product.item_id, // Use product ID from `this.product`
                options: {
                    location: this.selectedLocation,
                    logo: this.selectedOption,
                },
                gc: false, // Set `gc` flag as false or as required by logic
                logo_image: this.selectedProductImage || null,
                max_characters: this.maxCharacters || null,
                lines: this.brickInscriptionLines.reduce((acc, line, index) => {
                    if (line) acc[index] = line; // Only include non-empty lines
                    return acc;
                }, {}),
                children: this.product.children.reduce((acc, child) => {
                    acc[child.item_id] = this.quantities[child.item_id] || 0;
                    return acc;
                }, {}),
            };
            // console.log("Cart Item Data:", JSON.stringify(cartItem, null, 2));
            console.log("Cart Store Function:", this.cartStore.addItem); // Check if addItem exists

            this.cartStore.addItem(cartItem);
            this.$router.push('/cart');
        },
    },
};
</script>

<style scoped>
input:focus {
    outline: none;
    box-shadow: 0 0 5px 2px rgba(93, 93, 93, 0.5);
}

@media (max-width: 320px) {
    .box {
        margin: 0 15px;
    }

    .overlay-text p {
        font-size: x-small !important;
    }

    .overlay-text h2 {
        font-size: x-small !important;
    }
}

@media (min-width: 321px) and (max-width: 425px) {
    .box {
        margin: 0 15px;
    }

    .overlay-text p {
        font-size: small !important;
    }

    .overlay-text h2 {
        font-size: small !important;
    }
}

@media (min-width: 426px) and (max-width: 575px) {
    .box {
        margin: 0 15px;
    }

    .overlay-text p {
        font-size: medium !important;
    }

    .overlay-text h2 {
        font-size: medium !important;
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    .box {
        margin: 0 15px;
    }

    .brick-packag img {
        width: 50%;
    }

    .overlay-text p {
        font-size: large !important;
    }

    .overlay-text h2 {
        font-size: large !important;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .overlay-text h2 {
        font-size: x-large !important;
    }

    .overlay-text p {
        font-size: xx-small !important;
    }
}

@media (min-width: 992px) and (max-width: 1200px) {
    .overlay-text h2 {
        font-size: x-large !important;
    }

    .overlay-text p {
        font-size: x-small !important;
    }
}

@media (min-width: 1201px) and (max-width: 1400px) {
    .overlay-text h2 {
        font-size: x-large !important;
    }

    .overlay-text p {
        font-size: small !important;
    }
}
</style>