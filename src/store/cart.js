import { defineStore } from "pinia";
import { useCampaignStore } from "@/store/campaign";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
    discountAmount: 0,
    marketing: {
      emailAssociated: "",
      donatingOption: "",
      partner_code: "",
      how_you_heard: "",
      buying_as: [],
      affiliate_code: "",
    },
  }),
  getters: {
    totalItems: (state) => state.cart.length,
    subTotal: (state) => {
      return state.cartItems.reduce((total, item) => {
        const itemTotal = parseFloat(item.productPrice) * (item.qty || 1);
        
        // Handle donation price (if `item_id === 100145`, use donationPrice)
        const donationTotal = item.item_id === 100145 ? parseFloat(item.donationPrice || 0) : 0;

        // Calculate the total for children items if any
        const childrenTotal = (item.childItems || []).reduce((sum, child) => {
          return sum + parseFloat(child.itemPrice) * (child.quantity || 0);
        }, 0);

        return total + itemTotal + childrenTotal + donationTotal;
      }, 0);
    },
    cartItems: (state) => {
      const campaignStore = useCampaignStore();
      return state.cart.map((cartItem) => {
        const product = campaignStore.productData.find(
          (product) => product.item_id === cartItem.item_id
        );

        const productImage = product?.item_image_blank
          ? `https://vortexforms.com/images/${product.item_image_blank}`
          : "https://placehold.co/200x100";

        // Map over parts
        const partItems = product?.parts
          ? Object.values(product.parts).map((part) => ({
              itemId: part.item_id,
              itemDescription: part.description || "Unknown Part",
              itemPrice: part.price || "0.00",
              itemImage: part.item_image_blank
                ? `https://vortexforms.com/images/${part.item_image_blank}`
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
                ? `https://vortexforms.com/images/${kscert.item_image_blank}`
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
              ? `https://vortexforms.com/images/${childProduct.item_image_blank}`
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

        return {
          ...cartItem,
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
        donationPrice : item.donationPrice || null,
      };
      this.cart.push(newItem);
    },

    updateMarketingData({ emailAssociated, donatingOption, partner_code , how_you_heard, buying_as, affiliate_code }) {
      if (emailAssociated) this.marketing.emailAssociated = emailAssociated;
      if (donatingOption) this.marketing.donatingOption = donatingOption;
      if (partner_code) this.marketing.partner_code = partner_code;
      if (how_you_heard) this.marketing.how_you_heard = how_you_heard;
      if (buying_as) this.marketing.buying_as = buying_as;
      if (affiliate_code) this.marketing.affiliate_code = affiliate_code;
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
        emailAssociated: "",
        donatingOption: "",
        partner_code: "",
        how_you_heard: "",
        buying_as: [],
        affiliate_code: "",
      };
    },
  },
});
