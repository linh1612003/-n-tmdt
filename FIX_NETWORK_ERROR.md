# 🔧 Sửa lỗi Network Error - Đăng nhập

## ❌ Vấn đề: Network Error khi đăng nhập

**Nguyên nhân**: Backend server (port 5000) chưa chạy hoặc không kết nối được.

## ✅ Giải pháp:

### Bước 1: Khởi động Backend Server

Mở **PowerShell** hoặc **Command Prompt** và chạy:

```bash
cd Back-end
npm run start:dev
```

**Kết quả mong đợi:**
```
🚀 Server đang chạy tại http://localhost:5000
✅ Category "Khác" đã được đảm bảo tồn tại
```

### Bước 2: Kiểm tra Server đã chạy

Mở terminal mới và chạy:
```bash
netstat -ano | findstr :5000
```

Nếu thấy kết quả → Server đã chạy ✅

### Bước 3: Kiểm tra Frontend

- Frontend đang chạy trên: `http://localhost:3000`
- Mở browser và thử đăng nhập lại

## 🔍 Các lỗi thường gặp khi khởi động Backend:

### Lỗi 1: "Cannot connect to MongoDB"
**Nguyên nhân**: MongoDB chưa chạy hoặc connection string sai

**Cách sửa:**
1. Kiểm tra MongoDB có đang chạy không
2. Kiểm tra file `.env` trong `Back-end/` có `MONGO_CONNECTION_STRING`
3. Connection string đúng format: `mongodb://localhost:27017/database_name`

### Lỗi 2: "Port 5000 already in use"
**Nguyên nhân**: Port 5000 đang được sử dụng bởi process khác

**Cách sửa:**
```bash
# Tìm process đang dùng port 5000
netstat -ano | findstr :5000

# Kill process (thay PID bằng số process ID)
taskkill /PID <PID> /F

# Hoặc đổi port trong main.ts
```

### Lỗi 3: "JWT_SECRET is not defined"
**Nguyên nhân**: Thiếu biến môi trường

**Cách sửa:**
Thêm vào file `.env` trong `Back-end/`:
```
MONGO_CONNECTION_STRING=mongodb://localhost:27017/your_database
JWT_SECRET=your_secret_key_here
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

## 📝 Kiểm tra nhanh:

1. **Backend chạy?** → Mở `http://localhost:5000/api` (sẽ trả về 404 nhưng server đang chạy)
2. **Frontend chạy?** → Mở `http://localhost:3000`
3. **CORS OK?** → Kiểm tra console browser không có lỗi CORS
4. **Network OK?** → Kiểm tra Network tab trong DevTools (F12)

## 🚀 Khởi động đầy đủ:

**Terminal 1 - Backend:**
```bash
cd Back-end
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd Front-end
npm start
```

## ✅ Sau khi sửa:

1. Refresh browser (Ctrl + F5)
2. Thử đăng nhập lại
3. Kiểm tra Console (F12) xem còn lỗi không

---

**Nếu vẫn còn lỗi**, vui lòng:
1. Copy lỗi từ Console (F12)
2. Copy log từ Backend terminal
3. Gửi cho tôi để kiểm tra chi tiết

