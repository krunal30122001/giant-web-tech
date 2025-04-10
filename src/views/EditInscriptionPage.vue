<template>
    <div class="container">
        <div class="box">
            <div class="text-center">
                <h2 class="header-font">{{ productPageData.header_text }}</h2>
                <p>{{ productPageData.page_title }}
                    <strong data-bs-toggle="modal" data-bs-target="#guidelinesModal" class="text-decoration-underline"
                        style="cursor: pointer;">our inscription guidelines</strong>
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
            <div v-if="cartItem" class="row pt-4">
                <div class="col-lg-7 col-12 align-self-center overlay-section">
                    <!-- Product Image -->
                    <img :src="selectedProductImage" alt="Product Image" class="img-fluid overlay-image" />
                    <!-- Inscription Text -->
                    <div v-if="isLogoAllowed && product?.description?.toLowerCase().includes('logo')">
                        <div class="overlay-text" :style="{ top: '70%' }">
                            <h2 v-for="n in cartItem?.max_lines" :key="n">
                                <span v-if="lines[n - 1]">{{ lines[n - 1] }}</span>
                                <span v-else><br /></span>
                            </h2>
                        </div>
                    </div>
                    <div v-else>
                        <div class="overlay-text" :style="{ top: '50%' }">
                            <h2 v-for="n in cartItem?.max_lines" :key="n">
                                <span v-if="lines[n - 1]">{{ lines[n - 1] }}</span>
                                <span v-else><br /></span>
                            </h2>
                        </div>
                    </div>
                </div>
                <!-- Product Details and Editing Form -->
                <div class="col-lg-5 col-12 align-self-center">
                    <h5 class="fw-bold pt-3 sub-header-font">{{ product?.description || 'Product Description' }}</h5>
                    <p>${{ product?.price || '0.00' }}</p>
                    <hr>
                    <h5 class="fw-bold sub-header-font">Brick Inscription:</h5>
                    <div class="form">
                        <!-- Inscription Lines -->
                        <div class="form-group row pt-2" v-for="lineIndex in maxLines" :key="'line-' + lineIndex">
                            <div class="col-lg-2 col-12 m-0 pe-0 align-self-center">
                                <label :for="'line-' + lineIndex">Line {{ lineIndex }}:</label>
                            </div>
                            <div class="col-lg-10 col-12 m-0">
                                <input type="text" class="form-control rounded-0 bg-transparent border-dark"
                                    :maxlength="cartItem.max_characters" v-model="lines[lineIndex - 1]"
                                    :id="'line-' + lineIndex" @input="setLine(lineIndex - 1, $event.target.value)" />
                            </div>
                        </div>
                    </div>

                    <!-- Need Inspiration Link -->
                    <p class="pt-4">
                        Need inspiration?
                        <a data-bs-toggle="modal" data-bs-target="#inspirationModal" class="text-dark"
                            style="cursor: pointer;">Click here</a>
                        for inscription examples.
                    </p>

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
                                                v-for="inscription in inscriptionExamples"
                                                :key="inscription.inscription_title">
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
                </div>

                <p class="my-4">{{ productPageData.package_notes }}</p>
                <div>
                    <!-- Location Selection -->
                    <div v-if="isLocationAllowed && locationOptions.length">
                        <hr class="my-4">
                        <h5 class="fw-bold">Placement</h5>
                        <div class="row mb-2">
                            <label class="col-md-5">Choose your brick's location:</label>
                            <div class="col-md-7">
                                <select class="form-select rounded-0 bg-transparent"
                                    :class="errorClass('selectedLocation')" v-model="selectedLocation"
                                    @change="clearError('selectedLocation')">
                                    <option value="">-- Please select a Placement --</option>
                                    <option v-for="location in locationOptions" :key="location.key"
                                        :value="location.key">
                                        {{ location.name }}
                                    </option>
                                </select>
                                <div v-if="errors.selectedLocation" class="text-danger mt-1">
                                    {{ errors.selectedLocation }}
                                </div>
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

                    <!-- Logo Selection -->
                    <div v-if="isLogoAllowed && logoOptions.length">
                        <h5 class="fw-bold">Select a Logo Option</h5>
                        <div class="row mb-5">
                            <label class="col-md-5">Select a logo:</label>
                            <div class="col-md-7">
                                <select class="form-select rounded-0 bg-transparent"
                                    :class="errorClass('selectedOption')" v-model="selectedOption"
                                    @change="clearError('selectedOption')">
                                    <option value="">-- Please select an option --</option>
                                    <option v-for="option in logoOptions" :key="option.item_number"
                                        :value="option.item_number">
                                        {{ option.brief_descr }}
                                    </option>
                                </select>
                                <div v-if="errors.selectedOption" class="text-danger mt-1">
                                    {{ errors.selectedOption }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Save and Cancel Buttons -->
                    <div class="text-end">
                        <button class="btn me-3" @click="saveChanges">Save</button>
                        <button class="btn" @click="cancelChanges">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/store/cart';
import { useCampaignStore } from '@/store/campaign';
import { setButtonStyles, setHeaderFontStyles, setSubHeaderFontStyles } from '@/utils/buttonStyles';

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const cartStore = useCartStore();
        const campaignStore = useCampaignStore();
        const themeData = computed(() => campaignStore.themeData);

        const generalInfo = computed(() => campaignStore.generalInfo);
        setButtonStyles(generalInfo.value);
        setHeaderFontStyles(generalInfo.value);
        setSubHeaderFontStyles(generalInfo.value);

        const temp_id = parseInt(route.params.productId);

        const cartItem = computed(() =>
            cartStore.cartItems.find((item) => item.temp_id === temp_id)
        );

        const productData = computed(() => campaignStore.products);
        const product = computed(() =>
            productData.value ? productData.value[cartItem.value?.item_id] : null
        );

        const inscriptionExamples = computed(() => themeData.value ? themeData.value.inscription_examples : []);

        const maxLines = ref(cartItem.value?.max_lines || 3);
        const lines = ref(Array.from({ length: maxLines.value }, (_, index) => cartItem.value?.lines?.[index] || ''));

        const productPageData = computed(() => campaignStore.productPageData);

        const inscription_uppercase = computed(() => campaignStore.inscriptionText);

        const setLine = (lineIndex, text) => {
            lines.value[lineIndex] = inscription_uppercase.value
                ? text.toUpperCase()
                : text.toLowerCase();
        };

        const isLocationAllowed = computed(() => campaignStore.locationpreferenceAllowed);
        const isLogoAllowed = computed(() => campaignStore.multilogoAllowed);

        const locationOptions = computed(() => {
            return Object.entries(product.value?.options?.location_preference?.locations || {}).map(([key, value]) => ({
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

        const selectedLocation = ref(cartItem.value?.options?.location || '');
        const selectedOption = ref(cartItem.value?.options?.logo || '');
        const selectedProductImage = computed(() => {
            const logo = logoOptions.value.find((l) => l.item_number === selectedOption.value);
            return logo?.item_image_blank || cartItem.value?.logo_image;
        });

        const errors = ref({});
        const errorClass = (field) => (errors.value[field] ? 'border-danger shadow bg-danger-subtle' : 'border-dark');

        const validateForm = () => {
            errors.value = {};

            if (isLocationAllowed.value && locationOptions.value.length && !selectedLocation.value) {
                errors.value.selectedLocation = 'Please select a location placement.';
            }

            if (isLogoAllowed.value && logoOptions.value.length && !selectedOption.value) {
                errors.value.selectedOption = 'Please select a logo option.';
            }

            return Object.keys(errors.value).length === 0;
        };

        const saveChanges = () => {
            if (!validateForm()) {
                return; // Prevent save if there are validation errors
            }
            const updatedData = {
                lines: lines.value,
                options: {
                    location: selectedLocation.value,
                    logo: selectedOption.value,
                },
                logo_image: selectedProductImage.value || null,
            };
            cartStore.updateItem(temp_id, updatedData);
            router.push('/cart');
        };

        const cancelChanges = () => {
            router.push('/cart');
        };

        const clearError = (field) => {
            errors.value[field] = '';
        };

        watch(cartItem, () => {
            if (cartItem.value) {
                lines.value = Array.from({ length: maxLines.value }, (_, index) => cartItem.value?.lines?.[index] || '');
            }
        });

        return {
            cartItem,
            product,
            inscription_uppercase,
            maxLines,
            lines,
            setLine,
            isLocationAllowed,
            isLogoAllowed,
            locationOptions,
            logoOptions,
            selectedLocation,
            selectedOption,
            selectedProductImage,
            errors,
            productPageData,
            inscriptionExamples,
            errorClass,
            clearError,
            saveChanges,
            cancelChanges,
            validateForm,
        };
    },
    methods: {
        formatValue(value) {
            return value.replace(/\n/g, '<br>');
        }
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
    
    .overlay-text h2 {
        font-size: x-small !important;
    }
}

@media (min-width: 321px) and (max-width: 425px) {
    .box {
        margin: 0 15px;
    }

    .overlay-text h2 {
        font-size: small !important;
    }
}

@media (min-width: 426px) and (max-width: 575px) {
    .box {
        margin: 0 15px;
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

    .overlay-text h2 {
        font-size: large !important;
    }
}

@media (min-width: 768px) and (max-width: 991px) {

    .overlay-text h2 {
        font-size: x-large !important;
    }
}

@media (min-width: 992px) and (max-width: 1200px) {
    .overlay-text h2 {
        font-size: large !important;
    }
}

@media (min-width: 1201px) and (max-width: 1400px) {
    .overlay-text h2 {
        font-size: x-large !important;
    }
} 

</style>