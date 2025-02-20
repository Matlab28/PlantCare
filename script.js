 {
        "imports": {
            "@google/generative-ai": "https://esm.run/@google/generative-ai"
        }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

    const API_KEY = "AIzaSyB3GRRnXnOsnRJOhPpLQtWvKf4Bs1Hx-nU";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    const startCameraButton = document.getElementById('startCameraButton');
    const takePictureButton = document.getElementById('takePictureButton');
    const cameraOutput = document.getElementById('cameraOutput');

    startCameraButton.addEventListener('click', async () => {
        const constraints = { video: { facingMode: 'environment' } };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    });

    function handleSuccess(stream) {
        startCameraButton.style.display = 'none';
        takePictureButton.style.display = 'block';
        cameraOutput.style.display = 'block';
        cameraOutput.srcObject = stream;
    }

    takePictureButton.addEventListener('click', async () => {
        try {
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.style.display = 'flex';

            const plantImage = await takePlantPicture(cameraOutput);
            const plantInfo = await recognizePlant(plantImage);
            displayPlantInfo(plantInfo);
        } catch (error) {
            console.error('Error recognizing plant:', error);
            displayPlantInfo('Error recognizing plant.');
        } finally {
            loadingOverlay.style.display = 'none';
        }
    });

    async function takePlantPicture(videoElement) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/png');

        return imageData;
    }

    async function recognizePlant(imageData) {
        const result = await model.generateContent('Recognize plant information');
        const response = await result.response;
        const text = await response.text();

        return text;
    }

    function displayPlantInfo(info) {
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.style.display = 'block';
    
    const cleanedInfo = info.replace(/\*/g, '');
    
    responseContainer.innerText = cleanedInfo || 'No information available.';
}
