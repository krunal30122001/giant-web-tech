<template>
    <div class="container">
        <div class="box">

            <h1 class="header-font text-center">Shopping Cart</h1>

            <div v-if="cartItems.length">
                <!-- Header -->
                <div class="row m-0 py-2 d-none d-md-flex border-bottom border-dark">
                    <div class="col-md-3 ps-0 fw-medium">PRODUCT</div>
                    <div class="col-md-9">
                        <div class="row">
                            <div class="col-6 ps-2 fw-medium">DESCRIPTION</div>
                            <div class="col-3 text-center fw-medium">QUANTITY</div>
                            <div class="col-3 text-end pe-0 fw-medium">SUBTOTAL</div>
                        </div>
                    </div>
                </div>
                <!-- Product List -->
              
                <div v-for="item in cartItems" :key="item.item_id" class="row pt-3">                   
                    <!-- Product Image -->
                    <div class="col-md-3">
                        <div class="border-bottom border-dark mb-3 py-2 d-block d-md-none fw-medium">PRODUCT</div>
                        <div class="prod-container overlay-section">
                            <img :src="item.logo_image" class="img-fluid w-100 overlay-image" alt="Product">
                            <div v-if="isLogoAllowed && item?.productDescription?.toLowerCase().includes('logo')">
                                <div class="overlay-text" :style="{ top: '75%' }">
                                    <p class="m-0" v-for="n in item.max_lines" :key="n">
                                        <span v-if="item.lines[n - 1]">{{ item.lines[n - 1] }}</span>
                                        <span v-else>&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                            <div v-else>
                                <div class="overlay-text" :style="{ top: '57%' }">
                                    <p class="m-0" v-for="n in item.max_lines" :key="n">
                                        <span v-if="item.lines[n - 1]">{{ item.lines[n - 1] }}</span>
                                        <span v-else>&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Product Details -->
                    <div class="col-md-9">
                        <div class="d-flex border-bottom border-dark mb-3 pt-3 pb-2 d-block d-md-none">
                            <div class="col-sm-6 col-6 custom-title fw-medium">DESCRIPTION</div>
                            <div class="col-sm-3 col-3 text-center custom-title fw-medium">QUANTITY</div>
                            <div class="col-sm-3 col-3 text-end custom-title fw-medium">SUBTOTAL</div>
                        </div>
                   
                        <div class="row mb-2" v-if="item?.item_id != Object.keys(item?.children)[0]">
                            <div class="col-6">
                                <strong>{{ item.productDescription }}</strong><br />
                                Price: {{ formatPrice(item.productPrice) }}
                            </div>
                            <div class="col-3 text-center">
                                <span>{{ item.qty }}</span>
                            </div>
                            <div class="col-3 text-end">
                                <strong>{{ formatPrice(item.qty * item.productPrice) }}</strong>
                            </div>
                        </div>
  
                        <div class="row mb-2" v-for="child in item.childItems" :key="child.itemId">
                            <div class="col-6">
                                <strong>{{ child.itemDescription }}</strong><br />
                                Price: {{ formatPrice(child.itemPrice) }}
                            </div>
                            <div class="col-3 d-flex justify-content-center text-center">
                                <i class="bi bi-dash pe-2" @click="decreaseQuantity(item, child)"
                                    style="cursor: pointer;"></i>
                                <p class="mb-0">{{ child.quantity }}</p>
                                <i class="bi bi-plus ps-2" @click="increaseQuantity(item, child)"
                                    style="cursor: pointer;"></i>
                            </div>
                            <div class="col-3 text-end">
                                <strong>{{ formatPrice(child.quantity * child.itemPrice) }}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Edit and Delete Actions -->
                    <div class="row mb-3 mx-0 py-3 border-bottom border-dark">
                        <div class="col-md-3 col-6 ps-0">
                            <router-link :to="{ name: 'EditInscriptionPage', params: { productId: item.temp_id } }"
                                class="text-dark">
                                Edit Inscription
                            </router-link>
                        </div>
                        <div class="col-md-9 col-6 pe-0 text-end">
                            <a href="#" class="text-dark" data-bs-toggle="modal" data-bs-target="#removeItemModal"
                                @click="openRemoveModal(item.temp_id)" style="cursor: pointer;">
                                <i class="bi bi-trash3 pe-2 text-danger"></i>Delete Item
                            </a>
                        </div>
                    </div>

                    <!-- Modal for Remove Item -->
                    <div class="modal fade" id="removeItemModal" data-bs-backdrop="true" tabindex="-1"
                        aria-labelledby="removeItemModalLabel" aria-hidden="true">

                        <div class="modal-dialog" style="margin-bottom: 130px; margin-top: 130px;">
                            <div class="modal-content modal-dialog-scrollable">
                                <div class="modal-header">
                                    <button type="button" class="btn-close shadow-none border-0 no-hover"
                                        data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <h2 class="text-center header-font">Remove Items</h2>
                                    <p>Are you sure you want to remove this item?</p>
                                    <div class="row">
                                        <div class="col-12 text-end">
                                            <button class="btn me-2" @click.prevent="deleteItem()"
                                                data-bs-dismiss="modal">Remove</button>
                                            <button class="btn" data-bs-dismiss="modal">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Subtotal -->
                <div class="text-end mb-3">
                    <strong class="fs-4">Subtotal: ${{ subTotal }}</strong>
                    <p class="text-muted fst-italic">
                        Discounts, shipping, and tax will be calculated at checkout.
                    </p>
                </div>

                <!-- Additional Information -->
                <div class="mb-3">
                    <div class="row mb-2">
                        <label for="aboutTheProgram" class="col-md-5 mt-3 mt-md-0">How did you hear about the program?</label>
                        <div class="col-md-7 mt-2 mt-md-0">
                            <select id="aboutTheProgram" name="aboutTheProgram"
                                class="form-select rounded-0 bg-transparent" :class="errorClass('selectedOption')"
                                v-model="selectedOption" @change="clearError('selectedOption')">
                                <option value="">-- Please select an option --</option>
                                <option v-for="option in aboutTheProgramOptions" :key="option"
                                    :value="option.toLowerCase()">
                                    {{ option }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label class="col-md-5 mt-3 mt-md-0">I am buying as a:</label>
                        <div class="col-md-7 mt-2 mt-md-0">
                            <div class="row">
                                <!-- First Column -->
                                <div class="col-sm-6">
                                    <div v-if="shoppingCartPages.am_buying_as.length > 0">
                                        <div v-for="(option, index) in firstColumnOptions" :key="option"
                                            class="form-check">
                                            <label class="form-check-label">
                                                <input type="checkbox"
                                                    class="form-check-input rounded-0 bg-transparent border-dark"
                                                    :id="`buying_as_${option.toLowerCase().replace(/\s+/g, '_')}`"
                                                    v-model="selectedBuyingAs" :value="option.toLowerCase()" />
                                                {{ option }}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Second Column -->
                                <div class="col-sm-6">
                                    <div v-if="parsedBuyingOptions.length > 0">
                                        <div v-for="(option, index) in secondColumnOptions" :key="option"
                                            class="form-check">
                                            <label class="form-check-label">
                                                <input type="checkbox"
                                                    class="form-check-input rounded-0 bg-transparent border-dark"
                                                    :id="`buying_as_${option.toLowerCase().replace(/\s+/g, '_')}`"
                                                    v-model="selectedBuyingAs" :value="option.toLowerCase()" />
                                                {{ option }}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- <div class="container"> -->
                    <div class="row mb-3" v-if="additionField && additionField.length > 0">
                        <div v-for="field in additionField" :key="field.id" class="row align-items-center mb-3">
                            <!-- Label -->
                            <label :for="field.label" class="col-md-5 mt-3 mt-md-0">{{ field.label }}</label>

                            <!-- Dropdown -->
                            <div class="col-md-7" v-if="field.type === 'dropdown'">
                                <select v-model="selectedAdditionOption" class="form-control">
                                    <option value="">-- Please select an option --</option>
                                    <option v-for="option in JSON.parse(field.options)" :key="option" :value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <input v-if="selectedAdditionOption === 'Other'" type="text" v-model="otherValue" class="form-control mt-2" />
                            </div>

                            <!-- Checkbox Group -->
                            <div class="col-md-7 d-flex flex-wrap" v-if="field.type === 'checkbox'">
                                <div v-for="option in JSON.parse(field.options)" :key="option" class="form-check me-3">
                                    <input class="form-check-input" type="checkbox" :id="option" :value="option" v-model="selectedCheckboxes" />
                                    <label class="form-check-label col-md-5 mt-3 mt-md-0" :for="option">{{ option }}</label>
                                </div>
                            </div>

                            <!-- Text Input -->
                            <div class="col-md-7" v-if="field.type === 'text'">
                                <input type="text" v-model="otherTextValue" class="form-control" />
                            </div>
                        </div>
                    </div>
                    <!-- </div> -->


                </div>

                <!-- Action Buttons -->
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-12">
                        <router-link class="btn" to="/shop">Continue Shopping</router-link>
                    </div>
                    <div class="col-md-6 col-sm-6 col-12 text-end">
                        <button class="btn" @click="validateAndProceedToCheckout">Check Out</button>
                    </div>
                </div>
            </div>

            <div v-else class="text-center p-4">
                <h3>Your cart is empty.</h3>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useCampaignStore } from '@/store/campaign';
import { useCartStore } from '@/store/cart';
import { setButtonStyles, setHeaderFontStyles } from '@/utils/buttonStyles';
import { useRouter } from 'vue-router';

export default {
    name: 'Cart',
    setup() {
        const campaignStore = useCampaignStore();
        const cartStore = useCartStore();
        const router = useRouter();
        
        const shoppingCartPages = computed(() => campaignStore.shoppingCartPages);
        const isLogoAllowed = computed(() => campaignStore.multilogoAllowed);

        const campaign = computed(() => campaignStore.campaign);
        const campaigname = campaign.value.short_url;
        
        const additionField = computed(() => campaignStore.additionField);
        // Parsed buying options and splitting them into two columns
        const parsedBuyingOptions = computed(() => {
            return shoppingCartPages.value?.am_buying_as || [];
        });

        const aboutTheProgramOptions = computed(() => {
            return shoppingCartPages.value?.about_the_program || [];
        });

        const firstColumnOptions = computed(() => {
            const half = Math.ceil(parsedBuyingOptions.value.length / 2);
            return parsedBuyingOptions.value.slice(0, half);
        });

        const secondColumnOptions = computed(() => {
            const half = Math.ceil(parsedBuyingOptions.value.length / 2);
            return parsedBuyingOptions.value.slice(half);
        });

        const cartItems = computed(() => cartStore.cartItems);
        const subTotal = computed(() => parseFloat(cartStore.subTotal).toFixed(2));

        // Validation and error handling
        const selectedOption = ref('');
        const selectedAdditionOption = ref('');
        const selectedBuyingAs = ref([]);
        const otherTextValue = ref([]);
        const otherValue = ref('');

        const errors = ref({});

        const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

        // Add or remove error for a specific field
        const errorClass = (field) => {
            return errors.value[field] ? 'border-danger shadow bg-danger-subtle' : 'border-dark';
        };

        const clearError = (field) => {
            if (errors.value[field]) {
                delete errors.value[field];
            }
        };
            
        onMounted(() => {
            selectedOption.value = cartStore.marketing.how_you_heard || '';
            selectedBuyingAs.value = cartStore.marketing.buying_as || [];
            selectedAdditionOption.value = cartStore.marketing.addition_options || '';
            otherTextValue.value = cartStore.marketing.unlim_id_number || '';
            otherValue.value = cartStore.marketing.other_value || '';
        });

        const validateAndProceedToCheckout = () => {
            errors.value = {}; // Reset errors
            if (!selectedOption.value) {
                errors.value.selectedOption = 'Please select an option.';
            }

            if (cartItems.value.length === 0) {
                alert('Your cart is empty!');
            } else if (Object.keys(errors.value).length === 0) {
                cartStore.updateMarketingData({
                    how_you_heard: selectedOption.value,
                    buying_as: selectedBuyingAs.value,
                    affiliate_code: "",
                    addition_options: selectedAdditionOption.value,
                    unlim_id_number: otherTextValue.value,
                    other_value : otherValue.value,
                });
                router.push('/checkout'); // Navigate to checkout page
            }
        };

        const increaseQuantity = (item, child) => {
            if (child) {
                cartStore.updateChildQuantity(item.temp_id, child.itemId, (item.children[child.itemId] || 0) + 1);
            } else {
                cartStore.updateItemQuantity(item.temp_id, item.qty + 1);
            }
        };

        const decreaseQuantity = (item, child) => {
    if (child) {
        const currentQty = item.children[child.itemId] || 0;
        
        if (item?.item_id === child?.itemId && currentQty <= 1) {
            return; // Prevent decreasing if they match and qty is 1
        }
        
        cartStore.updateChildQuantity(
            item.temp_id, 
            child.itemId, 
            Math.max(currentQty - 1, 0)
        );
    } else {
        cartStore.updateItemQuantity(
            item.temp_id, 
            Math.max(item.qty - 1, 0)
        );
    }
};
        const itemToRemove = ref(null);
        const openRemoveModal = (temp_id) => {
            itemToRemove.value = temp_id;
        };
        const deleteItem = () => {
            if (itemToRemove.value) {
                cartStore.removeItem(itemToRemove.value);
                itemToRemove.value = null;
            }
        };

        // Initialize styles on mount using campaign data
        const generalInfo = computed(() => campaignStore.generalInfo);
        setButtonStyles(generalInfo.value);
        setHeaderFontStyles(generalInfo.value);

        return {
            shoppingCartPages,
            parsedBuyingOptions,
            firstColumnOptions,
            secondColumnOptions,
            aboutTheProgramOptions,
            cartItems,
            subTotal,
            selectedOption,
            selectedAdditionOption,
            otherTextValue,
            otherValue,
            selectedBuyingAs,
            errors,
            formatPrice,
            errorClass,
            clearError,
            increaseQuantity,
            decreaseQuantity,
            validateAndProceedToCheckout,
            openRemoveModal,
            isLogoAllowed,
            additionField,
            campaigname,
            deleteItem
        };
    },
};
</script>

<style scoped>
.form-check-input:checked[type=checkbox] {
    --bs-form-check-bg-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-x' viewBox='0 0 16 16'%3e%3cpath d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'/%3e%3c/svg%3e");
}

input:focus {
    outline: none;
    box-shadow: none;
}

@media (max-width: 320px) {
    .box {
        margin: 0 15px;
    }

    .overlay-text p {
        font-size: x-small !important;
    }
}

@media (min-width: 321px) and (max-width: 425px) {

    .box {
        margin: 0 15px;
    }

    .custom-title {
        font-size: 12px;
    }

    .overlay-text p {
        font-size: small !important;
    }
}

@media (min-width: 426px) and (max-width: 575px) {
    .box {
        margin: 0 15px;
    }

    .btn {
        margin-top: 10px;
        width: 100%;
    }

    .overlay-text p {
        font-size: large !important;
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    .box {
        margin: 0 15px;
    }

    .overlay-text p {
        font-size: large !important;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .overlay-text p {
        font-size: 7px;
    }
}

@media (min-width: 992px) and (max-width: 1200px) {
    .overlay-text p {
        font-size: x-small !important;
    }
}

@media (min-width: 1201px) and (max-width: 1400px) {
    .overlay-text p {
        font-size: x-small !important;
    }
}

@media (min-width: 1401px) {
    .overlay-text p {
        font-size: small !important;
    }
}
</style>
