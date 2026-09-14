
# 📱 VKU Field Survey — Khảo sát nhu cầu việc làm sinh viên

> **Mini-Project 1** — Môn học: **Cross-Platform Mobile App Development (VKU)**  
> **Sinh viên thực hiện:** Nguyễn Thị Thanh Thảo 
> **Demo Live:** https://vku-field-survey.nguyenthao2005py.workers.dev/
> **Repository:** https://github.com/nttthao2005/vku-field-survey


**VKU Field Survey** là một ứng dụng web dạng **Progressive Web App (PWA)** được xây dựng nhằm hỗ trợ thu thập thông tin khảo sát một cách nhanh chóng và thuận tiện trên thiết bị di động,đặc biệt trong điều kiện mạng không ổn định.

## 1. Mục tiêu & Chức năng

Các chức năng chính:

Nhập thông tin người phỏng vấn, chuyên ngành và nhu cầu việc làm.
Lựa chọn loại công việc, mức lương mong muốn và kinh nghiệm.
Ghi nhận thời gian có thể bắt đầu làm việc.
Lấy vị trí hiện tại bằng GPS.
Chụp hoặc chọn ảnh hiện trường.
Lưu dữ liệu Offline bằng IndexedDB.
Tự động đồng bộ dữ liệu khi có Internet.
Lưu thông tin khảo sát vào Google Sheets.
Lưu hình ảnh vào Google Drive.
Cài đặt ứng dụng trên điện thoại thông qua PWA.

## 2. Công nghệ sử dụng

| Công nghệ          | Mục đích                                |
| ------------------ | --------------------------------------- |
| HTML5              | Xây dựng giao diện                      |
| CSS3               | Thiết kế giao diện                      |
| JavaScript         | Xử lý logic ứng dụng                    |
| PWA                | Cho phép cài đặt ứng dụng trên thiết bị |
| Service Worker     | Cache tài nguyên và hỗ trợ Offline      |
| IndexedDB          | Lưu dữ liệu khảo sát cục bộ             |
| Geolocation API    | Lấy vị trí GPS                          |
| Camera/File API    | Chụp và chọn hình ảnh                   |
| Google Apps Script | API trung gian đồng bộ dữ liệu          |
| Google Sheets      | Lưu dữ liệu khảo sát                    |
| Google Drive       | Lưu hình ảnh                            |
| Cloudflare Pages   | Triển khai ứng dụng                     |
| GitHub             | Quản lý mã nguồn                        |


## 3. Kiến trúc hệ thống

Ứng dụng được thiết kế theo hướng **Offline-first**.

                   ┌─────────────────────┐
                   │      Người dùng     │
                   │     Mobile / PC     │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   VKU Field Survey  │
                   │        PWA          │
                   └──────────┬──────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌────────────┐
        │IndexedDB │    │   GPS    │    │ Camera /   │
        │          │    │Location  │    │   Image    │
        └────┬─────┘    └──────────┘    └────────────┘
             │
             │ Khi có Internet
             ▼
      ┌──────────────────┐
      │ Google Apps      │
      │ Script           │
      └────────┬─────────┘
               │
        ┌──────┴────────┐
        ▼               ▼
┌──────────────┐ ┌──────────────┐
│ Google Sheets│ │ Google Drive │
│   Dữ liệu    │ │    Hình ảnh  │
└──────────────┘ └──────────────┘

## 4. Dữ liệu khảo sát

Mỗi phiên khảo sát có thể bao gồm các thông tin:

| Trường                   | Mô tả                                          |
| ------------------------ | ---------------------------------------------- |
| Session ID               | Mã định danh phiên khảo sát                    |
| Người phỏng vấn          | Người thực hiện khảo sát                       |
| Thời gian                | Thời gian thực hiện khảo sát                   |
| Latitude                 | Vĩ độ                                          |
| Longitude                | Kinh độ                                        |
| Chuyên ngành             | Chuyên ngành của người được khảo sát           |
| Nhu cầu việc làm         | Nội dung nhu cầu việc làm                      |
| Loại công việc           | Internship, Full-time, Part-time, Freelance... |
| Mức lương mong muốn      | Khoảng mức lương                               |
| Kinh nghiệm              | Kinh nghiệm làm việc                           |
| Thời gian có thể bắt đầu | Thời điểm có thể bắt đầu làm việc              |
| Ảnh                      | Hình ảnh hiện trường                           |
| Trạng thái               | Trạng thái đồng bộ                             |
| Thời gian đồng bộ        | Thời điểm dữ liệu được đồng bộ                 |

Ảnh được nén trước khi gửi lên Google Apps Script và lưu trên Google Drive. Đường dẫn hình ảnh được lưu cùng dữ liệu khảo sát trên Google Sheets.

## 5. Cấu trúc thư mục

vku-field-survey/
│
├── assets/
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── css/
│   └── style.css   Chứa toàn bộ phần định dạng giao diện.
│
├── js/
│   ├── app.js    Điều khiển logic chính của ứng dụng.
│   ├── camera.js    Xử lý chụp/chọn và xử lý hình ảnh.
│   ├── db.js    Xử lý lưu trữ dữ liệu khảo sát bằng IndexedDB.
│   ├── location.js   Xử lý lấy vị trí GPS của thiết bị.
│   └── sync.js    Xử lý đồng bộ dữ liệu với hệ thống trực tuyến.
│
├── .gitignore
├── index.html     Chứa giao diện chính và form khảo sát.
├── manifest.json     Khai báo thông tin PWA, icon, tên ứng dụng và chế độ hiển thị.
├── sw.js   Service Worker chịu trách nhiệm cache tài nguyên và hỗ trợ hoạt động Offline.
└── README.md

## 6. Yêu cầu môi trường và Triển khai

Để chạy project, cần:

* Trình duyệt hiện đại hỗ trợ JavaScript.
* HTTPS khi triển khai thực tế.
* Quyền truy cập GPS nếu sử dụng chức năng vị trí.
* Quyền truy cập camera nếu chụp ảnh.
* Kết nối Internet khi cần đồng bộ dữ liệu.

Các trình duyệt hiện đại như Google Chrome, Microsoft Edge và Safari có thể được sử dụng.

Project có thể được triển khai dưới dạng static website trên **Cloudflare Pages**.

Sau khi triển khai, ứng dụng có thể được truy cập bằng đường dẫn HTTPS.

### Demo
https://vku-field-survey.nguyenthao2005py.workers.dev/

## 7. Cài đặt trên điện thoại

Vì đây là PWA, ứng dụng có thể được thêm vào màn hình chính của thiết bị.

### Android

Mở website bằng Chrome: https://vku-field-survey.nguyenthao2005py.workers.dev/
Sau đó chọn: Cài đặt ứng dụng hoặc Thêm vào màn hình chính

### iPhone

Mở website bằng Safari: https://vku-field-survey.nguyenthao2005py.workers.dev/
Chọn:Chia sẻ Thêm vào Màn hình chính

Sau khi cài đặt, ứng dụng có thể được mở trực tiếp từ icon trên màn hình.


## 12. Kiểm thử Offline

1. Mở ứng dụng.
2. Tắt Wi-Fi và dữ liệu di động.
3. Tạo một phiên khảo sát mới.
4. Nhập đầy đủ thông tin.
5. Chụp/chọn ảnh.
6. Lưu khảo sát.
7. Kiểm tra trạng thái:🟠 Chờ đồng bộ (pending)
8. Bật lại Wi-Fi hoặc dữ liệu di động.
9. Chờ hệ thống tự động đồng bộ.
10. Kiểm tra trạng thái:🟢 Đã đồng bộ (synced)
11. Kiểm tra dữ liệu trên Google Sheets và hình ảnh trên Google Drive.
Nếu quá trình đồng bộ thất bại, dữ liệu sẽ được giữ lại trên thiết bị để có thể thử đồng bộ lại sau.

## 15. Hạn chế và Hướng phát triển

* Dữ liệu cục bộ phụ thuộc vào bộ nhớ của trình duyệt.
* Việc lấy GPS phụ thuộc vào quyền truy cập vị trí của thiết bị.
* Việc chụp ảnh phụ thuộc vào quyền truy cập camera.
* Đồng bộ dữ liệu cần kết nối Internet.
* Google Apps Script và Google Drive phụ thuộc vào dịch vụ của Google.

Trong tương lai có thể mở rộng:

* Thống kê và biểu đồ dữ liệu.
* Tìm kiếm và lọc khảo sát.
* Quản lý người dùng.
* Bản đồ hiển thị vị trí khảo sát.
* Cải thiện cơ chế xử lý xung đột dữ liệu.
* Đồng bộ với backend chuyên dụng thay cho Google Apps Script.


