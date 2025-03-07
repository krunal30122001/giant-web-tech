<template>
  <div class="container">
    <div class="box">
      <h2 class="text-center text-uppercase header-font">
        Frequently Asked Questions
      </h2>

      <div class="faq-container mt-3">
        <!-- FAQ Navigation -->
        <nav>
          <ul class="list-unstyled p-0 sub-header-font">
            <li v-for="(faqs, section, index) in groupedFaqs" :key="section" :class="[
              'd-inline-block', 'border-black', 'border-1', {
                'ps-2': index !== 0,
                'pe-2': index !== sectionsCount - 1,
                'border-end': index !== sectionsCount - 1,
                'active': currentSection === section
              }
            ]">
              <a href="#" @click.prevent="currentSection = section"
                :style="{ color: currentSection === section ? '#000' : '#616160' }">
                {{ section }}
              </a>
            </li>
          </ul>
        </nav>

        <!-- FAQ Section Content -->
        <div v-if="groupedFaqs[currentSection] && groupedFaqs[currentSection].length">
          <div class="accordion" id="faqAccordion">
            <div class="accordion-item border-0" v-for="(faq, index) in groupedFaqs[currentSection]" :key="faq.id"
              :class="{ 'border-bottom border-dark-subtle': index !== 0 }">
              <template v-if="faq.question || faq.answer">
                <h2 class="accordion-header" :id="'heading' + faq.id">
                  <button
                    class="accordion-button sub-header-font py-3 px-0 bg-transparent text-body border-0 shadow-none"
                    :class="{ collapsed: !isExpanded(faq.id) }" type="button" data-bs-toggle="collapse"
                    :data-bs-target="'#collapse' + faq.id" :aria-expanded="isExpanded(faq.id)"
                    :aria-controls="'collapse' + faq.id" @click="toggleAccordion(faq.id)">
                    <strong v-if="faq.question">{{ faq.question }}</strong>
                  </button>
                </h2>
                
                <!-- Ensure accordion-collapse is properly structured -->
                <div :id="'collapse' + faq.id" class="accordion-collapse collapse" :class="{ show: isExpanded(faq.id) }"
                  :aria-labelledby="'heading' + faq.id" data-bs-parent="#faqAccordion">
                  <div class="accordion-body border-0 py-0 px-0">
                    <p v-if="faq.answer">
                      <a v-if="index === 1 && currentSection === Object.keys(groupedFaqs)[0]" 
                        data-bs-toggle="modal" 
                        data-bs-target="#inspirationModal" 
                        class="text-dark me-1" 
                        style="cursor: pointer;">
                        Click here
                      </a>
                      <span v-html="faq.answer"></span>
                    </p>
                  </div>
                </div>

              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Inspiration Modal -->
      <div class="modal fade" id="inspirationModal" data-bs-backdrop="true" tabindex="-1"
        aria-labelledby="inspirationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" style="margin-bottom: 130px; margin-top: 130px;">
          <div class="modal-content modal-dialog-scrollable">
            <div class="modal-header">
              <button type="button" class="btn-close shadow-none border-0 no-hover" data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h2 class="text-center header-font">Inscription Examples</h2>
              <div class="text-center mt-4">
                <div class="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
                  <div class="col border-bottom border-dark" v-for="inscription in inscriptionExamples"
                    :key="inscription.inscription_title">
                    <h4>{{ inscription.inscription_title }}</h4>
                    <div v-for="product in inscription.value" :key="product.product_name">
                      <p class="m-0 fw-bold">{{ product.product_name }}</p>
                      <p v-if="!product.value">No inscription available</p>
                      <p v-else>{{ product.value }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useCampaignStore } from '@/store/campaign';
import { setHeaderFontStyles, setSubHeaderFontStyles } from '@/utils/buttonStyles';

export default {
  name: 'FAQPage',
  setup() {
    const campaignStore = useCampaignStore();
    const themeData = computed(() => campaignStore.themeData);
    const faqData = computed(() => themeData.value?.faq || []);
    const groupedFaqs = computed(() => {
      return faqData.value.reduce((groups, faq) => {
        const section = faq.section || 'General';
        if (!groups[section]) {
          groups[section] = [];
        }
        groups[section].push(faq);
        return groups;
      }, {});
    });

    const inscriptionExamples = computed(() => themeData.value ? themeData.value.inscription_examples : []);

    const currentSection = ref(null);
    const sectionsCount = computed(() => Object.keys(groupedFaqs.value).length);
    const expandedItems = ref(new Set());

    onMounted(() => {
      setHeaderFontStyles(themeData.value?.general_information);
      setSubHeaderFontStyles(themeData.value?.general_information);
      if (faqData.value.length > 0) {
        currentSection.value = Object.keys(groupedFaqs.value)[0]; // Default to the first section
      }
    });

    const toggleAccordion = (id) => {
      if (expandedItems.value.has(id)) {
        expandedItems.value.delete(id);
      } else {
        expandedItems.value.add(id);
      }
    };

    const isExpanded = (id) => expandedItems.value.has(id);

    return {
      inscriptionExamples,
      faqData,
      groupedFaqs,
      currentSection,
      sectionsCount,
      toggleAccordion,
      isExpanded,
    };
  },
};
</script>

<style scoped>
.faq-container nav a {
  text-decoration: none;
}

.faq-container nav a:hover {
  text-decoration: underline;
}

.accordion {
  --bs-accordion-bg: bg-transparent;
}

@media (max-width: 768px) {
  .box {
    margin: 0 15px;
  }
}
</style>