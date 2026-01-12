
const API_URL = 'https://omgy-innovate.hf.space';

/**
 * Uploads an image file for coronary stenosis detection.
 * @param {File} file - The image file to analyze
 * @returns {Promise<Object>} - The JSON response from the API
 */
export async function analyzeImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                // 'Content-Type': 'multipart/form-data' is NOT set manually to let browser set boundary
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
}
