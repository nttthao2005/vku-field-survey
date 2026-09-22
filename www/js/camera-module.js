import {
    Camera,
    CameraResultType,
    CameraSource
} from "@capacitor/camera";

window.VKUCamera = {
    async takePhoto() {
        const photo = await Camera.getPhoto({
            quality: 80,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            saveToGallery: true
        });

        if (!photo.webPath) {
            throw new Error("Không lấy được ảnh");
        }

        const response = await fetch(photo.webPath);
        const blob = await response.blob();

        return new File(
            [blob],
            `survey-${Date.now()}.jpg`,
            {
                type: "image/jpeg"
            }
        );
    }
};