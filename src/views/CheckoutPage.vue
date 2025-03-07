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
                                            <!-- <div class="overlay-text" :style="{ top: '53%' }">
                                                <p class="m-0" v-for="n in item.max_lines" :key="n">
                                                    <span v-if="item.lines[n - 1]">{{ item.lines[n - 1] }}</span>
                                                    <span v-else>&nbsp;</span>
                                                </p>
                                            </div> -->
                                            <div class="overlay-text" :style="{ top: item.productDescription === '8x8 Additional McCovey Keepsake Brick' ? '60%' : '53%' }">
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
                                    <div class="row" v-if="item?.item_id != Object.keys(item?.children)[0]" >
                                        <div class="col-7">{{ item.productDescription }}</div>
                                        <div class="col-1 text-center">{{ item.qty }}</div>
                                        <div class="col-4 text-end">{{ formatPrice(item.productPrice) }}</div>
                                    </div>
                                    <!-- <div class="row" v-for="child in item.childItems" :key="child.itemId"> -->
                                    <div class="row"
                                        v-for="child in item.childItems.filter(child => child.quantity > 0)"
                                        :key="child.itemId">
                                        <div class="col-7">{{ child.itemDescription }}</div>
                                        <div class="col-1 text-center">{{ child.quantity }}</div>
                                        <div class="col-4 text-end">{{ formatPrice(child.quantity * child.itemPrice) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Promo Code Section -->
                    <form @submit.prevent="applyPromoCode" v-if="isPromoCodeAllowed"
                        class="form-inline d-flex py-3 justify-content-end align-items-center">
                        <label for="PromotionalCode">Promo Code:</label>
                        <div class="form-group px-2">
                            <input type="text" id="PromotionalCode" v-model="promoCode" placeholder="Enter Code"
                                :class="['form-control', 'rounded-0', 'bg-transparent', promoCodeClass]">
                        </div>
                        <button type="submit" class="btn px-4">Apply</button>
                    </form>

                    <p v-if="errorMessage" class="text-danger p-0 text-end">{{ errorMessage }}</p>

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

                <!-- Billing Information Section -->
                <div class="col-lg-6 col-12">
                    <h2 class="sub-title m-0 header-font">BILLING INFORMATION <span class="text-danger">*</span></h2>

                    <form class="info-form">
                        <div class="row">
                            <div class="col-sm-5">
                                <label for="billing_first_name" class="py-2">First Name <span
                                        class="text-danger">*</span></label>
                                <input v-model="checkoutData.first_name" type="text" id="billing_first_name"
                                    name="first_name" placeholder="First Name"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('first_name')]"
                                    @input="clearcheckoutError('first_name')" />
                                <!-- Error message for First Name -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.first_name">{{
                                    checkoutErrors.first_name }}</p>
                            </div>
                            <div class="col-sm-2">
                                <label class="py-2">M.I.</label>
                                <input v-model="checkoutData.middle_name" type="text" name="middle_name"
                                    placeholder="M.I."
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('middle_name')]"
                                    @input="clearcheckoutError('middle_name')" />
                                <!-- Error message for Middle Name -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.middle_name">{{
                                    checkoutErrors.middle_name }}</p>
                            </div>
                            <div class="col-sm-5">
                                <label for="billing_last_name" class="py-2">Last Name <span
                                        class="text-danger">*</span></label>
                                <input v-model="checkoutData.last_name" type="text" name="last_name"
                                    id="billing_last_name" placeholder="Last Name"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('last_name')]"
                                    @input="clearcheckoutError('last_name')" />
                                <!-- Error message for Last Name -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.last_name">{{
                                    checkoutErrors.last_name }}</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <label class="py-2">Company</label>
                                <input v-model="checkoutData.company" type="text" name="company" placeholder="Company"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('company')]"
                                    @input="clearcheckoutError('company')" />
                                <!-- Error message for Company -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.company">{{
                                    checkoutErrors.company }}</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <label for="billing_country" class="py-2">Country <span
                                        class="text-danger">*</span></label>
                                <select id="billing_country" v-model="selectedCheckoutCountry"
                                    class="form-select rounded-0 bg-transparent" :class="errorCheckoutClass('country')"
                                    @change="clearcheckoutError('country')">
                                    <option disabled value="">Select Country</option>
                                    <option v-for="(countryName, countryCode) in countries" :key="countryCode"
                                        :value="countryCode">
                                        {{ countryName }}
                                    </option>
                                </select>
                                <!-- Error message for Country -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.country">{{
                                    checkoutErrors.country }}</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <label for="billing_address1" class="py-2">Address 1 <span
                                        class="text-danger">*</span></label>
                                <input v-model="checkoutData.address1" type="text" name="address1" id="billing_address1"
                                    placeholder="Address 1"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('address1'), checkoutClassError('address1')]"
                                    @input="clearcheckoutError('address1')" />
                                <!-- Error message for Address 1 -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.address1">{{
                                    checkoutErrors.address1 }}</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <label class="py-2">Address 2</label>
                                <input v-model="checkoutData.address2" type="text" name="address2"
                                    placeholder="Address 2"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('address2')]"
                                    @input="clearcheckoutError('address2')" />
                                <!-- Error message for Address 2 (if any) -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.address2">{{
                                    checkoutErrors.address2 }}</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-4">
                                <label for="billing_city" class="py-2">City <span class="text-danger">*</span></label>
                                <input v-model="checkoutData.city" type="text" id="billing_city" name="city"
                                    placeholder="City"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('city'), checkoutClassError('city')]"
                                    @input="clearcheckoutError('city')" />
                                <!-- Error message for City -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.city">{{ checkoutErrors.city }}
                                </p>
                            </div>

                            <div class="col-sm-4">
                                <label for="billing_state" class="py-2">State <span class="text-danger">*</span></label>
                                <select id="billing_state" v-model="selectedCheckoutState"
                                    class="form-select rounded-0 bg-transparent"
                                    :class="errorCheckoutClass('state'), checkoutClassError('state')"
                                    :disabled="!selectedCheckoutCountry">
                                    <option disabled value="">Select State</option>
                                    <option v-for="(stateName, stateCode) in availableCheckoutStates" :key="stateCode"
                                        :value="stateCode">
                                        {{ stateName }}
                                    </option>
                                </select>
                                <!-- Error message for State -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.state">{{ checkoutErrors.state
                                    }}</p>
                            </div>

                            <div class="col-sm-4">
                                <label for="billing_zip" class="py-2">Zip Code <span
                                        class="text-danger">*</span></label>
                                <input v-model="checkoutData.postal_code" type="text" id="billing_zip"
                                    name="postal_code" placeholder="Zip Code"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('postal_code'), checkoutClassError('postal_code')]"
                                    @input="clearcheckoutError('postal_code')" maxlength="5" />
                                <!-- Error message for Zip Code -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.postal_code">{{
                                    checkoutErrors.postal_code }}</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-4">
                                <label for="billing_phone" class="py-2">Phone Number <span
                                        class="text-danger">*</span></label>
                                <input v-model="checkoutData.phone" type="text" name="phone" id="billing_phone"
                                    placeholder="Phone Number"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('phone')]"
                                    @input="formatPhoneNumber" maxlength="12" />
                                <!-- Error message for Phone -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.phone">{{ checkoutErrors.phone
                                    }}</p>
                            </div>

                            <div class="col-sm-8">
                                <label for="billing_email" class="py-2">Email Address <span
                                        class="text-danger">*</span></label>
                                <input v-model="checkoutData.email" type="email" name="email" id="billing_email"
                                    placeholder="Email Address"
                                    :class="['form-control', 'rounded-0', 'bg-transparent', errorCheckoutClass('email')]"
                                    @input="clearcheckoutError('email')" />
                                <!-- Error message for Email -->
                                <p class="error-m mt-1 text-danger" v-if="checkoutErrors.email">{{ checkoutErrors.email
                                    }}</p>
                            </div>
                        </div>

                        <p class="pt-2 text-danger" v-if="checkoutAddressErrors">{{ checkoutAddressErrors
                            }}</p>

                        <!-- <div v-if="addressStore.errorMessage" class="error-message">
                            {{ addressStore.errorMessage }}
                        </div> -->
                        <!-- Shipping Information Section -->
                        <h2 class="sub-title pt-5 m-0 header-font">SHIPPING INFORMATION</h2>
                        <div class="py-3">
                            <!-- Billing Address Option -->
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="shippingOption" id="ship2billing"
                                    :value="ShippingOptions.BILLING" v-model="selectedShippingOption"
                                    @change="handleShippingChange" />
                                <label class="form-check-label" for="ship2billing">
                                    Ship all items to billing address
                                </label>
                            </div>

                            <!-- Another Address Option -->
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="shippingOption" id="ship2another"
                                    :value="ShippingOptions.ANOTHER" v-model="selectedShippingOption"
                                    @change="handleShippingChange" style="cursor: pointer;"
                                    @click="handleShippingModel" />
                                <label class="form-check-label" for="ship2another">
                                    Ship all items to another address
                                </label>
                            </div>

                            <!-- Multiple Addresses Option -->
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="shippingOption" id="ship2multiple"
                                    :value="ShippingOptions.MULTIPLE" v-model="selectedShippingOption"
                                    :disabled="!isAddressValid" @change="handleShippingChange" style="cursor: pointer;"
                                    @click="handleMultipleShippingModel" />
                                <label class="form-check-label" for="ship2multiple">
                                    Ship items to multiple addresses
                                </label>
                            </div>

                            <p class="pt-3 m-0">
                                * Notice: Please enter all information manually. Autofill functionality may not be
                                compatible.
                                Deliveries cannot be made to P.O. or A.P.O. boxes. Please provide a physical shipping
                                address for
                                package deliveries. Please call us to place an international order.
                            </p>

                        </div>

                        <!-- Terms & Conditions and Opt-in -->
                        <div class="form-check">
                            <input v-model="acceptTerms" class="form-check-input" type="checkbox" id="accept_terms"
                                :class="{
                                    'border-danger': checkoutErrors.accept_terms,
                                    'shadow': checkoutErrors.accept_terms,
                                    'bg-danger-subtle': checkoutErrors.accept_terms
                                }" @change="clearAcceptTermsError">

                            <label class="form-check-label" for="accept_terms">Accept </label>
                            <label class="form-check-label ps-1 text-danger" data-bs-toggle="modal"
                                data-bs-target="#TermsConditionsModal" style="cursor: pointer;"> Terms & Conditions
                                <span class="text-danger">*</span></label>
                        </div>

                        <p class="pt-3 text-danger">* Item is required in order to proceed</p>

                        <!-- Submit Button -->
                        <div class="text-center py-4">
                            <button type="button" :disabled="!isAddressValid || isLoading" @click="continueToPayment" class="btn" > {{ isLoading ? 'PROCESSING...' : 'CONTINUE TO PAYMENT' }} </button>
                        </div>

                        <!-- Loader -->
                        <Teleport to="body">
                            <div v-if="isLoading" class="loader-container">
                            <div class="loader"></div>
                            <p class="loading-text">Processing...</p>
                            </div>
                        </Teleport>
                    </form>
                </div>

                <!-- Another Address Modal -->
                <div class="modal fade" id="anotheraddressModal" data-bs-backdrop="true"
                    aria-labelledby="anotheraddressModalLabel" aria-hidden="true">

                    <div class="modal-dialog modal-lg" style="margin-bottom: 100px; margin-top: 130px;">
                        <div class="modal-content modal-dialog-scrollable">
                            <div class="modal-header">
                                <button type="button" class="btn-close shadow-none border-0 no-hover"
                                    data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body ">
                                <h2 class="text-center header-font">Shipping Address</h2>
                                <p class="text-center">All items will be shipped to this address.</p>
                                <form @submit.prevent="ShippingForm" class="info-form">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <label for="shipping_first_name" class="py-2">First Name <span
                                                    class="text-danger">*</span></label>
                                            <input v-model="shippingData.first_name" type="text" name="first_name"
                                                id="shipping_first_name" placeholder="First Name"
                                                :class="['form-control', 'rounded-0', 'bg-transparent', errorshippingClass('first_name')]"
                                                @input="clearshippingError('first_name')">
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.first_name">{{
                                                shippingErrors.first_name }}</p>
                                        </div>
                                        <div class="col-sm-2">
                                            <label class="py-2">M.I.</label>
                                            <input v-model="shippingData.middle_name" type="text" name="middle_name"
                                                placeholder="M.I."
                                                :class="['form-control', 'rounded-0', 'bg-transparent', errorshippingClass('middle_name')]"
                                                @input="clearshippingError('middle_name')">
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.middle_name">{{
                                                shippingErrors.middle_name }}</p>
                                        </div>
                                        <div class="col-sm-5">
                                            <label for="shipping_last_name" class="py-2">Last Name <span
                                                    class="text-danger">*</span></label>
                                            <input v-model="shippingData.last_name" type="text" name="last_name"
                                                id="shipping_last_name" placeholder="Last Name"
                                                :class="['form-control', 'rounded-0', 'bg-transparent', errorshippingClass('last_name')]"
                                                @input="clearshippingError('last_name')">
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.last_name">{{
                                                shippingErrors.last_name }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-12">
                                            <label class="py-2">Company</label>
                                            <input v-model="shippingData.company" type="text" name="company"
                                                placeholder="Company"
                                                :class="['form-control', 'rounded-0', 'bg-transparent', errorshippingClass('company')]"
                                                @input="clearshippingError('company')">
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.company">{{
                                                shippingErrors.company }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-12">
                                            <label for="shipping_country" class="py-2">Country {{
                                                selectedShippingCountry }} <span class="text-danger">*</span></label>
                                            <select id="shipping_country" v-model="selectedShippingCountry"
                                                :class="['form-select', 'rounded-0', 'bg-transparent', errorshippingClass('country')]"
                                                @change="clearshippingError('country')">
                                                <option disabled value="">Select Country</option>
                                                <option v-for="(countryName, countryCode) in countries"
                                                    :key="countryCode" :value="countryCode">
                                                    {{ countryName }}
                                                </option>
                                            </select>
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.country">{{
                                                shippingErrors.country }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-12">
                                            <label for="shipping_address1" class="py-2">Address 1 <span
                                                    class="text-danger">*</span></label>
                                            <input v-model="shippingData.address1" type="text" name="address1"
                                                id="shipping_address1" placeholder="Address 1"
                                                :class="['form-control', 'rounded-0', 'bg-transparent', errorshippingClass('address1'), shippingClassError('address1')]"
                                                @input="clearshippingError('address1')">
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.address1">{{
                                                shippingErrors.address1 }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-12">
                                            <label class="py-2">Address 2</label>
                                            <input v-model="shippingData.address2" type="text" name="address2"
                                                placeholder="Address 2"
                                                :class="['form-control', 'rounded-0', 'bg-transparent', errorshippingClass('address2')]"
                                                @input="clearshippingError('address2')">
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.address2">{{
                                                shippingErrors.address2 }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-4">
                                            <label for="shipping_city" class="py-2">City <span
                                                    class="text-danger">*</span></label>
                                            <input v-model="shippingData.city" type="text" id="shipping_city"
                                                name="city" placeholder="City"
                                                :class="['form-control', 'rounded-0', 'bg-transparent', errorshippingClass('city'), shippingClassError('city')]"
                                                @input="clearshippingError('city')">
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.city">{{
                                                shippingErrors.city }}
                                            </p>
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="shipping_state" class="py-2">State <span
                                                    class="text-danger">*</span></label>
                                            <select id="shipping_state" v-model="selectedShippingState"
                                                class="form-select rounded-0 bg-transparent"
                                                :class="errorshippingClass('state'), shippingClassError('state')"
                                                :disabled="!selectedShippingCountry">
                                                <option disabled value="">Select State</option>
                                                <option v-for="(stateName, stateCode) in availableShippingStates"
                                                    :key="stateCode" :value="stateCode">
                                                    {{ stateName }}
                                                </option>
                                            </select>
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.state">
                                                {{ shippingErrors.state }}</p>
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="shipping_zip" class="py-2">Zip Code <span
                                                    class="text-danger">*</span></label>
                                            <input v-model="shippingData.postal_code" type="text" id="shipping_zip"
                                                name="postal_code" placeholder="Zip Code"
                                                :class="['form-control', 'rounded-0', 'bg-transparent', errorshippingClass('postal_code'), shippingClassError('postal_code')]"
                                                @input="clearshippingError('postal_code')" maxlength="5">
                                            <p class="error-m mt-1 text-danger" v-if="shippingErrors.postal_code">{{
                                                shippingErrors.postal_code }}</p>
                                        </div>
                                    </div>

                                    <p class="pt-2 text-danger" v-if="shippingAddressErrors">{{
                                        shippingAddressErrors
                                        }}</p>

                                    <div class="text-end py-4">
                                        <button type="submit" @click="shippingAddress" :disabled="isshippingAddress" class="btn">{{ isshippingAddress ?
                                            'Processing...' : 'Save' }}</button>                                        
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Multipl Address Modal -->
                <div class="modal fade" id="multipleaddressModal" data-bs-backdrop="static" data-bs-keyboard="false"
                    aria-labelledby="multipleaddressModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" style="margin-bottom: 100px; margin-top: 130px;">
                        <div class="modal-content modal-dialog-scrollable">
                            <div class="modal-header">
                                <button type="button" class="btn-close shadow-none border-0 no-hover"
                                    data-bs-dismiss="modal" @click="handleClose" aria-label="Close"></button>
                            </div>
                            <div class="modal-body ">
                                <h2 class="text-center header-font">Shipping Addresses</h2>
                                <p class="text-center">Please select the shipping address for each item. If the
                                    address is not displayed, click the "Add an Address" button.</p>

                                <!-- Table Header -->
                                <div class="row m-0 py-2 d-none d-sm-flex border-bottom border-dark">
                                    <div class="col-sm-3 ps-0 fw-medium">PRODUCT</div>
                                    <div class="col-sm-9">
                                        <div class="row">
                                            <div class="col-5 fw-medium">DESCRIPTION</div>
                                            <div class="col-7 fw-medium">SHIPPING ADDRESS</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- First Product Row -->
                                <!-- <div v-for="(item) in cartItems" :key="item.productId" class="row py-3"> -->
                                    <div v-for="(item, itemIndex) in cartItems" :key="`${item.item_id}-${itemIndex}`" class="row py-3">
                                    <!-- {{  item?.productDescription }} -->
                                    <div class="col-sm-3">
                                        <div class="border-bottom border-dark mb-3 py-2 d-block d-sm-none fw-medium">
                                            PRODUCT
                                        </div>
                                        <div class="prod-container overlay-section">
                                            <img :src="item.logo_image" class="img-fluid overlay-image"
                                                alt="Product Image">
                                                <div v-if="isLogoAllowed && item?.productDescription?.toLowerCase().includes('logo')">
                                                <div class="overlay-text" :style="{ top: '75%' }">
                                                    <p class="m-0 overlay-custom-text" v-for="n in item.max_lines"
                                                        :key="n">
                                                        <span v-if="item.lines[n - 1]">{{ item.lines[n - 1] }}</span>
                                                        <span v-else>&nbsp;</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div class="overlay-text" :style="{ top: '53%' }">
                                                    <p class="m-0 overlay-custom-text" v-for="n in item.max_lines"
                                                        :key="n">
                                                        <span v-if="item.lines[n - 1]">{{ item.lines[n - 1] }}</span>
                                                        <span v-else>&nbsp;</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-sm-9">
                                        <!-- Part Items -->
                                        <div class="row mt-2" v-for="(partItem, partIndex) in item.partItems || []" 
                                            :key="`${item.item_id}-${itemIndex}-part-${partItem.itemId}-${partIndex}`">
                                            <div class="col-5">
                                                <p>{{ partItem.itemDescription }}</p>
                                            </div>
                                            <div class="col-7">
                                                <select class="form-select" 
                                                        :class="errorClass(`${item.item_id}-${itemIndex}-part-${partItem.itemId}-${partIndex}`)" 
                                                        v-model="selectedAddresses[`${item.item_id}-${itemIndex}-part-${partItem.itemId}-${partIndex}`]" 
                                                        @change="updateAddress(`${item.item_id}-${itemIndex}-part-${partItem.itemId}-${partIndex}`, selectedAddresses[`${item.item_id}-${itemIndex}-part-${partItem.itemId}-${partIndex}`])">
                                                    <option value="0">-- Please select an address --</option>
                                                    <option v-for="(address, idx) in addressList" :key="idx" :value="address.id">
                                                        {{ formatAddress(address) }}
                                                    </option>
                                                </select>
                                                <p v-if="Errors[`${item.item_id}-${itemIndex}-part-${partItem.itemId}-${partIndex}`]" class="text-danger mt-1 m-0">
                                                    {{ Errors[`${item.item_id}-${itemIndex}-part-${partItem.itemId}-${partIndex}`] }}
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Keepsake Certificates -->
                                        <div v-for="(ksCert, keepsakeIndex) in item.keepsakeCerts || []" 
                                            :key="`${item.item_id}-${itemIndex}-ks-${ksCert.itemId}-${keepsakeIndex}`" class="row mt-2">
                                            <div class="col-5">
                                                <p>{{ ksCert.itemDescription }}</p>
                                            </div>
                                            <div class="col-7">
                                                <select class="form-select" 
                                                        :class="errorClass(`${item.item_id}-${itemIndex}-ks-${ksCert.itemId}-${keepsakeIndex}`)" 
                                                        v-model="selectedAddresses[`${item.item_id}-${itemIndex}-ks-${ksCert.itemId}-${keepsakeIndex}`]" 
                                                        @change="updateAddress(`${item.item_id}-${itemIndex}-ks-${ksCert.itemId}-${keepsakeIndex}`, selectedAddresses[`${item.item_id}-${itemIndex}-ks-${ksCert.itemId}-${keepsakeIndex}`])">
                                                    <option value="0">-- Please select an address --</option>
                                                    <option v-for="(address, idx) in addressList" :key="idx" :value="address.id">
                                                        {{ formatAddress(address) }}
                                                    </option>
                                                </select>
                                                <p v-if="Errors[`${item.item_id}-${itemIndex}-ks-${ksCert.itemId}-${keepsakeIndex}`]" class="text-danger mt-1 m-0">
                                                    {{ Errors[`${item.item_id}-${itemIndex}-ks-${ksCert.itemId}-${keepsakeIndex}`] }}
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Child Items -->
                                        <div v-for="(child, childIndex) in item.childItems || []" 
                                            :key="`${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}`">
                                            <div class="row mt-2" v-for="n in child.quantity" 
                                                :key="`${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${n - 1}`">
                                                <div class="col-5">
                                                    <p>{{ child.itemDescription }}</p>
                                                </div>
                                                <div class="col-7">
                                                    <select class="form-select" 
                                                            :class="errorClass(`${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${n - 1}`)" 
                                                            v-model="selectedAddresses[`${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${n - 1}`]" 
                                                            @change="updateAddress(`${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${n - 1}`, selectedAddresses[`${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${n - 1}`])">
                                                        <option value="0">-- Please select an address --</option>
                                                        <option v-for="(address, idx) in addressList" :key="idx" :value="address.id">
                                                            {{ formatAddress(address) }}
                                                        </option>
                                                    </select>
                                                    <p v-if="Errors[`${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${n - 1}`]" class="text-danger mt-1 m-0">
                                                        {{ Errors[`${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${n - 1}`] }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="row py-3">
                                    <div class="col-md-6 col-sm-6 col-12">
                                        <button class="btn" data-bs-toggle="modal" data-bs-target="#anotheraddressModal"
                                            style="cursor: pointer;">Add an
                                            Address</button>
                                    </div>
                                    <div class="col-md-6 col-sm-6 col-12 text-end">
                                        <button class="btn" @click="saveShippingAddresses">Save</button>
                                    </div>
                                     <!-- Loader Section -->
                                    <div v-if="isLoading" class="loader-container">
                                        <div class="loader"></div>
                                        <p class="loading-text">Processing...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Terms & Conditions Modal -->
                <div class="modal fade" id="TermsConditionsModal" data-bs-backdrop="true"
                    aria-labelledby="TermsConditionsModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" style="margin-bottom: 100px; margin-top: 130px;">
                        <div class="modal-content modal-dialog-scrollable">
                            <div class="modal-header">
                                <button type="button" class="btn-close shadow-none border-0 no-hover"
                                    data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <h3 class="text-center header-font">TERMS & CONDITIONS</h3>
                                <p v-html="termsConditions" class="border-bottom pb-4"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useCartStore } from '@/store/cart';
import { useCampaignStore } from '@/store/campaign';
import { useAddressStore } from '@/store/address';
import { usePaymentStore } from '@/store/payment';
import { setButtonStyles, setHeaderFontStyles, setSubHeaderFontStyles } from '@/utils/buttonStyles';
import { ShippingOptions } from '@/enums/shippingOptionsEnum';
import { useRouter } from 'vue-router';

export default {
    name: 'CheckoutPage',
    setup() {
        const cartStore = useCartStore();
        const campaignStore = useCampaignStore();
        const router = useRouter();

        const campaign = computed(() => campaignStore.campaign);
        const productData = computed(() => campaignStore.productData);
        const isLogoAllowed = computed(() => campaignStore.multilogoAllowed);

        const generalInfo = computed(() => campaignStore.generalInfo);
        setButtonStyles(generalInfo.value);
        setHeaderFontStyles(generalInfo.value);
        setSubHeaderFontStyles(generalInfo.value);

        const cartItems = computed(() => cartStore.cartItems);

        // Redirect to shop page if cart is empty
        watch(cartItems, (newCartItems) => {
            if (newCartItems.length === 0) {
                router.push('/shop');
            }
        }, { immediate: true });

        const subTotal = computed(() => cartStore.subTotal);
        const promoCode = ref('');
        const campaigname = campaign.value.short_url;
        const discountAmount = ref(0);
        const errorMessage = ref('');
        const convenienceAmount = computed(() => campaignStore.convenienceAmount);
        const salesTaxAmount = ref(0);
        const finalTotal = computed(() => subTotal.value + convenienceAmount.value + salesTaxAmount.value - discountAmount.value);

        const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

        const isPromoCodeAllowed = computed(() => campaignStore.promocodeAllowed);

        cartStore.setDiscountAmount('');

        let discountType = '';

        const applyPromoCode = async () => {
            if (!promoCode.value) {
                errorMessage.value = "Please enter a promo code";
                return;
            }

            try {
                const promoData = await campaignStore.applyPromoCode(promoCode.value, campaigname);

                if (promoData.error) {
                    // errorMessage.value = promoData.error;
                    discountAmount.value = "0.00";
                    cartStore.setDiscountAmount(0);
                    return;
                }

                if (promoCode.value === promoData.promo_code.code) {
                    discountType = promoData.promo_code.discount_type;
                    errorMessage.value = '';

                    let discountValue = 0;
                    if (promoData.promo_code.discount_type === 'percentage') {
                        discountValue = (subTotal.value * promoData.promo_code.discount) / 100;
                    } else if (promoData.promo_code.discount_type === 'flat') {
                        discountValue = promoData.promo_code.discount;
                    }

                    discountAmount.value = (Math.round(discountValue * 100) / 100).toFixed(2);

                    if (parseFloat(discountAmount.value) > 0) {
                        cartStore.setDiscountAmount(discountAmount.value);
                    }
                } else {
                    errorMessage.value = "Invalid promo code";
                    discountAmount.value = "0.00";
                    cartStore.setDiscountAmount(0);
                }
            } catch (error) {
                errorMessage.value = "Promo code not found for this campaign";
                discountAmount.value = "0.00";
                cartStore.setDiscountAmount(0);
            }
        };

        const promoCodeClass = computed(() => {
            if (errorMessage.value || discountAmount.value === "0.00") {
                return 'border-danger shadow bg-danger-subtle';
            }
            return 'border-dark';
        });

        // BILLING
        const addressStore = useAddressStore();
        const paymentStore = usePaymentStore();

        const countries = computed(() => campaignStore.campaignData?.countries || {});
        const states = computed(() => campaignStore.campaignData?.states || {});

        const selectedCheckoutCountry = ref(''), selectedCheckoutState = ref('');
        const selectedShippingCountry = ref(''), selectedShippingState = ref('');

        const availableCheckoutStates = computed(() => states.value[selectedCheckoutCountry.value] || {});
        const availableShippingStates = computed(() => states.value[selectedShippingCountry.value] || {});

        watch(selectedShippingCountry, (newVal, oldVal) => {
            shippingData.value.country = newVal;
        });

        watch(selectedShippingState, (newVal, oldVal) => {
            shippingData.value.state = newVal;
        });

        const checkoutData = ref({
            first_name: '',
            middle_name: '',
            last_name: '',
            address1: '',
            address2: '',
            company: '',
            city: '',
            country: '',
            postal_code: '',
            state: '',
            phone: '',
            email: '',
        });

        const shippingData = ref({
            first_name: '',
            middle_name: '',
            last_name: '',
            address1: '',
            address2: '',
            company: '',
            city: '',
            country: '',
            postal_code: '',
            state: '',
        });

        const resetShippingData = () => {
            shippingData.value = {
                first_name: '',
                middle_name: '',
                last_name: '',
                address1: '',
                address2: '',
                company: '',
                city: '',
                country: '',
                postal_code: '',
                state: '',
            };
        };

        const checkoutErrors = ref({}), shippingErrors = ref({});

        const errorCheckoutClass = (field) => checkoutErrors.value[field] ? 'border-danger shadow bg-danger-subtle' : 'border-dark';
        const errorshippingClass = (field) => shippingErrors.value[field] ? 'border-danger shadow bg-danger-subtle' : 'border-dark';
        const clearcheckoutError = (field) => checkoutErrors.value[field] = null;
        const clearshippingError = (field) => shippingErrors.value[field] = null;

        if (!Object.keys(countries.value).length) {
            selectedCheckoutCountry.value = selectedShippingCountry.value = Object.keys(countries.value)[0];
            checkoutData.value.country = shippingData.value.country = selectedCheckoutCountry.value;
        }

        // Automatically select country if only one is available
        onMounted(() => {
            if (countries.value && Object.keys(countries.value).length === 1) {
                const onlyCountry = Object.keys(countries.value)[0];
                selectedCheckoutCountry.value = onlyCountry;
                selectedShippingCountry.value = onlyCountry;
            }
        });

        // Validation helpers
        const validationHelpers = {
            isValidFName: (name) => /^[\p{L}\s]+$/u.test(name),
            getFNameErrorMessage: (name) => !name ? 'First Name is required' : 'Name can contain only letters and spaces',
            isValidMName: (name) => /^[\p{L}\s]+$/u.test(name),
            getMNameErrorMessage: (name) => !name ? 'Middle Name is required' : 'Middle Name can contain only letters and spaces',
            isValidLName: (name) => /^[\p{L}\s]+$/u.test(name),
            getLNameErrorMessage: (name) => !name ? 'Last Name is required' : 'Last Name can contain only letters and spaces',
            isValidAddress1: (address) => /^(?=.*[a-zA-Z0-9])[\w\s.,\-#/&]*$/.test(address),
            getAddress1ErrorMessage: (address) => !address ? 'Address is required' : 'Address can contain only letters and spaces',
            isValidAddress2: (address) => /^(?=.*[a-zA-Z0-9])[\w\s.,\-#/&]*$/.test(address),
            getAddress2ErrorMessage: (address) => !address ? 'Address is required' : 'Address can contain only letters and spaces',
            isValidCompany: (company) => /^(?=.*[a-zA-Z])[\w.\-#&\s]*$/.test(company),
            getCompanyErrorMessage: (company) => !company ? 'Company Name is required' : 'Company Name can contain only letters and numbers',
            isValidCity: (city) => /^[\p{L}\s]+$/u.test(city),
            getCityErrorMessage: (city) => !city ? 'City Name is required' : 'City Name can contain only letters',
            isValidPostalCode: (code) => /^\d{5}$/.test(code),
            getPostalCodeErrorMessage: (code) => !code ? 'Postal Code is required' : !/^\d+$/.test(code) ? 'Postal Code can contain only numbers' : code.length !== 5 ? 'Postal Code must be exactly 5 digits' : '',
            isValidPhone: (phone) => /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone),
            getPhoneErrorMessage: (phone) => !phone ? 'Phone number is required' : (phone.replace(/[^0-9]/g, '').length !== 10 ? 'Phone number must be exactly 10 digits' : !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone) ? 'Phone number format is invalid. Use XXX-XXX-XXXX' : ''),
            isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            getEmailErrorMessage: (email) => !email ? 'Email is required' : 'Please enter a valid email',
        };

        // Checkout Fields
        const checkoutfields = {
            first_name: { validator: validationHelpers.isValidFName, errorMessage: validationHelpers.getFNameErrorMessage },
            middle_name: { validator: validationHelpers.isValidMName, errorMessage: validationHelpers.getMNameErrorMessage, optional: true },
            last_name: { validator: validationHelpers.isValidLName, errorMessage: validationHelpers.getLNameErrorMessage },
            address1: { validator: validationHelpers.isValidAddress1, errorMessage: validationHelpers.getAddress1ErrorMessage },
            address2: { validator: validationHelpers.isValidAddress2, errorMessage: validationHelpers.getAddress2ErrorMessage, optional: true },
            company: { validator: validationHelpers.isValidCompany, errorMessage: validationHelpers.getCompanyErrorMessage, optional: true },
            city: { validator: validationHelpers.isValidCity, errorMessage: validationHelpers.getCityErrorMessage },
            postal_code: { validator: validationHelpers.isValidPostalCode, errorMessage: validationHelpers.getPostalCodeErrorMessage },
            phone: { validator: validationHelpers.isValidPhone, errorMessage: validationHelpers.getPhoneErrorMessage },
            email: { validator: validationHelpers.isValidEmail, errorMessage: validationHelpers.getEmailErrorMessage },
        };

        // Shipping Fields
        const shippingfields = {
            first_name: { validator: validationHelpers.isValidFName, errorMessage: validationHelpers.getFNameErrorMessage },
            middle_name: { validator: validationHelpers.isValidMName, errorMessage: validationHelpers.getMNameErrorMessage, optional: true },
            last_name: { validator: validationHelpers.isValidLName, errorMessage: validationHelpers.getLNameErrorMessage },
            address1: { validator: validationHelpers.isValidAddress1, errorMessage: validationHelpers.getAddress1ErrorMessage },
            address2: { validator: validationHelpers.isValidAddress2, errorMessage: validationHelpers.getAddress2ErrorMessage, optional: true },
            company: { validator: validationHelpers.isValidCompany, errorMessage: validationHelpers.getCompanyErrorMessage, optional: true },
            city: { validator: validationHelpers.isValidCity, errorMessage: validationHelpers.getCityErrorMessage },
            postal_code: { validator: validationHelpers.isValidPostalCode, errorMessage: validationHelpers.getPostalCodeErrorMessage },
        };

        // Format USA Phone Number 
        function formatPhoneNumber() {
            let cleanedPhone = checkoutData.value.phone.replace(/[^0-9]/g, '');

            if (cleanedPhone.length > 10) {
                cleanedPhone = cleanedPhone.slice(0, 10);
            }

            if (cleanedPhone.length > 0) {
                const parts = [
                    cleanedPhone.slice(0, 3), // First 3 digits
                    cleanedPhone.slice(3, 6), // Next 3 digits
                    cleanedPhone.slice(6)     // Remaining 4 digits
                ].filter(Boolean);

                checkoutData.value.phone = parts.join('-');
            } else {
                checkoutData.value.phone = '';
            }

            if (cleanedPhone.length < 10) {
                checkoutErrors.value.phone = 'Phone number must be exactly 10 digits';
            } else {
                checkoutErrors.value.phone = '';
            }
        }

        // Validate Billing INFORMATION
        const validateCheckoutForm = () => {
            let isValid = true;
            let missingFields = [];

            // Validate each field in checkoutData
            for (const field in checkoutfields) {
                const { validator, errorMessage, optional } = checkoutfields[field];
                const value = checkoutData.value[field];
                if (!optional || value) {
                    if (!validator(value)) {
                        checkoutErrors.value[field] = errorMessage(value);
                        missingFields.push(field.replace('_', ' '));
                        isValid = false;
                    } else {
                        checkoutErrors[field] = null;
                    }
                }
            }

            // Validate country and state selections
            if (!checkoutData.value.country) {
                checkoutErrors.value.country = 'Please select a country';
                missingFields.push('country');
                isValid = false;
            }
            if (!checkoutData.value.state) {
                checkoutErrors.value.state = 'Please select a state';
                missingFields.push('state');
                isValid = false;
            }

            // Validate shipping option and accept terms
            if (!selectedShippingOption.value) {
                missingFields.push('Shipping option');
                isValid = false;
            }

            if (!acceptTerms.value) {
                checkoutErrors.value.accept_terms = 'You must accept the terms and conditions';
                isValid = false;
            }

            return isValid;
        };

        // Validate Shipping INFORMATION
        const validateShippingForm = () => {
            let isValid = true;
            let missingFields = [];

            for (const field in shippingfields) {
                const { validator, errorMessage, optional } = shippingfields[field];
                const value = shippingData.value[field];
                if (!optional || value) {
                    if (!validator(value)) {
                        shippingErrors.value[field] = errorMessage(value);
                        missingFields.push(field.replace('_', ' '));
                        isValid = false;
                    } else {
                        shippingErrors.value[field] = null;
                    }
                }
            }

            // Validate country and state selections
            if (!shippingData.value.country) {
                shippingErrors.value.country = 'Please select a country';
                missingFields.push('country');
                isValid = false;
            }
            if (!shippingData.value.state) {
                shippingErrors.value.state = 'Please select a state';
                missingFields.push('state');
                isValid = false;
            }

            return isValid;
        };

        // call validate Address API and pass payload data 
        // create product catalog responce
        function transformProductData(items) {
            const catalog = {};

            if (!items || !Array.isArray(items)) {
                return { catalog: {} };
            }

            items.forEach(item => {
                const itemId = item.item_id.toString();

                if (!catalog[itemId]) {
                    catalog[itemId] = {
                        price: item.price,
                        children: {}
                    };
                }

                if (item.children && Array.isArray(item.children)) {
                    item.children.forEach((childItem, index) => {
                        catalog[itemId].children[index] = {
                            price: childItem.price
                        };
                    });
                }
            });

            return { catalog };
        }
        const transformedProductData = computed(() => {
            return transformProductData(productData.value);
        });
        const address_validate_response = ref(null);

        const newsalesTaxAmount = ref(0);
        const checkoutAddressErrors = ref('');
        const shippingAddressErrors = ref('');

        const isAddressValid = ref(false);
        const datatypes = ref('');
        const validateAddress = async (dataType) => {
            const selectedData = dataType === 'checkout' ? checkoutData.value : shippingData.value;

            const address = {
                catalog: transformedProductData.value.catalog,
                cart: cartItems.value.map((item) => ({
                    item_id: item.item_id,
                    temp_id: item.temp_id || Date.now(),
                    options: {
                        location: item.options?.location || '',
                        logo: item.options?.logo || '',
                    },
                    gc: item.gc || false,
                    lines: item.lines || {},
                    children: Object.keys(item.children || {}).reduce((acc, childId) => {
                        acc[childId] = item.children[childId] || 0;
                        return acc;
                    }, {}),
                })),
                // Dynamically set address fields based on dataType
                address1: selectedData.address1,
                city: selectedData.city,
                state_prov: selectedData.state,
                postal_code: selectedData.postal_code,
                country: selectedData.country,
                amount: subTotal.value,
                campaign: campaign.value.short_url,
                text_type: campaign.value?.options?.tax?.tax_type,
            };

            try {
                const response = await addressStore.validateAddress(address);
                address_validate_response.value = response;

                datatypes.value = dataType;

                if (response.success == true) {
                    if (dataType === 'checkout') {  
                        checkoutAddressErrors.value = '';                      
                        if (selectedShippingOption.value = ShippingOptions.BILLING) {
                            newsalesTaxAmount.value = response?.address?.response?.totalTax || 0;
                            salesTaxAmount.value = newsalesTaxAmount.value;
                            addressStore.setSalesTaxAmount(salesTaxAmount.value);
                        }
                        initializeCheckoutDataWatcher();                        
                    } else if (dataType === 'shipping') {
                        shippingAddressErrors.value = '';
                        if (selectedShippingOption.value = ShippingOptions.ANOTHER) {
                            salesTaxAmount.value = response?.address?.response?.totalTax || 0;
                            addressStore.setSalesTaxAmount(salesTaxAmount.value);
                        }
                    }
                    isAddressValid.value = true;
                } else {
                    isAddressValid.value = false;
                    addressStore.addressErrors[selectedData.id] = {
                        address1: response.errors?.address1 || '',
                        city: response.errors?.city || '',
                        state: response.errors?.state_prov || '',
                        postal_code: response.errors?.postal_code || '',
                    };
                }
                return response;
            } catch (error) {
                let errorMessage = '';
                if (error.response?.status === 500) {
                    errorMessage = `Internal Server Error: Unable to validate ${dataType} data. Please try again later.`;
                } else {
                    errorMessage = `Unable to validate ${dataType} data. Zip code is not valid for the state.`;
                }

                if (dataType === 'checkout') {
                    checkoutAddressErrors.value = errorMessage;
                } else if (dataType === 'shipping') {
                    shippingAddressErrors.value = errorMessage;
                }
                addressStore.addressErrors[selectedData.id] = { general: errorMessage };

                isAddressValid.value = false;
                throw error;
            }
        };

        const checkoutClassError = (field) => {
            if (datatypes.value === 'checkout') {
                const checkoutErrors = addressStore.addressErrors[checkoutData.value.id] && addressStore.addressErrors[checkoutData.value.id][field];
                return checkoutErrors ? 'border-danger shadow bg-danger-subtle' : 'border-dark';
            } return 'border-dark';
        };
        const shippingClassError = (field) => {
            if (datatypes.value === 'shipping') {
                const shippingErrors = addressStore.addressErrors[shippingData.value.id] && addressStore.addressErrors[shippingData.value.id][field];
                return shippingErrors ? 'border-danger shadow bg-danger-subtle' : 'border-dark';
            }
            return 'border-dark';
        };

        const watchAddressData = (dataType, data) => {
            let timeoutId;
            watch(() => ({
                address1: data.address1,
                city: data.city,
                state_prov: data.state,
                postal_code: data.postal_code,
            }), async (newValue, oldValue) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(async () => {
                    address_validate_response.value = await validateAddress(dataType);
                }, 1000);
            }, { deep: true });
        };
        watchAddressData('checkout', checkoutData.value);
        // watchAddressData('shipping', shippingData.value);

        // ***** Address *****
        const selectedAddress = ref(null);
        const selectedAddresses = ref({});
                
        const addressList = computed(() => addressStore.addresses);
        const selectedShippingOption = ref(ShippingOptions.BILLING);

        // Select cartItems Address         
        cartItems.value.forEach((item, itemIndex) => {
            item.partItems.forEach((partItem, partIndex) => {
                const uniqueKey = `${item.item_id}-${itemIndex}-part-${partItem.itemId}-${partIndex}`;
                selectedAddresses.value[uniqueKey] = 0; // Initializing for partItems
            });

            item.keepsakeCerts.forEach((ksCert, keepsakeIndex) => {
                const uniqueKey = `${item.item_id}-${itemIndex}-ks-${ksCert.itemId}-${keepsakeIndex}`;
                selectedAddresses.value[uniqueKey] = 0; // Initializing for keepsakeCerts
            });

            item.childItems.forEach((child, childIndex) => {
                for (let i = 0; i < child.quantity; i++) {
                    const uniqueKey = `${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${i}`;
                    selectedAddresses.value[uniqueKey] = 0; // Initializing for childItems
                }
            });
        });
        
        // Store Billing as a shipping address     
        const initializeCheckoutDataWatcher = () => {
            watch(() => checkoutData.value, (newData) => {
                if (newData && Object.keys(newData).length > 0) {                
                    const firstAddress = addressStore.addresses[0];                                  
                    if (firstAddress) {                                                
                        addressStore.updateAddress(firstAddress.id, newData, newsalesTaxAmount.value)
                    } else {
                        addressStore.addAddress(newData, newsalesTaxAmount.value);                                            
                    }
                } else {
                    console.warn('No new data detected for checkoutData');
                }
            },
                { deep: true, immediate: true }
            );        
        };        
        
        //Get billing address from the list
        const firstAddress = computed(() => addressStore.addresses[0] || {});
        
        const setCheckoutData = async () => {
            if (Object.keys(firstAddress.value).length > 0) {
                Object.assign(checkoutData.value, firstAddress.value);
                selectedCheckoutCountry.value = firstAddress.value.country || '';
                selectedCheckoutState.value = firstAddress.value.state || '';

                await validateAddress('checkout');
            }
        };
        setCheckoutData();

        const selectAddress = (index, itemId) => {
            const address = addressStore.addresses[index] || 0;
            if (itemId) {
                selectedAddresses.value[itemId] = address ? address.id : 0;
            } else {
                selectedAddress.value = address ? address.id : 0;
            }
        };

        // Format Address for select Multiple address 
        const formatAddress = (address) => {
            const addressParts = [
                [address.first_name, address.middle_name, address.last_name].filter(Boolean).join(' '),
                address.company,
                address.address1,
                address.address2,
                address.city,
                address.state,
                address.postal_code,
                address.country,
                address.email,
                address.phone,
            ];
            return addressParts.filter(Boolean).join(', ');
        };

        const updateAddress = (uniqueKey, addressId) => {
            selectedAddresses.value[uniqueKey] = addressId;
            if (addressId < '0' || !addressId) {
                Errors.value[uniqueKey] = 'Please select shipping address.';
            } else {
                Errors.value[uniqueKey] = '';
            }
        };

        //Handle Shipping Change - Billing, Shipping, Multiple
        
        const handleShippingChange = async () => {
            switch (selectedShippingOption.value) {
                case ShippingOptions.BILLING:
                    try {
                        const validationResponse = await validateAddress('checkout');
                        if (!validationResponse.errors) {
                            const billingAddress = addressStore.addresses[0];
                            if (billingAddress) {
                                salesTaxAmount.value = billingAddress.salesTaxAmount;
                                addressStore.setSalesTaxAmount(billingAddress.salesTaxAmount);
                                cartItems.value.forEach(item => {
                                    // Assign to part items
                                    if (item.partItems) {
                                        item.partItems.forEach(partItem => {
                                            partItem.selectedShippingAddress = billingAddress.id;
                                        });
                                    }
                                    // Assign to keepsake certificates
                                    if (item.keepsakeCerts) {
                                        item.keepsakeCerts.forEach(ksCert => {
                                            ksCert.selectedShippingAddress = billingAddress.id;
                                        });
                                    }
                                    // Assign to child items
                                    if (item.childItems) {
                                        item.childItems.forEach(child => {
                                            if (child.quantity > 0) {
                                                child.selectedShippingAddress = billingAddress.id;
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    } catch (error) {
                        console.error('Error validating checkoutData:', error);
                    }
                    break;

                case ShippingOptions.ANOTHER:
                    try {
                        if (addressStore.addresses.length > 1) {
                            const lastAddress = addressStore.addresses[addressStore.addresses.length - 1];
                            salesTaxAmount.value = lastAddress.salesTaxAmount;
                            addressStore.setSalesTaxAmount(lastAddress.salesTaxAmount);
                            cartItems.value.forEach(item => {
                                if (item.partItems) {
                                    item.partItems.forEach(partItem => {
                                        partItem.selectedShippingAddress = lastAddress.id;
                                    });
                                }
                                if (item.keepsakeCerts) {
                                    item.keepsakeCerts.forEach(ksCert => {
                                        ksCert.selectedShippingAddress = lastAddress.id;
                                    });
                                }
                                if (item.childItems) {
                                    item.childItems.forEach(child => {
                                        if (child.quantity > 0) {
                                            child.selectedShippingAddress = lastAddress.id;
                                        }
                                    });
                                }
                            });
                        } else {
                            selectedShippingOption.value = ShippingOptions.BILLING;
                        }
                    } catch (error) {
                        console.error('Error assigning address to cart items:', error);
                    }
                    break;

                case ShippingOptions.MULTIPLE:
                    salesTaxAmount.value = multiple_address_tax.value;
                    addressStore.setSalesTaxAmount(multiple_address_tax.value);
                    break;

                default:
                    console.warn('Invalid shipping option selected');
                    break;
            }
        };

        const handleShippingModel = () => {
            const modalElement = document.getElementById('anotheraddressModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            resetShippingData();
            selectedShippingCountry.value = '';
            selectedShippingState.value = '';
            shippingAddressErrors.value = '';
            shippingErrors.value = {};
        };

        const handleMultipleShippingModel = () => {
            const multipleModalElement = document.getElementById('multipleaddressModal');
            const multipleModal = new bootstrap.Modal(multipleModalElement);
            multipleModal.show();
        };

        const isshippingAddress = ref(false);

        const shippingAddress = async () => {
            if (validateShippingForm()) {
                isshippingAddress.value = true;
                try {
                    const validationResponse = await validateAddress('shipping');

                    if (validationResponse?.success) {
                        const totalTax = validationResponse?.address?.response?.totalTax || 0;

                        const newShippingAddress = {
                            ...shippingData.value,
                            id: Date.now(), // Generate a unique ID for the address                          
                        };
                        addressStore.addAddress(newShippingAddress, totalTax);

                        selectedShippingOption.value = ShippingOptions.ANOTHER;
                        // Close the modal
                        const modalElement = document.getElementById('anotheraddressModal');
                        const modal = bootstrap.Modal.getInstance(modalElement);
                        modal.hide();

                    } else {
                        shippingAddressErrors.value = 'Shipping address validation failed. Please check your address details.';
                    }
                } catch (error) {
                    console.error('Error validating shipping address:', error);
                    shippingAddressErrors.value = 'There was an error validating the shipping address. Please try again.';
                }
                finally {
                    isshippingAddress.value = false;
                }    
            }
        };

        const multiple_address_selection = () => {
            const shipItemTo = cartItems.value.reduce((acc, item, itemIndex) => {                
                const partItemQtys = (item.partItems || []).flatMap((part, partIndex) =>
                    Array.from({ length: part.quantity || 1 }, (_, qtyIndex) => {
                        const uniqueKey = `${item.item_id}-${itemIndex}-part-${part.itemId}-${partIndex}`;                                                
                        return {
                            item_id: part.itemId,
                            item_index: qtyIndex,
                            address_id: selectedAddresses.value[uniqueKey] || null,
                        };
                    }).filter(part => part.address_id !== null)
                );

                const keepsakeCertQtys = (item.keepsakeCerts || []).flatMap((keepsake, keepsakeIndex) =>
                    Array.from({ length: keepsake.quantity || 1 }, (_, qtyIndex) => {
                        const uniqueKey = `${item.item_id}-${itemIndex}-ks-${keepsake.itemId}-${keepsakeIndex}`;
                        return {
                            item_id: keepsake.itemId,
                            item_index: qtyIndex,
                            address_id: selectedAddresses.value[uniqueKey] || null,
                        };
                    }).filter(keepsake => keepsake.address_id !== null)
                );

                const childQtys = (item.childItems || []).flatMap((child, childIndex) =>
                    Array.from({ length: child.quantity || 1 }, (_, qtyIndex) => {
                        const uniqueKey = `${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${qtyIndex}`;
                        return {
                            item_id: child.itemId,
                            item_index: qtyIndex,
                            address_id: selectedAddresses.value[uniqueKey] || null,
                        };
                    }).filter(child => child.address_id !== null)
                );

                const combinedQtys = [...partItemQtys, ...keepsakeCertQtys, ...childQtys];
                if (combinedQtys.length > 0) {
                    acc[itemIndex] = {
                        item_id: item.item_id,
                        lines: item.lines || {},
                        qtys: combinedQtys,
                        gc: item.gc || false,
                        children: Object.keys(item.children || {}).reduce((childAcc, childId) => {
                            childAcc[childId] = item.children[childId] || 0;
                            return childAcc;
                        }, {}),
                    };
                }
                return acc;
            }, {});
                
            return {
                shipItemToData: shipItemTo,
                addresses: addressStore.addresses.slice().reduce((acc, address) => {
                    acc[address.id] = {
                        address_id: address.id,
                        first_name: address.first_name || '',
                        middle_name: address.middle_name || '',
                        last_name: address.last_name || '',
                        address1: address.address1 || '',
                        address2: address.address2 || '',
                        company: address.company || '',
                        city: address.city || '',
                        country: address.country || '',
                        postal_code: address.postal_code || '',
                        state_prov: address.state || '',
                        phone: address.phone || '',
                        email: address.email || '',
                        is_validated: address.is_validated || false,
                        total_tax_rate: 0,
                        catalog: transformedProductData.value.catalog,
                        cart: cartItems.value.map((item) => ({
                            item_id: item.item_id,
                            temp_id: item.temp_id || Date.now(),
                            options: {
                                location: item.options?.location || '',
                                logo: item.options?.logo || '',
                            },
                            gc: item.gc || false,
                            lines: item.lines || {},
                            children: Object.keys(item.children || {}).reduce((acc, childId) => {
                                acc[childId] = item.children[childId] || 0;
                                return acc;
                            }, {}),
                        })),
                        amount: subTotal.value,
                        code: "",
                        companyId: "",
                        response: address_validate_response.value?.address?.response,
                        blur_event: 1
                    };
                    return acc;
                }, {}),
                campaign: campaign.value.short_url,
                billingAddr: (() => {
                    const firstAddress = addressStore.addresses[0];
                    let phone = firstAddress.phone.replace(/[^0-9]/g, '');
                    if (!firstAddress) {
                        return null;
                    }
                    return {
                        address_id: firstAddress.id,
                        first_name: firstAddress.first_name || '',
                        middle_name: firstAddress.middle_name || '',
                        last_name: firstAddress.last_name || '',
                        address1: firstAddress.address1 || '',
                        address2: firstAddress.address2 || '',
                        company: firstAddress.company || '',
                        city: firstAddress.city || '',
                        country: firstAddress.country || '',
                        postal_code: firstAddress.postal_code || '',
                        state_prov: firstAddress.state || '',
                        phone: phone || '',
                        email: firstAddress.email || '',
                        is_validated: true,
                        total_tax_rate: 0,
                        catalog: transformedProductData.value.catalog,
                        cart: cartItems.value.map((item) => ({
                            item_id: item.item_id,
                            temp_id: item.temp_id || Date.now(),
                            options: {
                                location: item.options?.location || '',
                                logo: item.options?.logo || '',
                            },
                            gc: item.gc || false,
                            lines: item.lines || {},
                            children: Object.keys(item.children || {}).reduce((acc, childId) => {
                                acc[childId] = item.children[childId] || 0;
                                return acc;
                            }, {}),
                        })),
                        amount: subTotal.value,
                        code: "",
                        companyId: "",
                        response: address_validate_response.value?.address?.response,
                        blur_event: 1
                    };
                })(),
            };
        };

        const Errors = ref({});
        const errorClass = (field) => {
            return Errors.value[field] ? 'border-danger shadow bg-danger-subtle' : 'border-dark';
        };

        //Select Multipal Address
        const multiple_address_tax = ref(0);
        const multiple_flag = ref(false);
        const isLoading = ref(false);

        const saveShippingAddresses = async () => {
            let hasErrors = false;
            cartItems.value.forEach((item, itemIndex) => {
                isLoading.value = true;
                // Save shipping addresses for part items
                (item.partItems || []).forEach((partItem, partIndex) => {
                    const uniqueKey = `${item.item_id}-${itemIndex}-part-${partItem.itemId}-${partIndex}`;
                    if (!selectedAddresses.value[uniqueKey]) {
                        Errors.value[uniqueKey] = 'Please select a shipping address.';
                        hasErrors = true;
                    } else {
                        partItem.selectedShippingAddress = selectedAddresses.value[uniqueKey];
                        Errors.value[uniqueKey] = '';
                    }
                });

                // Save shipping addresses for keepsake certificates
                (item.keepsakeCerts || []).forEach((ksCert, ksIndex) => {
                    const uniqueKey = `${item.item_id}-${itemIndex}-ks-${ksCert.itemId}-${ksIndex}`;
                    if (!selectedAddresses.value[uniqueKey]) {
                        Errors.value[uniqueKey] = 'Please select a shipping address.';
                        hasErrors = true;
                    } else {
                        ksCert.selectedShippingAddress = selectedAddresses.value[uniqueKey];
                        Errors.value[uniqueKey] = '';
                    }
                });

                // Save shipping addresses for child items                
                (item.childItems || []).forEach((child, childIndex) => {
                    if (child.quantity > 0) { 
                        const childAddresses = [];
                        Array.from({ length: child.quantity }).forEach((_, qtyIndex) => {
                            const uniqueKey = `${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${qtyIndex}`;
                            if (!selectedAddresses.value[uniqueKey] || selectedAddresses.value[uniqueKey] === '0') {
                                Errors.value[uniqueKey] = 'Please select a shipping address.';
                                hasErrors = true;
                            } else {
                                // child.selectedShippingAddress = selectedAddresses.value[uniqueKey];
                                childAddresses.push(selectedAddresses.value[uniqueKey]);
                                Errors.value[uniqueKey] = '';
                            }
                        });
                        if (childAddresses.length > 0) {
                            child.selectedShippingAddress = childAddresses;
                        }
                    }
                });
            });

            if (hasErrors) {
                console.log('Validation failed. Please fix errors before submitting.');
                isLoading.value = false;
                return;
            }

            try {
                // Replace with actual API call
                const response = await addressStore.MultipleAddress(multiple_address_selection());
                multiple_address_tax.value = response.data;
                salesTaxAmount.value = multiple_address_tax.value;

                if (response.success === true) {
                    // Close modal on successful validation            
                    const modalElement = document.getElementById('multipleaddressModal');
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
                    multiple_flag.value = true;
                    selectedShippingOption.value = ShippingOptions.MULTIPLE;
                } else {
                    selectedShippingOption.value = ShippingOptions.BILLING;
                    multiple_flag.value = false;
                }
            } catch (error) {
                console.error('Error during validation:', error);
            } finally {
                isLoading.value = false;  // Hide loader after the process is complete
            }
        };

        const handleClose = () => {
            if (multiple_flag.value) {
                selectedShippingOption.value = ShippingOptions.MULTIPLE;
            } else {
                selectedShippingOption.value = ShippingOptions.BILLING;
                const billingAddress = addressStore.addresses[0];
                salesTaxAmount.value = billingAddress.salesTaxAmount; 
            }
        };

        const countryWatcher = (selectedCountry, data, errors, state) => {
            watch(selectedCountry, (newValue) => {
                data.country = newValue;
                errors.country = newValue ? '' : 'Please select a country';
                if (newValue) state.value = '';
            });
        };

        const stateWatcher = (selectedState, data, errors) => {
            watch(selectedState, (newValue) => {
                data.state = newValue;
                errors.state = newValue ? '' : 'Please select a state';
            });
        };

        countryWatcher(selectedCheckoutCountry, checkoutData.value, checkoutErrors.value, selectedCheckoutState);
        countryWatcher(selectedShippingCountry, shippingData.value, shippingErrors.value, selectedShippingState);
        stateWatcher(selectedCheckoutState, checkoutData.value, checkoutErrors.value);
        stateWatcher(selectedShippingState, shippingData.value, shippingErrors.value);
        const prepareResponse = () => {
            const shipToValue = (() => {
                switch (selectedShippingOption.value) {
                    case ShippingOptions.BILLING:
                        return 'ship2billing';
                    case ShippingOptions.ANOTHER:
                        return 'ship2another';
                    case ShippingOptions.MULTIPLE:
                        return 'ship2multiple';
                    default:
                        return null;
                }
            })();

            const { how_you_heard, buying_as, affiliate_code ,addition_options , unlim_id_number , other_value } = cartStore.marketing;

            const shipItemTo = cartItems.value.reduce((acc, item, itemIndex) => {
                // Process part items
                const partItemQtys = (item.partItems || []).flatMap((part, partIndex) =>
                    Array.from({ length: part.quantity || 1 }, (_, qtyIndex) => {
                        const uniqueKey = `${item.item_id}-${itemIndex}-part-${part.itemId}-${partIndex}-${qtyIndex}`;
                        return {
                            item_id: part.itemId,
                            item_index: qtyIndex,
                            address_id: selectedAddresses.value[uniqueKey] || part.selectedShippingAddress || null,
                        };
                    }).filter(part => part.address_id !== null)
                );

                // Process keepsake certificates
                const keepsakeCertQtys = (item.keepsakeCerts || []).flatMap((keepsake, keepsakeIndex) =>
                    Array.from({ length: keepsake.quantity || 1 }, (_, qtyIndex) => {
                        const uniqueKey = `${item.item_id}-${itemIndex}-ks-${keepsake.itemId}-${keepsakeIndex}-${qtyIndex}`;
                        return {
                            item_id: keepsake.itemId,
                            item_index: qtyIndex,
                            address_id: selectedAddresses.value[uniqueKey] || keepsake.selectedShippingAddress || null,
                        };
                    }).filter(keepsake => keepsake.address_id !== null)
                );

                // Process child items
                const childQtys = (item.childItems || []).flatMap((child, childIndex) =>
                    Array.from({ length: child.quantity || 1 }, (_, qtyIndex) => {
                        const uniqueKey = `${item.item_id}-${itemIndex}-child-${child.itemId}-${childIndex}-${qtyIndex}`;
                        return {
                            item_id: child.itemId,
                            item_index: qtyIndex,
                            address_id: selectedAddresses.value[uniqueKey] || null,
                        };
                    }).filter(child => child.address_id !== null)
                );

                // Combine all processed quantities
                const combinedQtys = [...partItemQtys, ...keepsakeCertQtys, ...childQtys];
                
                if (combinedQtys.length > 0) {
                    acc[itemIndex] = { qtys: combinedQtys };
                }
                
                return acc;
            }, {});

            return {
                campaign: campaign.value.short_url,
                billing: (() => {
                    const firstAddress = addressStore.addresses[0];
                    let phone = firstAddress.phone.replace(/[^0-9]/g, '');
                    if (!firstAddress) {
                        return null;
                    }
                    return {
                        address_id: firstAddress.id,
                        first_name: firstAddress.first_name || '',
                        middle_name: firstAddress.middle_name || '',
                        last_name: firstAddress.last_name || '',
                        address1: firstAddress.address1 || '',
                        address2: firstAddress.address2 || '',
                        company: firstAddress.company || '',
                        city: firstAddress.city || '',
                        country: firstAddress.country || '',
                        postal_code: firstAddress.postal_code || '',
                        state_prov: firstAddress.state || '',
                        phone: phone || '',
                        email: firstAddress.email || '',
                        is_validated: true,
                        total_tax_rate: address_validate_response.value?.address?.total_tax_rate,
                        catalog: transformedProductData.value.catalog,
                        cart: cartItems.value.map((item) => ({
                            item_id: item.item_id,
                            temp_id: item.temp_id || Date.now(),
                            options: {
                                location: item.options?.location || '',
                                logo: item.options?.logo || '',
                            },
                            gc: item.gc || false,
                            lines: item.lines || {},
                            children: Object.keys(item.children || {}).reduce((acc, childId) => {
                                acc[childId] = item.children[childId] || 0;
                                return acc;
                            }, {}),
                        })),
                        amount: subTotal.value,
                        code: "",
                        companyId: "",
                        response: address_validate_response.value?.address?.response,
                        blur_event: 1
                    };
                })(),
                payment: {
                    amount: finalTotal.value,
                },
                payment_type: 'authorize',
                addresses: addressStore.addresses.slice(1).reduce((acc, address) => {
                    acc[address.id] = {
                        first_name: address.first_name || '',
                        middle_name: address.middle_name || '',
                        last_name: address.last_name || '',
                        company: address.company || '',
                        address1: address.address1 || '',
                        address2: address.address2 || '',
                        city: address.city || '',
                        state_prov: address.state || '',
                        postal_code: address.postal_code || '',
                        country: address.country || '',
                        total_tax_rate: 0,
                        address_id: address.id
                    };
                    return acc;
                }, {}),
                ship_to: shipToValue,
                promo: {
                    promo_code: promoCode.value || '',
                    promo_discount: discountAmount.value || 0,
                    promo_type: discountType || 'fixed',
                    options: [],
                },
                marketing: {
                    how_you_heard: how_you_heard || '',
                    buying_as: buying_as.length ? buying_as : [],
                    affiliate_code: affiliate_code || '',
                    addition_options : (addition_options === 'Other') ? other_value : (addition_options != null ? addition_options : ''),
                    unlim_id_number: unlim_id_number || '',
                },
                items: cartItems.value.map((item) => ({
                    item_id: item.item_id,
                    temp_id: item.temp_id || Date.now(),
                    options: {
                        location: item.options?.location || '',
                        logo: item.options?.logo || '',
                    },
                    gc: item.gc || false,
                    lines: item.lines || {},
                    children: Object.keys(item.children || {}).reduce((acc, childId) => {
                        acc[childId] = item.children[childId] || 0;
                        return acc;
                    }, {}),
                })),
                ship_item_to: shipItemTo,
                multiple_addr_shipping: multiple_address_selection().shipItemToData,
            };
        };
                
        const termsConditions = computed(() => campaignStore.termsConditions);

        const acceptTerms = ref(false);

        const acceptTermsClass = computed(() =>
            !acceptTerms.value ? 'border-danger shadow bg-danger-subtle' : ''
        );

        watch(acceptTerms, (newValue) => {
            if (newValue) {
                checkoutErrors.value.accept_terms = null;
            } else {
                checkoutErrors.value.accept_terms = 'You must accept the terms and conditions';
            }
        });
        
        const continueToPayment = async () => {
            try {
                isLoading.value = true
                await handleShippingChange()
                
                if (validateCheckoutForm()) {
                    console.log(prepareResponse() , 'prepareResponse()')
                const response = await addressStore.OrderInvoice(prepareResponse())

                if (response.success) {
                    await paymentStore.processPayment(response)
                    router.push('/payment')
                    disableBackButton()
                }
                }
            } catch (error) {
                console.error('Failed to continue to payment:', error)
            } finally {
                isLoading.value = false
            }
        };
        
        const disableBackButton = () => {
            history.pushState(null, null, location.href);

            const blockBackNavigation = () => {
                history.pushState(null, null, location.href);
            };

            window.addEventListener('popstate', blockBackNavigation);

            return () => {
                window.removeEventListener('popstate', blockBackNavigation);
            };
        };

        return {
            // CHECKOUT
            cartItems,
            subTotal,
            promoCode,
            discountAmount,
            errorMessage,
            convenienceAmount,
            salesTaxAmount,
            finalTotal,
            formatPrice,
            applyPromoCode,
            isPromoCodeAllowed,
            promoCodeClass,
            // BILLING
            shippingData,
            shippingErrors,
            errorshippingClass,
            clearshippingError,
            countries,
            checkoutData,
            checkoutErrors,
            checkoutAddressErrors,
            shippingClassError,
            checkoutClassError,
            errorCheckoutClass,
            selectedShippingOption,
            ShippingOptions,
            clearcheckoutError,
            shippingAddress,
            shippingAddressErrors,
            formatPhoneNumber,
            selectedAddress,
            selectedAddresses,
            selectAddress,
            formatAddress,
            selectedCheckoutCountry,
            selectedCheckoutState,
            selectedShippingCountry,
            selectedShippingState,
            availableCheckoutStates,
            availableShippingStates,
            validateCheckoutForm,
            validateShippingForm,
            handleShippingChange,
            addressList,
            errorClass,
            Errors,
            saveShippingAddresses,
            updateAddress,
            acceptTerms,
            acceptTermsClass,
            termsConditions,
            continueToPayment,
            address_validate_response,
            handleShippingModel,
            handleMultipleShippingModel,
            addressStore,
            isshippingAddress,
            initializeCheckoutDataWatcher,
            handleClose,
            isAddressValid,  
            isLoading,      
            isLogoAllowed,
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

.form-check-input:checked[type=checkbox] {
    --bs-form-check-bg-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-x' viewBox='0 0 16 16'%3e%3cpath d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'/%3e%3c/svg%3e");
}

.form-check-input:checked[type=radio] {
    --bs-form-check-bg-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-x' viewBox='0 0 16 16'%3e%3cpath d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'/%3e%3c/svg%3e");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.loader-container {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #cacaca;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-text {
    margin-top: 20px;
    font-size: 1rem;
    color: #333;
    text-align: center;
}

body.loading {
    overflow: hidden;
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

    .overlay-custom-text {
        font-size: 4px !important;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .no-border-end {
        border-right: none !important;
    }

    .overlay-text {
        font-size: xx-small !important;
    }

    .overlay-custom-text {
        font-size: 4px !important;
    }
}

@media (min-width: 992px) and (max-width: 1200px) {
    .overlay-text {
        font-size: 6px !important;
    }

    .overlay-custom-text {
        font-size: 8px !important;
    }
}

@media (min-width: 1201px) and (max-width: 1400px) {
    .overlay-text {
        font-size: 7px !important;
    }
}

@media (min-width: 1401px) {
    .overlay-text {
        font-size: 7px !important;
    }
}
</style>