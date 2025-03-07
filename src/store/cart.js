import { defineStore } from "pinia";
import { useCampaignStore } from "@/store/campaign";
import StaticProductJson from "./staticProduct.json";
export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
    discountAmount: 0,
    marketing: {
      how_you_heard: "",
      buying_as: [],
      affiliate_code: "",
      addition_options: "",
      unlim_id_number: "",
      other_value: "",
    },
  }),
  getters: {
    totalItems: (state) => state.cart.length,
    subTotal: (state) => {
      return state.cartItems.reduce((total, item) => {
        // Check if item_id exists in children with a nonzero quantity
        const hasMatchingChild = item.children?.[item.item_id] > 0;

        // If there's a matching child, set qty to 0; otherwise, default to 1
        const itemQty = hasMatchingChild ? 0 : item.qty || 1;
        const itemTotal = parseFloat(item.productPrice) * itemQty;

        // Calculate the total for children items
        const childrenTotal = (item.childItems || []).reduce((sum, child) => {
          return sum + parseFloat(child.itemPrice) * (child.quantity || 0);
        }, 0);

        return total + itemTotal + childrenTotal;
      }, 0);
    },

    // subTotal: (state) => {
    //   return state.cartItems.reduce((total, item) => {
    //     const itemTotal = parseFloat(item.productPrice) * (item.qty || 1);

    //     // Calculate the total for children items if any
    //     const childrenTotal = (item.childItems || []).reduce((sum, child) => {
    //       return sum + parseFloat(child.itemPrice) * (child.quantity || 0);
    //     }, 0);

    //     return total + itemTotal + childrenTotal;
    //   }, 0);
    // },
    cartItems: (state) => {
      const campaignStore = useCampaignStore();
      return state.cart.map((cartItem) => {
        // console.log(cartItem, "cartItem");
        const dynamicProducts = [
          ...campaignStore.productData,
          ...StaticProductJson,
        ];
        const product = dynamicProducts?.find(
          (product) => product.item_id === cartItem.item_id
        );

        const productImage = product?.item_image_blank
          ? `https://forms.bricksrus.tech/images/${product.item_image_blank}`
          : "https://placehold.co/200x100";

        // Map over parts
        const partItems = product?.parts
          ? Object.values(product.parts).map((part) => ({
              itemId: part.item_id,
              itemDescription: part.description || "Unknown Part",
              itemPrice: part.price || "0.00",
              itemImage: part.item_image_blank
                ? `https://forms.bricksrus.tech/images/${part.item_image_blank}`
                : "https://placehold.co/100x100",
            }))
          : [];

        // Map over kscerts
        const keepsakeCerts = product?.kscerts
          ? Object.values(product.kscerts).map((kscert) => ({
              itemId: kscert.item_id,
              itemDescription:
                kscert.description || "Unknown Keepsake Certificate",
              itemPrice: kscert.price || "0.00",
              itemImage: kscert.item_image_blank
                ? `https://forms.bricksrus.tech/images/${kscert.item_image_blank}`
                : "https://placehold.co/100x100",
            }))
          : [];

        // Map over children
        const childItems = Object.entries(cartItem.children || {}).map(
          ([childId, quantity]) => {
            const childProduct = product?.children?.find(
              (child) => child.item_id === parseInt(childId)
            );

            const childImage = childProduct?.item_image_blank
              ? `https://forms.bricksrus.tech/images/${childProduct.item_image_blank}`
              : "https://placehold.co/100x100";

            return {
              itemId: childProduct ? childProduct.item_id : childId,
              itemDescription: childProduct
                ? childProduct.description
                : "Unknown Child Product",
              itemPrice: childProduct ? childProduct.price : "0.00",
              itemImage: childImage,
              quantity: quantity,
              selectedShippingAddress: null,
            };
          }
        );

        // Check if cartItem.item_id exists as a key in children and has a nonzero quantity
        const hasMatchingChild = cartItem.children
          ? cartItem.children[cartItem.item_id] > 0
          : false;

        return {
          ...cartItem,
          qty: hasMatchingChild ? 0 : cartItem.qty, // Set qty to 0 if matching child exists
          productImage,
          max_lines: product ? product.max_lines : 0,
          productDescription: product ? product.description : "Unknown Product",
          productPrice: product ? product.price : "0.00",
          partItems,
          keepsakeCerts,
          childItems,
        };
      });
    },
  },
  actions: {
    setDiscountAmount(amount) {
      this.discountAmount = amount;
    },

    getProductData(itemId) {
      const campaignStore = useCampaignStore();
      return campaignStore.products.find(
        (product) => product.item_id === itemId
      );
    },

    addItem(item) {
      const newItem = {
        item_id: item.item_id,
        temp_id: Date.now(),
        qty: 1,
        options: item.options || {},
        logo_image: item.logo_image || null,
        max_characters: item.max_characters || null,
        gc: item.gc || false,
        lines: item.lines || {},
        children: item.children || {},
      };
      this.cart.push(newItem);
    },

    updateMarketingData({
      how_you_heard,
      buying_as,
      affiliate_code,
      addition_options,
      unlim_id_number,
      other_value,
    }) {
      if (how_you_heard) this.marketing.how_you_heard = how_you_heard;
      if (buying_as) this.marketing.buying_as = buying_as;
      if (affiliate_code) this.marketing.affiliate_code = affiliate_code;
      if (addition_options) this.marketing.addition_options = addition_options;
      if (unlim_id_number) this.marketing.unlim_id_number = unlim_id_number;
      if (other_value) this.marketing.other_value = other_value;
    },

    updateItemQuantity(temp_id, quantity) {
      const item = this.cart.find((item) => item.temp_id === temp_id);
      if (item) {
        item.qty = Math.max(quantity, 0);
      }
    },

    updateItem(temp_id, updatedData) {
      const index = this.cart.findIndex((item) => item.temp_id === temp_id);
      if (index !== -1) {
        this.cart[index] = {
          ...this.cart[index],
          ...updatedData,
        };
      }
    },

    removeItem(temp_id) {
      this.cart = this.cart.filter((item) => item.temp_id !== temp_id);
    },

    updateChildQuantity(temp_id, childId, quantity) {
      const item = this.cart.find((item) => item.temp_id === temp_id);
      if (item && item.children) {
        item.children[childId] = Math.max(quantity, 0);
      }
    },
    updateChildShippingAddress(temp_id, childId, address) {
      const item = this.cart.find((item) => item.temp_id === temp_id);
      if (item) {
        const child = item.childItems.find((child) => child.itemId === childId);
        if (child) {
          child.selectedShippingAddress = address;
        }
      }
    },

    clearCart() {
      this.cart = [];
      this.discountAmount = 0;
      this.marketing = {
        how_you_heard: "",
        buying_as: [],
        affiliate_code: "",
        addition_options: "",
        unlim_id_number: "",
        other_value: "",
      };
    },
  },
});
