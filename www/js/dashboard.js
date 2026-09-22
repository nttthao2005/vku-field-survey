// ===============================
// KIỂM TRA ĐĂNG NHẬP
// ===============================

// const savedUser =
//     localStorage.getItem("googleUser");

// if (!savedUser) {

//     window.location.href = "index.html";

// }


// // ===============================
// // HIỂN THỊ THÔNG TIN USER
// // ===============================

// try {

//     const user =
//         JSON.parse(savedUser);

//     document.getElementById(
//         "dashboardUser"
//     ).textContent =
//         `👤 ${user.name} (${user.email})`;

// } catch (error) {

//     console.error(
//         "Không thể đọc thông tin người dùng:",
//         error
//     );

// }


// ===============================
// ĐĂNG XUẤT
// ===============================

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("googleUser");

        window.location.href = "index.html";

    });


// ===============================
// TẠO PHIẾU
// ===============================

document
    .getElementById("createSurveyBtn")
    .addEventListener("click", () => {

        window.location.href = "survey.html";

    });


// ===============================
// TẢI DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        const surveys =
            await getAllSurveys();

        // -------------------------
        // ĐẾM TRẠNG THÁI
        // -------------------------

        const synced =
            surveys.filter(
                survey =>
                    survey.syncStatus === "synced"
            ).length;

        const pending =
            surveys.filter(
                survey =>
                    survey.syncStatus === "pending"
            ).length;

        const syncing =
            surveys.filter(
                survey =>
                    survey.syncStatus === "syncing"
            ).length;


        document.getElementById(
            "syncedCount"
        ).textContent = synced;

        document.getElementById(
            "pendingCount"
        ).textContent = pending;

        document.getElementById(
            "syncingCount"
        ).textContent = syncing;


        // -------------------------
        // DANH SÁCH PHIẾU
        // -------------------------

        const surveyList =
            document.getElementById("surveyList");

        if (surveys.length === 0) {

            surveyList.innerHTML =
                "<p>Chưa có phiếu khảo sát nào.</p>";

            return;
        }

        surveyList.innerHTML = "";

        // Phiếu mới nhất lên trước
        surveys.reverse();

        surveys.forEach((survey) => {

            const item =
                document.createElement("div");

            item.className = "survey-item";

            item.innerHTML = `

                <h3>${survey.id}</h3>

                <p>
                    👤 ${survey.interviewer}
                </p>

                <p>
                    🕐 ${survey.time}
                </p>

                <p>
                    🎓 ${survey.major}
                </p>

                <p>
                    ${getSyncStatusText(
                        survey.syncStatus
                    )}
                </p>

                <button
                    type="button"
                    class="detail-btn"
                    data-id="${survey.id}"
                >
                    Xem chi tiết
                </button>

            `;

            surveyList.appendChild(item);

        });


        // -------------------------
        // CLICK XEM CHI TIẾT
        // -------------------------

        document
            .querySelectorAll(".detail-btn")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                       const id =
    button.dataset.id;

console.log("ID phiếu được chọn:", id);

window.location.href =
    `detail.html?id=${encodeURIComponent(id)}`;

                    }
                );

            });

    } catch (error) {

        console.error(
            "Lỗi tải dashboard:",
            error
        );

    }

}


// ===============================
// HIỂN THỊ TRẠNG THÁI SYNC
// ===============================

function getSyncStatusText(status) {

    switch (status) {

        case "pending":
            return "🟠 Chưa đồng bộ";

        case "syncing":
            return "🔄 Đang đồng bộ";

        case "synced":
            return "🟢 Đã đồng bộ";

        case "error":
            return "❌ Đồng bộ lỗi";

        default:
            return "🟠 Chưa đồng bộ";

    }

}


// ===============================
// CHẠY
// ===============================

loadDashboard();

if (navigator.onLine) {
    console.log("🌐 Dashboard đang Online → kiểm tra đồng bộ...");

    syncPendingSurveys()
        .then(() => {
            console.log("✅ Kiểm tra đồng bộ hoàn tất");
            loadDashboard();
        })
        .catch((error) => {
            console.error("❌ Lỗi đồng bộ:", error);
        });
}

window.addEventListener("online", async () => {
    console.log("🌐 Mạng đã trở lại trên Dashboard...");

    try {
        await syncPendingSurveys();
        await loadDashboard();
    } catch (error) {
        console.error("❌ Lỗi đồng bộ:", error);
    }
});