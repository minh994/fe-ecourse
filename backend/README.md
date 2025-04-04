# E-Course Platform Backend

Backend API cho nền tảng học trực tuyến E-Course.

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MongoDB
- npm hoặc yarn

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd fe-ecourse/backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env và cấu hình các biến môi trường:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecourse
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

## Chạy ứng dụng

1. Khởi động MongoDB:
```bash
mongod
```

2. Chạy server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Đăng ký người dùng
- POST /api/auth/login - Đăng nhập
- GET /api/auth/verify/:token - Xác thực email
- POST /api/auth/forgot-password - Quên mật khẩu
- POST /api/auth/reset-password/:token - Đặt lại mật khẩu
- GET /api/auth/me - Lấy thông tin người dùng hiện tại

### Users
- GET /api/users - Lấy danh sách người dùng (admin)
- GET /api/users/:id - Lấy thông tin người dùng
- PATCH /api/users/:id - Cập nhật thông tin người dùng
- DELETE /api/users/:id - Xóa người dùng (admin)
- POST /api/users/:id/change-password - Đổi mật khẩu
- GET /api/users/:id/courses - Lấy danh sách khóa học đã đăng ký

### Courses
- GET /api/courses - Lấy danh sách khóa học
- GET /api/courses/:id - Lấy thông tin khóa học
- POST /api/courses - Tạo khóa học mới (teacher/admin)
- PATCH /api/courses/:id - Cập nhật khóa học (teacher/admin)
- DELETE /api/courses/:id - Xóa khóa học (teacher/admin)
- POST /api/courses/:id/enroll - Đăng ký khóa học
- POST /api/courses/:id/reviews - Thêm đánh giá khóa học

### Exams
- GET /api/exams - Lấy danh sách bài kiểm tra
- GET /api/exams/:id - Lấy thông tin bài kiểm tra
- POST /api/exams - Tạo bài kiểm tra mới (teacher/admin)
- PATCH /api/exams/:id - Cập nhật bài kiểm tra (teacher/admin)
- DELETE /api/exams/:id - Xóa bài kiểm tra (teacher/admin)
- POST /api/exams/:id/start - Bắt đầu làm bài kiểm tra
- POST /api/exams/:id/submit - Nộp bài kiểm tra

### Categories
- GET /api/categories - Lấy danh sách danh mục
- GET /api/categories/:id - Lấy thông tin danh mục
- POST /api/categories - Tạo danh mục mới (admin)
- PATCH /api/categories/:id - Cập nhật danh mục (admin)
- DELETE /api/categories/:id - Xóa danh mục (admin)
- GET /api/categories/:id/subcategories - Lấy danh sách danh mục con
- GET /api/categories/:id/courses - Lấy danh sách khóa học trong danh mục

## Cấu trúc thư mục

```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── uploads/         # Uploaded files
│   ├── avatars/    # User avatars
│   ├── courses/    # Course thumbnails
│   └── categories/ # Category icons
├── .env            # Environment variables
├── package.json    # Dependencies
└── server.js       # Entry point
```

## Bảo mật

- JWT authentication
- Password hashing
- Role-based access control
- File upload validation
- Input validation
- Error handling

## Phát triển

1. Tạo branch mới:
```bash
git checkout -b feature/your-feature-name
```

2. Commit changes:
```bash
git add .
git commit -m "Your commit message"
```

3. Push to repository:
```bash
git push origin feature/your-feature-name
```

## License

MIT 