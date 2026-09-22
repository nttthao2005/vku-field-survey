// ===============================
// GOOGLE LOGIN
// ===============================

const GOOGLE_CLIENT_ID =
    "357922626797-alaueanmm2ra1efh33tluu7jkd1nqf2r.apps.googleusercontent.com";

function handleGoogleLogin(response) {

    console.log("Google login thành công");

    try {

        const payload =
            JSON.parse(
                atob(
                    response.credential.split(".")[1]
                )
            );

        console.log("Thông tin Google:", payload);

        localStorage.setItem(
            "googleUser",
            JSON.stringify({
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            })
        );

        // Đăng nhập thành công → Dashboard
        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(
            "Lỗi xử lý Google Login:",
            error
        );

    }
}


// ===============================
// KHỞI TẠO GOOGLE LOGIN
// ===============================

function initGoogleLogin() {

    if (
        typeof google === "undefined" ||
        !google.accounts ||
        !google.accounts.id
    ) {

        console.error(
            "Google Identity Services chưa được tải"
        );

        return;
    }

    google.accounts.id.initialize({

        client_id: GOOGLE_CLIENT_ID,

        callback: handleGoogleLogin

    });

    google.accounts.id.renderButton(

        document.getElementById(
            "googleLoginButton"
        ),

        {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular"
        }

    );

}


// ===============================
// KHÔI PHỤC ĐĂNG NHẬP
// ===============================

function restoreGoogleLogin() {

    const savedUser =
        localStorage.getItem("googleUser");

    if (!savedUser) {
        return;
    }

    // Đã đăng nhập rồi → Dashboard
    window.location.href = "dashboard.html";
}


// ===============================
// ĐĂNG XUẤT
// ===============================

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("googleUser");

        if (
            typeof google !== "undefined" &&
            google.accounts &&
            google.accounts.id
        ) {
            google.accounts.id.disableAutoSelect();
        }

        console.log("Đã đăng xuất Google");

    });


// ===============================
// KHỞI ĐỘNG
// ===============================

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            restoreGoogleLogin();

            initGoogleLogin();

        }, 500);

    }
);