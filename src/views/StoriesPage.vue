<template>
    <div class="container" v-if="storiesData">
        <div class="box">
            <h2 class="text-center text-uppercase header-font">{{ storiesData.page_title }}</h2>

            <form @submit.prevent="StoryForm">
                <div class="form-group row pt-2">
                    <div class="col-lg-3 col-12 m-0 align-self-center">
                        <label class="fw-bold" for="first_name"><span class="text-danger">*</span> First Name</label>
                        <input id="first_name" v-model="formData.first_name" type="text" name="first_name"
                            autocomplete="given-name"
                            :class="['form-control', 'rounded-0', 'bg-transparent', errorClass('first_name')]"
                            placeholder="First Name" @input="clearError('first_name')" />
                        <p class="error-m mt-1" v-if="errors.first_name">{{ errors.first_name }}</p>

                        <label class="mt-2 fw-bold" for="last_name"><span class="text-danger">*</span> Last Name</label>
                        <input id="last_name" v-model="formData.last_name" type="text" name="last_name"
                            autocomplete="family-name"
                            :class="['form-control', 'rounded-0', 'bg-transparent', errorClass('last_name')]"
                            placeholder="Last Name" @input="clearError('last_name')" />
                        <p class="error-m mt-1" v-if="errors.last_name">{{ errors.last_name }}</p>

                        <label class="mt-2 fw-bold" for="phone"><span class="text-danger">*</span> Phone Number</label>
                        <input id="phone" v-model="formData.phone" type="text" name="phone" autocomplete="tel"
                            :class="['form-control', 'rounded-0', 'bg-transparent', errorClass('phone')]"
                            placeholder="Phone Number" @input="formatPhoneNumber" maxlength="14" />
                        <p class="error-m mt-1" v-if="errors.phone">{{ errors.phone }}</p>

                        <label class="mt-2 fw-bold" for="email"><span class="text-danger">*</span> Email Address</label>
                        <input id="email" v-model="formData.email" type="email" name="email" autocomplete="email"
                            :class="['form-control', 'rounded-0', 'bg-transparent', errorClass('email')]"
                            placeholder="Email Address" @input="clearError('email')" />
                        <p class="error-m mt-1" v-if="errors.email">{{ errors.email }}</p>
                    </div>

                    <div class="story-text col-lg-9 col-12 m-0">
                        <label class="fw-bold" for="description">{{ storiesData.story_1_header }}</label>
                        <textarea id="description" v-model="formData.description" name="description" autocomplete="off"
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
                        <button type="button" class="btn" @click="openFileDialog">Upload Photo</button>
                        <input ref="fileInput" type="file" id="customFile" @change="handleFileUpload"
                            accept=".png, .jpg, .gif" style="display: none;" />
                        <label class="custom-file-label ps-2 pb-3 text-break" for="customFile">{{ fileName }}</label>
                        <p class="error-m mt-1" v-if="errors.image">{{ errors.image }}</p>
                    </div>
                    <div class="col-md-6 col-sm-6 col-12 text-end">
                        <button type="submit" class="btn" :disabled="isStoryUploading">
                            <span v-if="isStoryUploading" class="spinner-border spinner-border-sm" role="status"
                                aria-hidden="true"></span>
                            <span v-if="!isStoryUploading">Submit Story</span>
                            <span v-if="isStoryUploading" class="ps-2">Loading...</span>
                        </button>
                        <p v-if="visible" :class="{ 'text-success': !isError, 'text-danger': isError }">{{ statusMessage
                        }}</p>
                    </div>
                </div>
            </form>

            <div class="mt-4 pb-4 border-bottom border-dark" v-if="storiesData.stories_data.length > 0">
                <div class="text-center d-flex align-items-center">
                    <div class="line me-3"></div>
                    <h2 class="header-font">Featured Stories</h2>
                    <div class="line ms-3"></div>
                </div>
                <div class="row">
                    <div class="col-md-4 col-12 p-3" v-for="(story, index) in storiesData.stories_data" :key="index">
                        <h3 class="sub-header-font">{{ story.stories_lable }}</h3>
                        <img v-if="story.stories_image" :src="story.stories_image" class="img-fluid mt-2 w-100"
                            style="height: 250px;" />
                        <p class="pt-3 text-break" v-html="story.stories_descriptions"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useCampaignStore } from '@/store/campaign';
import { setButtonStyles, setHeaderFontStyles, setSubHeaderFontStyles } from '@/utils/buttonStyles';

export default {
    name: 'Stories',
    setup() {
        const campaignStore = useCampaignStore();
        const themeData = computed(() => campaignStore.themeData);
        const storiesData = computed(() => themeData.value?.stories || {});
        const campaign = computed(() => campaignStore.campaign);
        const isStoryUploading = computed(() => campaignStore.isStoryUploading);

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

        onMounted(() => {
            setButtonStyles(themeData.value?.general_information);
            setHeaderFontStyles(themeData.value?.general_information);
            setSubHeaderFontStyles(themeData.value?.general_information);
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

            // // Validate File Upload
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

        return {
            storiesData,
            isStoryUploading,
            formData,
            selectedFile,
            fileName,
            statusMessage,
            isError,
            visible,
            errors,
            openFileDialog,
            handleFileUpload,
            clearError,
            errorClass,
            StoryForm,
            formatPhoneNumber,
        };
    },
};
</script>

<style scoped>
.form-control {
    font-size: 15px;
}

input:focus,
textarea:focus {
    outline: none;
    box-shadow: 0 0 5px 2px rgba(93, 93, 93, 0.5);
}

.line {
    flex: 1;
    height: 1px;
    background-color: #000;
}

img {
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.25);
}

@media (max-width: 992px) {

    .box {
        margin: 0 15px;
    }

    .story-text {
        padding-top: 8px !important;
    }
}

@media (max-width: 576px) {

    .btn {
        width: 100%;
    }
}
</style>