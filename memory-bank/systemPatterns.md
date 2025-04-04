# E-Course Platform - System Patterns

## Kiến trúc hệ thống
### Frontend
- HTML5, CSS3, JavaScript
- Cấu trúc thư mục:
  - css/: Stylesheets
  - js/: JavaScript files
  - img/: Images
  - videos/: Video content
  - webfonts/: Font files

### Cấu trúc trang
1. Trang chủ (index.html)
2. Trang khóa học (courses.html, course-details.html)
3. Trang bài kiểm tra (exams.html, exam-details.html)
4. Trang người dùng (log-in.html, sign-up.html)
5. Trang quản lý (add-course.html, edit-course.html)

## Mẫu thiết kế
### Quản lý người dùng
- Đăng ký/Đăng nhập
- Xác thực OTP
- Quản lý mật khẩu

### Quản lý khóa học
- CRUD operations
- Phân loại theo danh mục
- Quản lý bài học

### Quản lý bài kiểm tra
- Tạo câu hỏi
- Chấm điểm tự động
- Theo dõi kết quả

## Luồng dữ liệu
1. Người dùng -> Xác thực -> Hệ thống
2. Giáo viên -> Tạo nội dung -> Lưu trữ
3. Học viên -> Truy cập nội dung -> Học tập
4. Hệ thống -> Theo dõi tiến độ -> Báo cáo

## Bảo mật
- Xác thực người dùng
- Mã hóa dữ liệu
- Phân quyền truy cập
- Bảo vệ thông tin cá nhân 