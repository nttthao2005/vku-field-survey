const surveyForm = document.getElementById("surveyForm");
const surveyTime = document.getElementById("surveyTime");
const locationBtn = document.getElementById("locationBtn");
const locationStatus = document.getElementById("locationStatus");
const surveyList = document.getElementById("surveyList");
const networkStatus =
    document.getElementById("networkStatus");
let currentLocation = null;


// ===============================
// LẤY THỜI GIAN
// ===============================

function getCurrentTime() {

    const now = new Date();

    return now.toLocaleString("vi-VN");

}

surveyTime.value = getCurrentTime();


// ===============================
// LẤY LOCATION
// ===============================

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        locationStatus.textContent =
            "❌ Trình duyệt không hỗ trợ GPS";

        return;
    }

    locationStatus.textContent =
        "📍 Đang lấy vị trí...";

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            currentLocation = {
                latitude,
                longitude
            };

            locationStatus.textContent =
                `✅ ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        },

        (error) => {

            console.error(error);

            locationStatus.textContent =
                "❌ Không thể lấy vị trí";

        }

    );

});


// ===============================
// LƯU PHIÊN
// ===============================

surveyForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const interviewer =
        document.getElementById("interviewer").value;

    const major =
        document.getElementById("major").value;
const jobDemand =
    document.getElementById("jobDemand").value;
const jobType =
    document.getElementById("jobType").value;
const expectedSalary =
    document.getElementById("expectedSalary").value;

const experience =
    document.getElementById("experience").value;

const availableTime =
    document.getElementById("availableTime").value;

const imageInput =
    document.getElementById("image");
const imageFile = imageInput.files[0];

const session = {

    id: "SUR-" + Date.now(),

    interviewer: interviewer,

    time: getCurrentTime(),

    location: currentLocation,

    major: major,

jobDemand: jobDemand,
jobType: jobType,
expectedSalary: expectedSalary,

experience: experience,

availableTime: availableTime,

image: imageFile || null,

    syncStatus: "pending"

};
    saveSurvey(session)
.then(async () => {

    alert("✅ Đã lưu phiên khảo sát!");

    surveyForm.reset();

    surveyTime.value = getCurrentTime();

    currentLocation = null;

    locationStatus.textContent =
        "Chưa lấy vị trí";

    await loadSurveys();

    // Nếu đang Online thì tự động đồng bộ
    if (navigator.onLine) {

    console.log("Đang Online → bắt đầu đồng bộ...");

    await syncPendingSurveys();

}

})
    .catch((error) => {

        console.error(error);

        alert("❌ Không thể lưu phiên khảo sát!");

    });


});

// ===============================
// HIỂN THỊ LỊCH SỬ
// ===============================

function loadSurveys() {

    getAllSurveys()
        .then((surveys) => {

            if (surveys.length === 0) {

                surveyList.innerHTML =
                    "<p>Chưa có phiên khảo sát nào.</p>";

                return;

            }

            surveyList.innerHTML = "";

            surveys.reverse().forEach((survey) => {

                const item =
                    document.createElement("div");

                item.className = "survey-item";

                const locationText =
                    survey.location
                        ? `${survey.location.latitude.toFixed(6)}, ${survey.location.longitude.toFixed(6)}`
                        : "Chưa lấy vị trí";

               item.innerHTML = `
    <h3>${survey.id}</h3>

    <p>
        👤 ${survey.interviewer}
    </p>

    <p>
        🕐 ${survey.time}
    </p>

    <p>
        📍 ${locationText}
    </p>

    <p>
        🎓 ${survey.major}
    </p>

    <p>
    📝 ${survey.jobDemand}
</p>
<p>
    💼 Loại công việc:
    ${survey.jobType || "Chưa chọn"}
</p>
<p>
    💰 Mức lương mong muốn:
    ${survey.expectedSalary || "Chưa chọn"}
</p>

<p>
    💼 Kinh nghiệm:
    ${survey.experience || "Chưa chọn"}
</p>

<p>
    🕐 Có thể bắt đầu:
    ${survey.availableTime || "Chưa chọn"}
</p>
    ${
        survey.image
            ? `
                <div class="survey-image">
                    <p>📷 Ảnh hiện trường:</p>
                    <img
                        src="${URL.createObjectURL(survey.image)}"
                        alt="Ảnh hiện trường"
                    >
                </div>
            `
            : `
                <p>📷 Chưa có ảnh</p>
            `
    }

    <p>
    ${getSyncStatusText(survey.syncStatus)}
</p>
`;

                surveyList.appendChild(item);

            });

        })
        .catch((error) => {

            console.error(
                "Lỗi khi tải dữ liệu:",
                error
            );

        });

}


// ===============================
// TẢI DỮ LIỆU KHI MỞ WEBSITE
// ===============================

loadSurveys();

// ===============================
// KIỂM TRA TRẠNG THÁI MẠNG
// ===============================

function updateNetworkStatus() {

    if (navigator.onLine) {

        networkStatus.textContent =
            "🟢 Online";

        networkStatus.classList.remove("offline");

    } else {

        networkStatus.textContent =
            "🔴 Offline - Dữ liệu sẽ được lưu trên thiết bị";

        networkStatus.classList.add("offline");

    }

}


// Khi mở website
updateNetworkStatus();


// Khi có mạng trở lại
window.addEventListener("online", () => {
    updateNetworkStatus();

    console.log("Internet đã kết nối lại");

    syncPendingSurveys();
});


// Khi mất mạng
window.addEventListener("offline", () => {

    updateNetworkStatus();

    console.log("Đã mất Internet");

});


// ===============================
// TRẠNG THÁI ĐỒNG BỘ
// ===============================

function getSyncStatusText(status) {

    switch (status) {

        case "pending":
            return "🟠 Chờ đồng bộ";

        case "syncing":
            return "🔄 Đang đồng bộ";

        case "synced":
            return "🟢 Đã đồng bộ";

        case "error":
            return "❌ Đồng bộ lỗi";

        default:
            return "🟠 Chờ đồng bộ";

    }

}
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtcOSUvNNptnStvQ5akvV3KCVJ5msTpWSpCs2n8e8pGDFpYXafljblDvd2O1GdospBKQ/exec";

async function testGoogleSheetConnection() {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
    sessionId: "TEST-" + Date.now(),
    interviewer: "Test",
    time: new Date().toLocaleString("vi-VN"),
    latitude: "16.04433",
    longitude: "108.24645",
    major: "Công nghệ thông tin",
    jobDemand: "Test kết nối Google Sheets",
    expectedSalary: "7-10 triệu",
    experience: "Chưa có kinh nghiệm",
    availableTime: "Ngay lập tức",
    image: "",
    syncStatus: "synced"
            })
        });

        const result = await response.json();

        console.log("Kết quả Google Sheets:", result);

    } catch (error) {
        console.error("Lỗi kết nối Google Sheets:", error);
    }
}

//testGoogleSheetConnection();

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

                const canvas = document.createElement("canvas");

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

        // Nếu survey có ảnh
        if (survey.image) {

    console.log("Đang nén ảnh:", survey.id);

    const originalSize =
        survey.image.size;

    const compressedImage =
        await compressImage(survey.image);

    console.log(
        "Ảnh gốc:",
        Math.round(originalSize / 1024),
        "KB"
    );

    console.log(
        "Ảnh sau nén:",
        Math.round(compressedImage.size / 1024),
        "KB"
    );

    imageType = "image/jpeg";

    imageName =
        `survey-${survey.id}.jpg`;

    imageData =
        await blobToBase64(compressedImage);
}

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({

                sessionId: survey.id,
                interviewer: survey.interviewer,
                time: survey.time,

                latitude: survey.location
                    ? survey.location.latitude
                    : "",

                longitude: survey.location
                    ? survey.location.longitude
                    : "",

                major: survey.major,
jobDemand: survey.jobDemand,
jobType: survey.jobType,
expectedSalary: survey.expectedSalary,
experience: survey.experience,
availableTime: survey.availableTime,

image: imageName,
                imageData: imageData,
                imageType: imageType,

                syncStatus: "synced"
            })
        });

        const result = await response.json();

        console.log("Kết quả đồng bộ:", result);

        if (result.success) {

            survey.syncStatus = "synced";

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

    const surveys = await getAllSurveys();

    // Khôi phục các phiếu bị kẹt ở trạng thái syncing
    for (const survey of surveys) {

        if (survey.syncStatus === "syncing") {

            console.log(
                "Khôi phục phiếu bị kẹt:",
                survey.id
            );

            survey.syncStatus = "pending";

            await saveSurvey(survey);
        }
    }

    const updatedSurveys = await getAllSurveys();

    const pendingSurveys = updatedSurveys.filter(
        survey => survey.syncStatus === "pending"
    );

    if (pendingSurveys.length === 0) {

        console.log(
            "Không có dữ liệu cần đồng bộ."
        );

        await loadSurveys();

        return;
    }

    console.log(
        `Có ${pendingSurveys.length} phiên khảo sát cần đồng bộ.`
    );

    for (const survey of pendingSurveys) {

        survey.syncStatus = "syncing";

        await saveSurvey(survey);

        await loadSurveys();

        const success =
            await syncSurvey(survey);

        // Nếu đồng bộ thất bại
        if (!success) {

            survey.syncStatus = "pending";

            await saveSurvey(survey);

            console.log(
                "Đồng bộ thất bại, giữ lại để thử lại:",
                survey.id
            );
        }
    }

    await loadSurveys();
}