import { defineStore } from "pinia";

export const usePaymentStore = defineStore("paymentStore", {
  state: () => ({
    paymentData: null,
    orderDetails: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    async processPayment(response) {
      console.log("Processing payment response:", response);
      if (response.success) {
        try {
          this.isLoading = true;

          // Store response data
          this.paymentData = response.quantum;
          this.orderDetails = {
            orderId: response.order,
            IP: response.ip,
            Key: response.key,
            paymentUrl: response.quantum.payment,
            refreshUrl: response.quantum.refresh,
            approvedUrl: response.quantum.approved,
            declinedUrl: response.quantum.declined,
          };
        } catch (error) {
          console.error("Error processing payment:", error);
          this.error = error.message || "Failed to process payment";
        } finally {
          this.isLoading = false;
        }
      } else {
        this.error = response.key || "Payment failed";
        console.error("Error in payment response:", this.error);
      }
    },
  },
});
