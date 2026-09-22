const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxtcOSUvNNptnStvQ5akvV3KCVJ5msTpWSpCs2n8e8pGDFpYXafljblDvd2O1GdospBKQ/exec";


function compressImage(file) {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = (event) => {

            const img = new Image();

            img.onload = () => {

                const maxWidth = 1200;
                const maxHeight = 1200;

                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {

                    const ratio = Math.min(
                        maxWidth / width,
                        maxHeight / height
                    );

                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas =
                    document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );

                canvas.toBlob(
                    (blob) => {

                        if (!blob) {
                            reject(
                                new Error("Không thể nén ảnh")
                            );
                            return;
                        }

                        resolve(blob);
                    },
                    "image/jpeg",
                    0.75
                );
            };

            img.onerror = () => {
                reject(
                    new Error("Không thể đọc ảnh")
                );
            };

            img.src = event.target.result;
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsDataURL(file);
    });
}


function blobToBase64(blob) {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            const base64 =
                reader.result.split(",")[1];

            resolve(base64);
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsDataURL(blob);
    });
}


async function syncSurvey(survey) {

    try {

        let imageData = "";
        let imageType = "";
        let imageName = "";

        if (survey.image) {

            console.log(
                "Đang nén ảnh:",
                survey.id
            );

            const compressedImage =
                await compressImage(survey.image);

            imageType = "image/jpeg";

            imageName =
                `survey-${survey.id}.jpg`;

            imageData =
                await blobToBase64(compressedImage);
        }

        const response =
            await fetch(GOOGLE_SCRIPT_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({

                    sessionId: survey.id,

                    interviewer:
                        survey.interviewer,

                    time:
                        survey.time,

                    latitude:
                        survey.location
                            ? survey.location.latitude
                            : "",

                    longitude:
                        survey.location
                            ? survey.location.longitude
                            : "",

                    major:
                        survey.major,

                    jobDemand:
                        survey.jobDemand,

                    jobType:
                        survey.jobType,

                    expectedSalary:
                        survey.expectedSalary,

                    experience:
                        survey.experience,

                    availableTime:
                        survey.availableTime,

                    image:
                        imageName,

                    imageData:
                        imageData,

                    imageType:
                        imageType,

                    syncStatus:
                        "synced"
                })
            });

        const result =
            await response.json();

        console.log(
            "Kết quả đồng bộ:",
            result
        );

        if (result.success) {

            survey.syncStatus =
                "synced";

            await saveSurvey(survey);

            console.log(
                "Đã đồng bộ:",
                survey.id
            );

            return true;
        }

        return false;

    } catch (error) {

        console.error(
            "Lỗi đồng bộ:",
            survey.id,
            error
        );

        return false;
    }
}


async function syncPendingSurveys() {

    if (!navigator.onLine) {
        return;
    }

    const surveys =
        await getAllSurveys();

    for (const survey of surveys) {

        if (
            survey.syncStatus ===
            "syncing"
        ) {

            console.log(
                "Khôi phục phiếu bị kẹt:",
                survey.id
            );

            survey.syncStatus =
                "pending";

            await saveSurvey(survey);
        }
    }

    const updatedSurveys =
        await getAllSurveys();

    const pendingSurveys =
        updatedSurveys.filter(
            survey =>
                survey.syncStatus ===
                "pending"
        );

    if (
        pendingSurveys.length ===
        0
    ) {

        console.log(
            "Không có dữ liệu cần đồng bộ."
        );

        return;
    }

    console.log(
        `Có ${pendingSurveys.length} phiên khảo sát cần đồng bộ.`
    );

    for (
        const survey
        of pendingSurveys
    ) {

        survey.syncStatus =
            "syncing";

        await saveSurvey(survey);

        const success =
            await syncSurvey(survey);

        if (!success) {

            survey.syncStatus =
                "pending";

            await saveSurvey(survey);

            console.log(
                "Đồng bộ thất bại, giữ lại để thử lại:",
                survey.id
            );
        }
    }
}