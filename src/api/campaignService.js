import apiClient from '@/api/apiClient'; // Adjust the path as needed
// import testData from '@/data/test.json'; // Adjust the path as needed

export async function fetchCampaignData(campaignId) {
    // if (process.env.NODE_ENV === 'development') {
    //     // Return test data directly for development
    //     console.log('Using test data from test.json');
    //     return testData;
    // }
    if (process.env.NODE_ENV === 'development') {
        // Fetch test data from public directory during development
        // console.log('Fetching test data from public/test.json');
        try {
            const response = await fetch('/test.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading test data:', error);
            throw new Error('Failed to load test data');
        }
    } else {
        try {
            const response = await apiClient.get(`/campaign/${campaignId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching campaign data:', error);
            throw new Error('Failed to fetch campaign data');
        }
    }
}

export async function uploadStory(formData) {
    try {
        const response = await apiClient.post('/story/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading story:', error);
        throw new Error('Failed to upload story');
    }
}

import axios from 'axios';

// Export async promocode function
export async function fetchPromoCodeData(code,campaing_name) {
    try {
        const response = await axios.get('https://vortexforms.com/api/promocode', {
            params: { code, campaing_name },
        });
        return response.data; // Return the promo data
    } catch (error) {
        // console.error('Error in promo code apply:', error);
        throw new Error('Failed to apply promo code');
    }
}

export async function checkCode(checkCode) {
    try {
        const response = await axios.post('https://vortexforms.com/api/check-code', { code: checkCode });
        return response.data;
    } catch (error) {
        console.error('Error checking code:', error);
        throw new Error('Failed to verify the code');
    }
}