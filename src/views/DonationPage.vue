<template>
    <div class="container">
        <div class="box">
            <h2 class="text-center header-font"></h2>
            <div class="row align-items-center">
                <div class="col-md-5 d-flex justify-content-center">
                    <img :src="selectedProductImage" style="width: 100%; height: auto;" />
                </div>
                <div class="col-md-7">
                    <!-- Donation section -->
                    <div class="donation-section mt-4">
                        <h5 class="fw-bold">DONATION</h5>
                        <hr />
                        <label for="donation-amount" class="fw-bold">Select a donation amount:</label>
                        <select id="donation-amount" v-model="selectedAmount" class="form-control mt-2">
                            <option value="" disabled>-- Please select an amount --</option>
                            <option v-for="amount in donationAmounts" :key="amount" :value="amount">
                                {{ currency(amount) }}
                            </option>
                            <option value="other">Other amount</option>
                        </select>

                        <!-- Show custom amount input if "Other amount" is selected -->
                        <input v-if="selectedAmount === 'other'" v-model="customAmount" type="number" min="1" class="form-control mt-2" placeholder="Enter custom amount" @keypress="preventExponent"  />

                        <button class="btn btn-primary mt-3 w-100" @click="addToCart">Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const cartStore = useCartStore();
        const selectedAmount = ref("");
        const customAmount = ref(""); // Custom donation input
        const donationAmounts = ref([5, 10, 20, 50, 100]);
        const selectedProductImage = ref("https://frsengraving.com/armymuseum/images/donation600.png"); 
        const router = useRouter(); 

        onMounted(() => {
            selectedAmount.value = cartStore.selectedDonationAmount || "";
        });

        const addToCart = () => {
            let finalAmount = selectedAmount.value === 'other' ? parseFloat(customAmount.value) : parseFloat(selectedAmount.value);

            if (!finalAmount || finalAmount <= 0) {
                alert("Please select or enter a valid donation amount.");
                return;
            }

            const cartItem = {
                item_id: 100145,
                gc: false,
                productDescription: "DONATION",
                logo_image: selectedProductImage.value,
                donationPrice: finalAmount, 
            };

            cartStore.selectedDonationAmount = finalAmount;
            cartStore.addItem(cartItem);

            router.push('/cart');
        };

        const currency = (value) => (value ? `$${value}` : "");

        // Prevent users from entering exponent values like "1e10"
        const preventExponent = (event) => {
            if (event.key === "e" || event.key === "E" || event.key === "+" || event.key === "-") {
                event.preventDefault();
            }
        };

        return {
            selectedAmount,
            customAmount,
            donationAmounts,
            selectedProductImage,
            addToCart,
            currency,
            preventExponent, // Added this function to prevent exponent input
        };
    }
};
</script>

