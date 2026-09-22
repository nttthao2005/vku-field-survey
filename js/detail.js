const params = new URLSearchParams(window.location.search);
const surveyId = params.get("id");

const detailContainer = document.getElementById("surveyDetail");

async function loadSurveyDetail() {

    if (!surveyId) {
        detailContainer.innerHTML = `
            <p>❌ Không tìm thấy mã phiếu khảo sát.</p>
        `;
        return;
    }

    try {
        const surveys = await getAllSurveys();

        const survey = surveys.find(
            (item) => item.id === surveyId
        );

        if (!survey) {
            detailContainer.innerHTML = `
                <p>❌ Không tìm thấy phiếu: ${surveyId}</p>
            `;
            return;
        }

        const locationText = survey.location
            ? `${survey.location.latitude.toFixed(6)}, ${survey.location.longitude.toFixed(6)}`
            : "Chưa lấy vị trí";

        const imageHtml = survey.image
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
            `;

        detailContainer.innerHTML = `
            <div class="survey-detail">

                <h3>${survey.id}</h3>

                <p>
                    👤 <strong>Người phỏng vấn:</strong>
                    ${survey.interviewer}
                </p>

                <p>
                    🕐 <strong>Thời gian:</strong>
                    ${survey.time}
                </p>

                <p>
                    📍 <strong>Vị trí:</strong>
                    ${locationText}
                </p>

                <p>
                    🎓 <strong>Chuyên ngành:</strong>
                    ${survey.major}
                </p>

                <p>
                    📝 <strong>Nhu cầu việc làm:</strong>
                    ${survey.jobDemand}
                </p>

                <p>
                    💼 <strong>Loại công việc:</strong>
                    ${survey.jobType || "Chưa chọn"}
                </p>

                <p>
                    💰 <strong>Mức lương mong muốn:</strong>
                    ${survey.expectedSalary || "Chưa chọn"}
                </p>

                <p>
                    💼 <strong>Kinh nghiệm:</strong>
                    ${survey.experience || "Chưa chọn"}
                </p>

                <p>
                    🕐 <strong>Có thể bắt đầu:</strong>
                    ${survey.availableTime || "Chưa chọn"}
                </p>

                <p>
                    <strong>Trạng thái đồng bộ:</strong>
                    ${getSyncStatusText(survey.syncStatus)}
                </p>

                ${imageHtml}

            </div>
        `;

    } catch (error) {
        console.error("Lỗi tải chi tiết:", error);

        detailContainer.innerHTML = `
            <p>❌ Không thể tải dữ liệu phiếu khảo sát.</p>
        `;
    }
}

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

loadSurveyDetail();