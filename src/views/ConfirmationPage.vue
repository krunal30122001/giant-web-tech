<template>
    <div class="container" v-if="storiesData">
        <div class="box">        
                <h2 class="text-center text-uppercase header-font">Share Your Story</h2>

                <form @submit.prevent="StoryForm" method="post" action="#">
                    <div class="form-group row pt-2">
                        <div class="col-lg-3 col-12 m-0 align-self-center">
                            <label class="fw-bold"><span class="text-danger">*</span> First Name</label>
                            <input v-model="formData.first_name" id="form_first_name" type="text" name="first_name"
                                :class="['form-control', 'rounded-0', 'bg-transparent', errorClass('first_name')]"
                                placeholder="First Name" @input="clearError('first_name')" />
                            <p class="error-m mt-1" v-if="errors.first_name">{{ errors.first_name }}</p>

                            <label class="mt-2 fw-bold"><span class="text-danger">*</span> Last Name</label>
                            <input v-model="formData.last_name" id="form_last_name" type="text" name="last_name"
                                :class="['form-control', 'rounded-0', 'bg-transparent', errorClass('last_name')]"
                                placeholder="Last Name" @input="clearError('last_name')" />
                            <p class="error-m mt-1" v-if="errors.last_name">{{ errors.last_name }}</p>

                            <label class="mt-2 fw-bold"><span class="text-danger">*</span> Phone Number</label>
                            <input v-model="formData.phone" id="phone" type="text" name="phone"
                                :class="['form-control', 'rounded-0', 'bg-transparent', errorClass('phone')]"
                                placeholder="Phone Number" @input="formatPhoneNumber" maxlength="14" />
                            <p class="error-m mt-1" v-if="errors.phone">{{ errors.phone }}</p>

                            <label class="mt-2 fw-bold"><span class="text-danger">*</span> Email Address</label>
                            <input v-model="formData.email" id="form_email" type="email" name="email"
                                :class="['form-control', 'rounded-0', 'bg-transparent', errorClass('email')]"
                                placeholder="Email Address" @input="clearError('email')" />
                            <p class="error-m mt-1" v-if="errors.email">{{ errors.email }}</p>

                        </div>
                        <div class="story-text col-lg-9 col-12 m-0">
                            <label class="fw-bold"> {{ storiesData.story_1_header }}</label>
                            <textarea v-model="formData.description" id="form_description" name="description"
                                :class="['form-control', 'rounded-0', 'bg-transparent', errorClass('description')]" rows="8"
                                placeholder="Enter your story here. Share with us the meaning behind your inscription, why you bought your paver, or what this program means to you. Your stories and photos can become a part of history that will never be forgotten!"
                                @input="clearError('description')"></textarea>
                            <p class="error-m mt-1" v-if="errors.description">{{ errors.description }}</p>
                        </div>
                    </div>
                    <p class="fw-bold mt-2 text-danger">* Item is required in order to save your story</p>
                    <p class="mt-3">{{ storiesData.share_disclaimer }}</p>

                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-12">
                            <button type="button" class="btn" @click="openFileDialog" tabindex="0">Upload Photo</button>
                            <input ref="fileInput" type="file" id="customFile" @change="handleFileUpload"
                                accept=".png, .jpg, .gif" style="display: none;" />
                            <label class="custom-file-label ps-2 pb-3 text-break" for="customFile">
                                {{ fileName }}
                            </label>
                            <p class="error-m mt-1" v-if="errors.image">{{ errors.image }}</p>
                        </div>

                        <div class="col-md-6 col-sm-6 col-12 text-end">
                            <button type="submit" class="btn" :disabled="isStoryUploading">
                                <span v-if="isStoryUploading" class="spinner-border spinner-border-sm" role="status"
                                    aria-hidden="true"></span>
                                <span v-if="!isStoryUploading">Submit Story</span>
                                <span v-if="isStoryUploading" class="ps-2">Loading...</span>
                                <span class="circle"></span>
                            </button>
                            <p v-if="visible" :class="{ 'text-success': !isError, 'text-danger': isError }">
                                {{ statusMessage }}
                            </p>
                        </div>
                    </div>
                </form>

                <hr class="mt-4">            
            <div v-if="displayCartItems.length" class="printable-receipt">
                <h2 class="header-font">Order Summary</h2>
                <!-- Header -->
                <div class="row m-0 py-2 d-none d-md-flex border-bottom border-dark">
                    <div class="col-md-3 ps-0 fw-medium">Product</div>
                    <div class="col-md-9">
                        <div class="row">
                            <div class="col-1 ps-0 fw-medium">Qty</div>
                            <div class="col-5 ps-2 fw-medium">Description</div>
                            <div class="col-6 pe-0 fw-medium">Shipping Address (If Applicable)</div>
                        </div>
                    </div>
                </div>
            
                <!-- Product List -->
                <div v-for="item in displayCartItems" :key="item.item_id" class="row pt-3">
                    <div class="col-md-3">
                        <div class="border-bottom border-dark mb-3 py-2 d-block d-md-none fw-medium">Product</div>
                        <div class="prod-container overlay-section">
                            <img :src="item.logo_image" class="img-fluid w-100 overlay-image bg-transparent" alt="Product">
                            <div v-if="isLogoAllowed && item?.productDescription?.toLowerCase().includes('logo')">
                                <div class="overlay-text" :style="{ top: '70%' }">
                                    <p class="m-0" :class="{ 'is-max': item?.max_characters > 16 }" v-for="n in item.max_lines" :key="n">
                                        <span v-if="item.lines?.[n - 1]">{{ item.lines[n - 1] }}</span>
                                        <span v-else>&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                            <div v-else>
                                <div class="overlay-text" :style="{ top: '50%' }">
                                    <p class="m-0" :class="{ 'is-max': item?.max_characters > 16 }" v-for="n in item.max_lines" :key="n">
                                        <span v-if="item.lines?.[n - 1]">{{ item.lines[n - 1] }}</span>
                                        <span v-else>&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Product Details -->
                    <div class="col-md-9">
                        <div class="d-flex border-bottom border-dark mb-3 pt-3 pb-2 d-block d-md-none">
                            <div class="col-sm-1 col-1 custom-title fw-medium">Qty</div>
                            <div class="col-sm-5 col-5 custom-title fw-medium">Description</div>
                            <div class="col-sm-6 col-6 custom-title fw-medium">Shipping Address (If Applicable)</div>
                        </div>

                        <div class="row mb-2">
                            <div class="col-1">
                                <strong>{{ item.qty || 1 }}</strong>
                            </div>
                            <div class="col-5">
                                <span>{{ item.productDescription?.replace(/\s+Package$/, '') }}</span>
                            </div>
                            <div class="col-6">
                                <div v-if="item.keepsakeCerts?.length > 0">
                                    <div class="row mb-2" v-for="ksCert in item.keepsakeCerts" :key="ksCert.itemId">
                                        <span>{{ ksCert.selectedShippingAddress ? formatAddress(getAddressById(ksCert.selectedShippingAddress)) : '' }}</span>
                                    </div>
                                </div>
                                <span v-else></span>
                            </div>
                        </div>

                        <div v-if="item.partItems?.length > 0">
                            <div class="row mb-2" v-for="partItem in item.partItems" :key="partItem.itemId">
                                <div class="col-1">
                                    <strong>{{ partItem.quantity || 1 }}</strong>
                                </div>
                                <div class="col-5">
                                    <span>{{ partItem.itemDescription }}</span>
                                </div>
                                <div class="col-6">
                                    <span>{{ partItem.selectedShippingAddress ? formatAddress(getAddressById(partItem.selectedShippingAddress)) : '' }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="item.keepsakeCerts?.length > 0">
                            <div class="row mb-2" v-for="ksCert in item.keepsakeCerts" :key="ksCert.itemId">
                                <div class="col-1">
                                    <strong>{{ ksCert.quantity || 1 }}</strong>
                                </div>
                                <div class="col-5">
                                    <span>{{ ksCert.itemDescription }}</span>
                                </div>
                                <div class="col-6">
                                    <span>{{ ksCert.selectedShippingAddress ? formatAddress(getAddressById(ksCert.selectedShippingAddress)) : '' }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="item.childItems?.length > 0">
                            <template v-for="child in quantityWiseChildItems(item.childItems)" :key="child.key">
                                <div class="row mb-2">
                                    <div class="col-1">
                                        <strong>{{ child.quantity }}</strong>
                                    </div>
                                    <div class="col-5">
                                        <span>{{ child.itemDescription }}</span>
                                    </div>
                                    <div class="col-6">
                                        <template v-if="child.selectedShippingAddress?.length > 0">
                                            {{ formatAddress(getMulAddressById([child.selectedShippingAddress[getNumberAfterDash(child.key)]])) || '' }}
                                        </template>
                                        <span v-else>{{ item.childItems?.[0]?.selectedShippingAddress ? formatAddress(getAddressById(item.childItems[0].selectedShippingAddress)) : '' }}</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                
                <hr>
                <!-- Price Breakdown Section -->
                <table class="table text-end my-3 ">
                    <tbody>
                        <tr>
                            <th class="col-md-11 m-0 p-0" scope="row">Subtotal: $</th>
                            <td class="col-md-1 m-0 p-0">{{ displaySubTotal.toFixed(2) }}</td>
                        </tr>
                        <tr v-if="displayDiscountAmount > 0">
                            <th class="col-md-11 m-0 p-0" scope="row">Promotional Discount: $</th>
                            <td class="col-md-1 m-0 p-0">{{ displayDiscountAmount }}</td>
                        </tr>
                        <tr>
                            <th class="col-md-11 m-0 p-0" scope="row">Convenience Fee: $</th>
                            <td class="col-md-1 m-0 p-0">{{ displayConvenienceAmount.toFixed(2) }}</td>
                        </tr>
                        <tr>
                            <th class="col-md-11 m-0 p-0" scope="row">Sales Tax: $</th>
                            <td class="col-md-1 m-0 p-0">{{ formatPrice(displaySalesTaxAmount) }}</td>
                        </tr>
                        <tr>
                            <th class="col-md-11 m-0 p-0 fw-bold" scope="row">Order Total: $</th>
                            <td class="col-md-1 m-0 p-0 fw-bold">{{ formatPrice(displayFinalTotal) }}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="fw-bold" v-html="confirmationData.order_confirmation_text"></p>
            </div>
            <button type="button" class="btn" onclick="window.print();">Print Receipt</button>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch ,nextTick} from 'vue';
import { useCampaignStore } from '@/store/campaign';
import { useCartStore } from '@/store/cart';
import { useAddressStore } from '@/store/address';
import { setButtonStyles, setHeaderFontStyles, setSubHeaderFontStyles } from '@/utils/buttonStyles';
import { useRouter } from 'vue-router';

export default {
    name: 'ConfirmationPage',
    setup() {
        const router = useRouter();
        const cartStore = useCartStore();
        const campaignStore = useCampaignStore();
        const themeData = computed(() => campaignStore.themeData);
        const storiesData = computed(() => themeData.value?.stories || {});
        const campaign = computed(() => campaignStore.campaign);
        const isLogoAllowed = computed(() => campaignStore.multilogoAllowed);
        const addressStore = useAddressStore();
        const isStoryUploading = computed(() => campaignStore.isStoryUploading);
        const confirmationData = computed(() => campaignStore.confirmationPage);
        
        // New variables to hold copies of cart items and totals for display
        const displayCartItems = ref([]);
        const displaySubTotal = ref(0);
        const displayDiscountAmount = ref(0);
        const displayConvenienceAmount = ref(0);
        const displaySalesTaxAmount = ref(0);
        const displayFinalTotal = ref(0);

        const formData = ref({
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            description: '',
        });

        const selectedFile = ref(null);
        const fileName = ref('');
        const statusMessage = ref('');
        const isError = ref(false);
        const visible = ref(false);
        const errors = ref({});

        const formatPrice = (price) => `${parseFloat(price).toFixed(2)}`;

        onMounted(() => {
            setButtonStyles(themeData.value?.general_information);
            setHeaderFontStyles(themeData.value?.general_information);
            setSubHeaderFontStyles(themeData.value?.general_information);

            // Copy cart items and totals for display before clearing the cart
            displayCartItems.value = [...cartStore.cartItems];
            
            watch(displayCartItems, (newCartItems) => {
                if (newCartItems.length === 0) {
                    router.push('/shop');
                }
            }, { immediate: true });
            displaySubTotal.value = cartStore.subTotal;
            displayDiscountAmount.value = cartStore.discountAmount;
            displayConvenienceAmount.value = campaignStore.convenienceAmount;
            displaySalesTaxAmount.value = addressStore.getSalesTaxAmount;       
            displayFinalTotal.value = displaySubTotal.value + displayConvenienceAmount.value + displaySalesTaxAmount.value - displayDiscountAmount.value;

            // Clear the cart after copying values
            cartStore.clearCart();
        });

        function openFileDialog() {
            document.querySelector('#customFile').click();
        }

        function handleFileUpload(event) {
            selectedFile.value = event.target.files[0];
            fileName.value = selectedFile.value ? selectedFile.value.name : 'Choose file';

            if (selectedFile.value) {
                clearError('image');
            }
        }

        function clearForm() {
            formData.value = {
                first_name: '',
                last_name: '',
                phone: '',
                email: '',
                description: '',
            };
            selectedFile.value = null;
            fileName.value = 'Choose file';
        }

        function showMessage(message, isErrorFlag) {
            statusMessage.value = message;
            isError.value = isErrorFlag;
            visible.value = true;

            setTimeout(() => {
                visible.value = false;
            }, 5000);
        }

        function validateForm() {
            errors.value = {};

            // Validate First Name
            if (!formData.value.first_name) {
                errors.value.first_name = 'First Name is required';
            } else if (!/^(?=.*[a-zA-Z])[a-zA-Z\s]+$/.test(formData.value.first_name)) {
                errors.value.first_name = 'First Name can contain only letters and spaces';
            }

            // Validate Last Name
            if (!formData.value.last_name) {
                errors.value.last_name = 'Last Name is required';
            } else if (!/^(?=.*[a-zA-Z])[a-zA-Z\s]+$/.test(formData.value.last_name)) {
                errors.value.last_name = 'Last Name can contain only letters and spaces';
            }

            // Validate Phone Number
            const cleanedPhone = cleanPhoneNumber(formData.value.phone);
            if (!cleanedPhone) {
                errors.value.phone = 'Phone number is required';
            } else if (cleanedPhone.length < 9) {
                errors.value.phone = 'Phone number must be at least 9 digits.';
            }

            // Validate Email Address
            if (!formData.value.email) {
                errors.value.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
                errors.value.email = 'Please enter a valid email address';
            }

            // Validate Description
            if (!formData.value.description) {
                errors.value.description = 'Description is required';
            } else if (formData.value.description.trim().length < 5) {
                errors.value.description = 'Description must be at least 5 characters long';
            }

            // Validate File Upload
            // if (!selectedFile.value) {
            //     errors.value.image = 'Please upload an image';
            // }

            // Return true if no errors, otherwise false
            return Object.keys(errors.value).length === 0;
        }

        // Format Phone Number (U.S. format) with Smooth Backspace Support
        function formatPhoneNumber() {
            let cleanedPhone = cleanPhoneNumber(formData.value.phone);
            let formattedPhone = '';

            // Allow full erasure
            if (cleanedPhone.length === 0) {
                formData.value.phone = '';
                return;
            }

            // Ensure only 10 digits are considered
            cleanedPhone = cleanedPhone.slice(0, 10);

            // Apply formatting as user types
            if (cleanedPhone.length > 0) formattedPhone += '(' + cleanedPhone.slice(0, 3);
            if (cleanedPhone.length > 3) formattedPhone += ') ' + cleanedPhone.slice(3, 6);
            if (cleanedPhone.length > 6) formattedPhone += '-' + cleanedPhone.slice(6);

            formData.value.phone = formattedPhone;

            validatePhoneNumber();
        }

        // Validate Phone Number (U.S. 10-Digit Format)
        function validatePhoneNumber() {
            const cleanedPhone = cleanPhoneNumber(formData.value.phone);

            if (!cleanedPhone) {
                errors.value.phone = 'Phone number is required';
            } else if (cleanedPhone.length !== 10) {
                errors.value.phone = 'Phone number must be exactly 10 digits';
            } else {
                errors.value.phone = '';
            }
        }

        // Helper Function to Remove Non-Numeric Characters
        function cleanPhoneNumber(phone) {
            return phone.replace(/\D/g, ''); // Remove all non-numeric characters
        }
       
        const getNumberAfterDash = (key) => {
        const parts = key.split('-');
        return parts.length > 1 ? parseInt(parts[1], 10) -1  : NaN; // Return NaN if there's no value after the dash
        }

        function clearError(field) {
            errors.value[field] = '';
        }

        function errorClass(field) {
            return errors.value[field] ? 'border-danger shadow bg-danger-subtle' : 'border-dark';
        }

        async function StoryForm() {
            if (validateForm()) {

                const formDataObj = new FormData();
                Object.entries(formData.value).forEach(([key, value]) => {
                    formDataObj.append(key, value);
                });
                if (selectedFile.value) {
                    formDataObj.append('image', selectedFile.value);
                }
                formDataObj.append('campaign', campaign.value.short_url);

                try {
                    const response = await campaignStore.uploadStory(formDataObj);
                    if (response.success) {
                        showMessage(response.message || 'Story submitted successfully!', false);
                        clearForm();
                    } else {
                        showMessage(response.message || 'Failed to submit the story.', true);
                    }
                } catch (error) {
                    console.error('Error submitting the form:', error);
                    showMessage('An error occurred while submitting the story. Please try again later.', true);
                }
            }
        }

        const quantityWiseChildItems = (childItems) => {
            const expandedItems = [];
            childItems.forEach((child) => {
                for (let i = 1; i <= child.quantity; i++) {
                    expandedItems.push({
                        key: `${child.itemId}-${i}`,
                        itemDescription: child.itemDescription,
                        selectedShippingAddress: child.selectedShippingAddress,
                        quantity: 1,
                    });
                }
            });
            return expandedItems;
        };

        const addressList = computed(() => addressStore.addresses);

        const getAddressById = (addressId) => {
            return addressList.value.find((address) => address.id === addressId) || null;
        };

        const getMulAddressById = (addressId) => {
            return addressList.value.find((address) => address.id === addressId[0]) || null;
        };

        const formatAddress = (address) => {
            if (!address) return null;
            return [
                [address.first_name, address.middle_name, address.last_name].filter(Boolean).join(' '),
                address.address1,
                address.city,
                address.state,
                address.country,
                address.postal_code,
            ]
                .filter(Boolean)
                .join(', ');
        };

        // Assign dynamic labels for each address
        const getAddressLabel = (index) => (index === 0 ? "billing" : "shipping");

        return {
            confirmationData,
            storiesData,
            isStoryUploading,
            formData,
            selectedFile,
            fileName,
            statusMessage,
            isError,
            visible,
            errors,
            showMessage,
            openFileDialog,
            handleFileUpload,
            clearError,
            errorClass,
            StoryForm,
            isLogoAllowed,
            displayCartItems,
            displaySubTotal,
            displayDiscountAmount,
            displayConvenienceAmount,
            displaySalesTaxAmount,
            displayFinalTotal,
            formatPrice,
            formatPhoneNumber,
            quantityWiseChildItems,
            getAddressById,
            formatAddress,
            getAddressLabel,
            getNumberAfterDash, 
            addressList,
            getMulAddressById
        };

    },
};
</script>

<style scoped>
@media print {
    body * {
        visibility: hidden !important;         
        background: none !important;   
        padding: 0px !important;
        margin: 0px !important;
    }
   
    .printable-receipt,
    .printable-receipt * {
        visibility: visible !important;
    }

    .printable-receipt { 
        position: absolute !important; 
        left: 0px !important;
        top: 0px !important;
        bottom: 0px !important;
        padding: 0px !important;
        margin: 0px !important;
    }
}

.form-control {
    font-size: 15px;
}

input:focus,
textarea:focus {
    outline: none;
    box-shadow: 0 0 5px 2px rgba(93, 93, 93, 0.5);
}

tr {
    border-color: transparent;
}

table {
    --bs-table-bg: transparent !important;
}

@media (max-width: 320px) {
    .box {
        margin: 0 15px;
    }

    .overlay-text p {
        font-size: x-small !important;
    }
    .overlay-text p.is-max {
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
    .overlay-text p.is-max {
    font-size: small !important;
  }
}

@media (min-width: 426px) and (max-width: 575px) {
    .box {
        margin: 0 15px;
    }

    .btn {
        width: 100%;
    }

    .overlay-text p {
        font-size: large !important;
    }
    .overlay-text p.is-max {
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
    .overlay-text p.is-max {
    font-size: large !important;
  }
}

@media (min-width: 768px) and (max-width: 991px) {

    .box {
        margin: 0 15px;
    }

    .story-text {
        padding-top: 8px !important;
    }

    .overlay-text p {
        font-size: 6px !important;
    }
    .overlay-text p.is-max {
    font-size: 6px !important;
  }
}

@media (min-width: 992px) and (max-width: 1200px) {

    .overlay-text p {
        font-size: xx-small !important;
    }
    .overlay-text p.is-max {
    font-size: xx-small !important;
  }
}

@media (min-width: 1201px) and (max-width: 1400px) {
    .overlay-text p {
        font-size: x-small !important;
    }
    .overlay-text p.is-max {
    font-size: small !important;
  }
}

@media (min-width: 1401px) {
    .overlay-text p {
        font-size: small !important;
    }
    .overlay-text p.is-max {
    font-size: small !important;
  }
}
</style>