<template>
    <div class="container">
        <div class="box">

            <div class="row">
                <!-- Checkout Section -->
                <div class="col-lg-6 col-12 border-end border-dark no-border-end">
                    <h2 class="m-0 header-font">CHECKOUT</h2>
                    <div v-if="cartItems.length">
                        <!-- Header -->
                        <div class="row m-0 py-2 d-none d-sm-flex border-bottom border-dark">
                            <div class="col-sm-4 ps-0 fw-medium custom-title">PRODUCT</div>
                            <div class="col-sm-8">
                                <div class="row">
                                    <div class="col-7 fw-medium custom-title">DESCRIPTION</div>
                                    <div class="col-1 text-center fw-medium custom-title">QTY</div>
                                    <div class="col-4 pe-0 text-end fw-medium custom-title">SUBTOTAL</div>
                                </div>
                            </div>
                        </div>
                        <!-- Product List -->
                        <div v-for="item in cartItems" :key="item.item_id" class="py-4 border-bottom border-dark">                            
                            <div class="row">
                                <div class="col-sm-4">
                                    <div class="border-bottom border-dark mb-3 py-2 d-block d-sm-none fw-medium">PRODUCT
                                    </div>
                                    <div class="prod-container overlay-section">
                                        <img :src="item.logo_image" alt="Product Image"
                                            class="img-fluid w-100 overlay-image">
                                            <div v-if="isLogoAllowed && item?.productDescription?.toLowerCase().includes('logo')">
                                            <div class="overlay-text" :style="{ top: '75%' }">
                                                <p class="m-0" v-for="n in item.max_lines" :key="n">
                                                    <span v-if="item.lines[n - 1]">{{ item.lines[n - 1] }}</span>
                                                    <span v-else>&nbsp;</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="overlay-text" :style="{ top: item.productDescription === '8x8 Additional McCovey Keepsake Brick' ? '60%' : '57%' }">
                                                <p class="m-0" v-for="n in item.max_lines" :key="n">
                                                    <span v-if="item.lines[n - 1]">{{ item.lines[n - 1] }}</span>
                                                    <span v-else>&nbsp;</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-8">
                                    <div class="d-flex border-bottom border-dark mb-3 pt-3 pb-2 d-block d-sm-none">
                                        <div class="col-sm-6 col-6 custom-title fw-medium">DESCRIPTION</div>
                                        <div class="col-sm-3 col-3 text-center custom-title fw-medium">QTY</div>
                                        <div class="col-sm-3 col-3 text-end custom-title fw-medium">SUBTOTAL</div>
                                    </div>
                                    <div class="row" v-if="item?.item_id != Object.keys(item?.children)[0]">
                                        <div class="col-7">{{ item.productDescription }}</div>
                                        <div class="col-1 text-center">{{ item.qty }}</div>
                                        <div class="col-4 text-end">{{ formatPrice(item.productPrice) }}</div>
                                    </div>
                                    <div class="row"
                                        v-for="child in item.childItems.filter(child => child.quantity > 0)"
                                        :key="child.itemId">
                                        <!-- <div class="row" v-for="child in item.childItems" :key="child.itemId"> -->
                                        <div class="col-7">{{ child.itemDescription }}</div>
                                        <div class="col-1 text-center">{{ child.quantity }}</div>
                                        <div class="col-4 text-end">{{ formatPrice(child.quantity * child.itemPrice)
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Price Breakdown Section -->
                    <table class="table text-end my-3">
                        <tbody>
                            <tr>
                                <th class="col-md-11 m-0 p-0" scope="row">Subtotal: $</th>
                                <td class="col-md-1 m-0 p-0">{{ subTotal.toFixed(2) }}</td>
                            </tr>
                            <tr v-if="discountAmount > 0">
                                <th class="col-md-11 m-0 p-0" scope="row">Promotional Discount: $</th>
                                <td class="col-md-1 m-0 p-0">{{ discountAmount }}</td>
                            </tr>
                            <tr>
                                <th class="col-md-11 m-0 p-0" scope="row">Convenience Fee: $</th>
                                <td class="col-md-1 m-0 p-0">{{ convenienceAmount.toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <th class="col-md-11 m-0 p-0" scope="row">Sales Tax: $</th>
                                <td class="col-md-1 m-0 p-0">{{ salesTaxAmount.toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <th class="col-md-11 m-0 p-0 fw-bold" scope="row">Order Total: $</th>
                                <td class="col-md-1 m-0 p-0 fw-bold">{{ finalTotal.toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Payment Information Section -->
                <div class="col-lg-6 col-12">
                    <h2 class="sub-title m-0 header-font">Payment Information</h2>

                    <div class="embed-responsive embed-responsive-4by3 quantum-form" v-if="quantum !== null">
                        <iframe :key="iframeKey" :src="iframeUrl" className="quantum-payment-iframe" :allow-cookies="true" width="100%" height="500"></iframe>
                    </div>

                    <form @submit.prevent="PaymentForm" class="info-form" v-else-if="authorize !== null">
                        <div class="row">
                            <div class="col-12">
                                <label class="py-2">Credit Card</label>
                                <input v-model="paymentData.creditcard" type="text" name="creditcard"
                                    placeholder="Credit Card Number" maxlength="16"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorPaymentClass('creditcard')]"
                                    @input="clearPaymentError('creditcard')">
                                <span v-if="paymentErrors.creditcard" class="text-danger">{{
                                    paymentErrors.creditcard
                                    }}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">
                                <label for="expiration" class="py-2">Expiration (MM/YY)</label>
                                <input v-model="paymentData.expiration" type="text" id="expiration" name="expiration"
                                    placeholder="YYYY/MM" maxlength="7"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorPaymentClass('expiration')]"
                                    @input="formatExpirationDate" />

                                <span v-if="paymentErrors.expiration" class="text-danger">{{
                                    paymentErrors.expiration
                                    }}</span>
                            </div>
                            <div class="col-sm-6">
                                <label class="py-2">CVV Code</label>
                                <input v-model="paymentData.cvvcode" type="text" name="cvvcode" placeholder="CVV"
                                    maxlength="4"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorPaymentClass('cvvcode')]"
                                    @input="clearPaymentError('cvvcode')">
                                <span v-if="paymentErrors.cvvcode" class="text-danger">{{ paymentErrors.cvvcode
                                    }}</span>
                            </div>
                        </div>

                        <!-- CAPTCHA -->
                        <div class="col-12">
                            <label class="py-2">Captcha</label>
                            <div class="captcha-container">
                                <span class="captcha-text px-5 py-2 h-100 fw-bold no-select">{{ captchaText
                                    }}</span>
                                <button type="button" @click="generateCaptcha" class="btn ms-3">Refresh</button>
                            </div>
                            <input v-model="paymentData.captcha" type="text" name="captcha" placeholder="Enter Captcha"
                                maxlength="6"
                                :class="['form-control', 'rounded-0', 'bg-transparent', 'my-3', errorPaymentClass('captcha')]">
                            <span v-if="paymentErrors.captcha" class="text-danger">{{ paymentErrors.captcha
                                }}</span>
                        </div>

                        <div class="text-center py-4">
                            <button @click="handlePayment" :disabled="isPlacingOrder" class="btn"> {{ isPlacingOrder ?
                                'Processing...' : 'Pay Now' }} </button>
                            <p v-if="statusMessage" :class="{ 'text-success': !isError, 'text-danger': isError }">{{
                                statusMessage }}</p>
                        </div>
                    </form>
                </div>
            </div>
            <div class="modal fade" id="removeItemModal" data-bs-backdrop="true" tabindex="-1" aria-labelledby="removeItemModalLabel" aria-hidden="true">
                <div class="modal-dialog" style="margin-bottom: 130px; margin-top: 130px;">
                    <div class="modal-content modal-dialog-scrollable">
                    <div class="modal-header">
                        <button type="button" 
                        class="btn-close shadow-none border-0 no-hover"
                        data-bs-dismiss="modal" 
                        aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <h2 class="text-center header-font">Declined Payment</h2>
                        <p class="text-center">High Fraud Score</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch, reactive, onMounted } from 'vue';
import { useCartStore } from '@/store/cart';
import { useCampaignStore } from '@/store/campaign';
import { useAddressStore } from '@/store/address';
import { useRouter } from 'vue-router';
import { setButtonStyles, setHeaderFontStyles, setSubHeaderFontStyles } from '@/utils/buttonStyles';
import { usePaymentStore } from '@/store/payment';
// import { FriendlyIframe } from '@/views/iframe/friendly-iframe.vue';

// processPayment
export default {
    name: 'PaymentPage',
    setup() {
        const router = useRouter();
        const cartStore = useCartStore();
        const campaignStore = useCampaignStore();
        const addressStore = useAddressStore();
        const paymentStore = usePaymentStore();

        // Add a ref to control iframe refresh
        const iframeKey = ref(0);
        const refreshIframe = () => {
        // Increment the key to force iframe refresh
        iframeKey.value += 1;
        };

        const campaign = computed(() => campaignStore.campaign);
        const campaig_short_url_name = campaign.value.short_url;
        const isLogoAllowed = computed(() => campaignStore.multilogoAllowed);

        const authorize = campaignStore.campaign.options.payment_type.authorize_payment_environment;
        const quantum = campaignStore.campaign.options.payment_type.quantum_payment_environment;

        const cartItems = computed(() => cartStore.cartItems);
        const gateway = ref({
            params: {
                skip_shipping_info: 'Y',
                ilf_API_Style: '2',
                Require_BCOUNTRY: 'Y',
                Require_phone: 'N',
                PayInfoOnly: 'Y',
                ts: +new Date(),
            }
        });

        watch(cartItems, (newCartItems) => {
            if (newCartItems.length === 0) {
                router.push('/shop');
            }
        }, { immediate: true });

        const generalInfo = computed(() => campaignStore.generalInfo);
        setButtonStyles(generalInfo.value);
        setHeaderFontStyles(generalInfo.value);
        setSubHeaderFontStyles(generalInfo.value);

        const subTotal = computed(() => cartStore.subTotal);
        const discountAmount = cartStore.discountAmount;
        const convenienceAmount = computed(() => campaignStore.convenienceAmount);
        const salesTaxAmount = computed(() => addressStore.getSalesTaxAmount);             
        const selectedAddress = addressStore.addresses[0];

        const iframeUrl = computed(() => {
        const params = {
            k: paymentStore.orderDetails.Key,
            ip: paymentStore.orderDetails.IP,
            Amount: finalTotal.value,
            ID: paymentStore.orderDetails.orderId,
            post_return_url_approved: paymentStore.orderDetails.approvedUrl,
            post_return_url_declined: paymentStore.orderDetails.declinedUrl,
            FNAME: selectedAddress.first_name,
            LNAME: selectedAddress.last_name,
            BADDR1: selectedAddress.address1,
            BCITY: selectedAddress.city,
            BSTATE: selectedAddress.state,
            BZIP1: selectedAddress.postal_code,
            BCOUNTRY: selectedAddress.country,
            phone: selectedAddress.phone,
            BCUST_EMAIL: selectedAddress.email,
            ...gateway.value.params,
            // Add timestamp to prevent caching
            _t: Date.now()
        };

        const query = '?' + Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        return paymentStore.orderDetails.paymentUrl + query;
        });

        onMounted(() => {
            window.addEventListener('message', (event) => {
                if (event.origin !== 'https://apps.frsfulfillment.com') {
                console.warn('Untrusted message origin:', event.origin);
                return;
                }

                const { event: eventType, data } = event.data;

                if (eventType === 'payment-result') {
                if (data.result === 'APPROVED') {
                    router.push({ path: '/confirmation' });
                } else if (data.result === 'DECLINED') {
                    const removeItemModal = new bootstrap.Modal(document.getElementById('removeItemModal'));
                    removeItemModal.show();
                    // Add modal hide event listener
                    const modalElement = document.getElementById('removeItemModal');
                    modalElement.addEventListener('hidden.bs.modal', () => {
                    refreshIframe();
                    });
                } else {
                    console.log('Unhandled payment status:', data);
                }
                } else {
                console.warn('Unhandled event type:', eventType);
                }
            });
        });

        const finalTotal = computed(() => subTotal.value + convenienceAmount.value + salesTaxAmount.value - discountAmount);

        const formatPrice = (price) => `${parseFloat(price).toFixed(2)}`;

        const paymentData = ref({
            creditcard: '',
            expiration: '',
            cvvcode: '',
            captcha: '',
        });

        const paymentErrors = ref({});
        const isPlacingOrder = ref(false);
        const statusMessage = ref('');
        const isError = ref(false);
        const visible = ref(false);
        const isLoading = ref(false);

        const captchaText = ref(generateRandomCaptcha());
        function generateRandomCaptcha() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let captcha = '';
            for (let i = 0; i < 6; i++) {
                captcha += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return captcha;
        }

        function errorPaymentClass(field) {
            return paymentErrors.value[field] ? 'border-danger shadow bg-danger-subtle' : '';
        }

        function clearPaymentError(field) {
            if (paymentErrors.value[field]) {
                delete paymentErrors.value[field];
            }
        }

        function showMessage(message, isErrorFlag) {
            statusMessage.value = message;
            isError.value = isErrorFlag;
            visible.value = true;

            setTimeout(() => {
                visible.value = false;
            }, 5000);
        }

        const billing = reactive({
            first_name: '',
            last_name: '',
            address1: '',
            city: '',
            state_prov: '',
            postal_code: '',
            country: '',
            email: ''
        });
        const orderTotal = ref(0);
        const orderId = ref('');
        const tokenKey = ref('');
        const ipAddr = ref('');

        const generateInvoiceNumber = () => {
            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 10000);
            return `${timestamp}-${randomNum}`;
        };

        const handlePayment = async () => {
            if (!validatePaymentForm()) {
                return;
            }

            const {
                creditcard: cardNumber,
                expiration: expiryDate,
                cvvcode: cvv,
                captcha: captchaValue
            } = paymentData.value;

            isPlacingOrder.value = true;

            try {
                const selectedAddress = addressStore.addresses[0];
                const endpoint = 'https://apps.frsfulfillment.com/api/authorize/payment';
                const paymentData = {
                    cardNumber: cardNumber,
                    expiryDate: expiryDate,
                    cvv: cvv,
                    amount: finalTotal.value,
                    orderId: paymentStore.orderDetails.orderId,
                    invoiceNumber: generateInvoiceNumber(),
                    description: 'Test123',
                    salesTaxAmount : salesTaxAmount.value,
                    firstName: selectedAddress.first_name || '',
                    lastName: selectedAddress.last_name || '',
                    company: selectedAddress.company || '',
                    address: selectedAddress.address1 || '',
                    city: selectedAddress.city || '',
                    state: selectedAddress.state || '',
                    zip: selectedAddress.postal_code || '',
                    country: selectedAddress.country || '',
                    email: selectedAddress.email || '',
                    campaig_short_url_name : campaig_short_url_name || ''
                };

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(paymentData)
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }

                const responseText = await response.text();
                const jsonMatch = responseText.match(/\{.*\}/);
                if (!jsonMatch) {
                    throw new Error('Invalid response format');
                }

                const data = JSON.parse(jsonMatch[0]);
                const { success, result , status ,error} = data;

                if (success && result === 'Approved' && status !== 'failed') {
                    // store.commit('completeTheOrder');
                    setTimeout(() => {
                        router.push({ path: '/confirmation' });
                    }, 100);
                } else {
                    // Show the decline modal
                    const declineReason = error || result || 'Payment declined';
                    console.error('Payment declined reason:', declineReason);
                    // const declineReason = result || 'Payment declined';
                    const removeItemModal = new bootstrap.Modal(document.getElementById('removeItemModal'));
                    removeItemModal.show();
                    // Emit or handle decline popup here
                }
            } catch (error) {
                console.error('Payment processing error:', error.message);
                // Emit or handle error popup here
            } finally {
                isPlacingOrder.value = false;
            }
        };

        function validatePaymentForm() {

            paymentErrors.value = {};
            let isValid = true;

            if (!paymentData.value.creditcard) {
                paymentErrors.value.creditcard = 'Enter credit card number';
                isValid = false;
            } else if (!/^[0-9]{16}$/.test(paymentData.value.creditcard)) {
                paymentErrors.value.creditcard = 'Credit card number is invalid';
                isValid = false;
            }

            if (!paymentData.value.expiration) {
                paymentErrors.value.expiration = 'Enter expiration date';
                isValid = false;
            } else if (!/^\d{4}\/(0[1-9]|1[0-2])$/.test(paymentData.value.expiration)) {
                paymentErrors.value.expiration = 'Expiration date must be in YYYY/MM format';
                isValid = false;
            }

            if (!paymentData.value.cvvcode) {
                paymentErrors.value.cvvcode = 'Enter CVV code';
                isValid = false;
            } else if (!/^\d{3,4}$/.test(paymentData.value.cvvcode)) {
                paymentErrors.value.cvvcode = 'CVV code is invalid';
                isValid = false;
            }

            if (!paymentData.value.captcha) {
                paymentErrors.value.captcha = 'Please Enter Captcha';
                isValid = false;
            } else if (paymentData.value.captcha !== captchaText.value) {
                paymentErrors.value.captcha = 'Captcha is incorrect';
                isValid = false;
            }

            return isValid;
        }

        function generateCaptcha() {
            captchaText.value = generateRandomCaptcha();
        }

        function formatExpirationDate() {
            let value = paymentData.value.expiration.replace(/\D/g, ''); // Remove any non-numeric characters

            // Apply the YYYY/MM format while typing
            if (value.length > 4) {
                value = value.slice(0, 4) + '/' + value.slice(4, 6); // Format as YYYY/MM
            }

            // Update the model with the formatted value
            paymentData.value.expiration = value;

            // Check if the value has a length of 5 (YYYY/MM format)
            if (value.length === 7) {
                const expirationRegex = /^\d{4}\/(0[1-9]|1[0-2])$/;

                if (!expirationRegex.test(value)) {
                    paymentErrors.value.expiration = 'Invalid expiration date format';
                    return;
                }
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed
                const currentYear = currentDate.getFullYear(); // Get the last four digits of the current year

                const expirationYear = parseInt(value.slice(0, 4), 10);
                const expirationMonth = parseInt(value.slice(5, 7), 10);

                if (
                    expirationYear < currentYear ||
                    (expirationYear === currentYear && expirationMonth < currentMonth)
                ) {
                    paymentErrors.value.expiration = 'Expiration date must be in the future';
                    return;
                }
            }

            clearPaymentError('expiration'); // Clear error if any
        }

        return {
            cartItems,
            paymentData,
            paymentErrors,
            statusMessage,
            visible,
            isError,
            isLoading,
            showMessage,
            discountAmount,
            convenienceAmount,
            salesTaxAmount,
            subTotal,
            finalTotal,
            formatPrice,
            errorPaymentClass,
            clearPaymentError,
            captchaText,
            formatExpirationDate,
            generateCaptcha,
            isPlacingOrder,
            billing,
            orderTotal,
            orderId,
            tokenKey,
            ipAddr,
            handlePayment,
            validatePaymentForm,
            generateInvoiceNumber,
            iframeUrl,
            iframeKey,
            gateway,
            authorize,
            isLogoAllowed,
            quantum,
        };
    },
};
</script>

<style scoped>
.custom-title {
    font-size: 14px;
}

tr {
    border-color: transparent;
}

table {
    --bs-table-bg: transparent !important;
}

input,
select,
.form-check-input {
    border: 1px solid #000;
    background-color: transparent;
    border-radius: 0;
}

input:focus,
.form-select:focus {
    outline: none;
    border-radius: 0;
    border: 1px solid #000;
    box-shadow: 0 0 5px 2px rgba(93, 93, 93, 0.5);
}

.captcha-text {
    background-color: antiquewhite;
}

.no-select {
    user-select: none;
    pointer-events: none;
}

@media (max-width: 320px) {
    .box {
        margin: 0 15px;
    }

    .overlay-text {
        font-size: x-small !important;
    }

    .no-border-end {
        border-right: none !important;
    }
}

@media (min-width: 321px) and (max-width: 425px) {
    .box {
        margin: 0 15px;
    }

    .overlay-text {
        font-size: small !important;
    }

    .no-border-end {
        border-right: none !important;
    }
}

@media (min-width: 426px) and (max-width: 575px) {
    .box {
        margin: 0 15px;
    }

    .no-border-end {
        border-right: none !important;
    }

    .btn {
        margin-top: 10px;
        width: 100%;
    }

    .overlay-text {
        font-size: large !important;
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    .no-border-end {
        border-right: none !important;
    }

    .box {
        margin: 0 15px;
    }

    .overlay-text {
        font-size: 6px !important;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .no-border-end {
        border-right: none !important;
    }

    .overlay-text {
        font-size: xx-small !important;
    }
}

@media (min-width: 992px) and (max-width: 1200px) {
    .overlay-text {
        font-size: 6px !important;
    }
}

@media (min-width: 1201px) and (max-width: 1400px) {
    .overlay-text {
        font-size: 7px;
    }
}

@media (min-width: 1401px) {
    .overlay-text {
        font-size: 8px !important;
    }
}
</style>