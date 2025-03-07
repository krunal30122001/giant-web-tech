import apiClient from '@/api/apiClient'; // Adjust the path as needed

// Validate a single address using the API
export async function validateAddressAPI(address) {
    try {
        const response = await apiClient.post('/address/validate', address);
        return response.data; // Expected response should contain validation status and errors if any
    } catch (error) {
        console.error('Error validating address:', error);
        throw new Error('Failed to validate address');
    }
}

export async function OrderInvoiceAPI(prepareResponse) {
    try {
        const response = await apiClient.post('/order/invoice/avalara', prepareResponse);
        // const response = await apiClient.post('/order/invoicefree', prepareResponse);
        return response.data; // Return the response data
    } catch (error) {
        if (error.response) {
            console.error('Backend returned error:', error.response.data);
        } else {
            console.error('Error in OrderInvoiceAPI:', error.message);
        }
        throw new Error('Failed to order invoice');
    }
}

export async function MultipleAddressInvoiceAPI(multipal_address_payload) {
    try {
      const response = await apiClient.post(
        "/get-avalara-tax",
        multipal_address_payload
      );
      // const response = await apiClient.post('/order/invoicefree');
      return response.data; // Return the response data
    } catch (error) {
      if (error.response) {
        console.error("Backend returned error:", error.response.data);
      } else {
        console.error("Error in OrderInvoiceAPI:", error.message);
      }
      throw new Error("Failed to multiple address invoice");
    }
  }


