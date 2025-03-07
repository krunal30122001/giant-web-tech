// src/store/address.js
import { defineStore } from "pinia";
import { validateAddressAPI } from "@/api/addressService"; // Import your address validation API service
import { MultipleAddressInvoiceAPI } from "@/api/addressService";
import { OrderInvoiceAPI } from "@/api/addressService"; // Import your order Invoice API service

export const useAddressStore = defineStore("address", {
  state: () => ({
    addresses: [], // Array to store multiple addresses
    selectedAddressId: null, // ID of the address currently selected for shipping
    addressErrors: {}, // Object to hold validation errors for each address
    isLoading: false, // Loading state for API requests
    salesTaxAmount: 0, // Sales tax amount for the selected address
  }),

  actions: {  
    addAddress(newAddress, totalTax) {          
      // Ensure new address has a unique ID and sales tax amount
      const addressWithTax = {
          ...newAddress,
          id: Date.now(),  // Unique ID based on timestamp
          salesTaxAmount: totalTax,
      };
      this.addresses = [...this.addresses, addressWithTax];
    },  

    updateAddress(addressId, updatedAddress, totalTax) {
      // Updates an existing address by ID
      const index = this.addresses.findIndex(
        (address) => address.id === addressId
      );

      if (index !== -1) {
        const updatedAddressWithTax = {
          ...this.addresses[index],
          ...updatedAddress,
          salesTaxAmount:
            totalTax !== undefined
              ? totalTax
              : this.addresses[index].salesTaxAmount,
        };
        // Replace the old address with the updated one
        this.addresses[index] = updatedAddressWithTax;
      } else {
        console.warn(`Address with ID ${addressId} not found`);
      }
    },

    removeAddress(addressId) {
      // Removes an address by ID
      this.addresses = this.addresses.filter(
        (address) => address.id !== addressId
      );
    },

    async validateAddress(address) {
      // Validate the address using an API and update errors if validation fails
      this.isLoading = true;
      try {
        const result = await validateAddressAPI(address);
        if (result.isValid) {
          // Clear errors if address is valid
          delete this.addressErrors[address.id];
        } else {
          // Store validation errors for the address
          this.addressErrors[address.id] = result.errors;
        }
        return result;
      } catch (error) {
        console.error("Error validating address:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async MultipleAddress(multipal_address_payload) {
      // Validate the address using an API and update errors if validation fails
      this.isLoading = true;
      try {
        const result = await MultipleAddressInvoiceAPI(
          multipal_address_payload
        );

        if (
          multipal_address_payload &&
          Array.isArray(multipal_address_payload)
        ) {
          multipal_address_payload.forEach((address) => {
            if (result.isValid) {
              // Clear errors if the address is valid
              delete this.addressErrors[address.id];
            } else {
              // Store validation errors for the address
              this.addressErrors[address.id] = result.errors;
            }
          });
        }
        return result;
      } catch (error) {
        console.error("Error validating address:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async OrderInvoice(prepareResponse) {
      this.isLoading = true;
      try {
        const result = await OrderInvoiceAPI(prepareResponse); // Call the API
        if (result.success) {
          return result;
        } else {
          console.error("OrderInvoiceAPI error response:", result.errors);
          throw new Error("Failed to process order invoice");
        }
      } catch (error) {
        console.error("Error calling OrderInvoiceAPI:", error);
        throw new Error("Failed to order invoice");
      } finally {
        this.isLoading = false;
      }
    },

    setSelectedAddress(addressId) {
      // Sets the currently selected address by ID
      this.selectedAddressId = addressId;
    },

    setSalesTaxAmount(amount) {
      this.salesTaxAmount = amount;
    },
  },

  getters: {
    selectedAddress: (state) =>
      state.addresses.find((address) => address.id === state.selectedAddressId),
    addressList: (state) => state.addresses,
    getAddressErrors: (state) => (addressId) =>
      state.addressErrors[addressId] || {},
    getSalesTaxAmount: (state) => state.salesTaxAmount,
    getAddressesWithTax: (state) =>
      state.addresses.map((address) => ({
        ...address,
        salesTaxAmount: address.salesTaxAmount,
      })),
  },
});
