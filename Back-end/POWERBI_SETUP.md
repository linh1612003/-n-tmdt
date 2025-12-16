# Cấu hình Power BI API

Để lấy dữ liệu trực tiếp từ Power BI, bạn cần tạo một **Service Principal** (App Registration) trong Azure AD.

## Các bước cấu hình:

1. **Tạo App Registration trong Azure Portal:**
   - Vào Azure Portal > Azure Active Directory > App registrations
   - Click "New registration"
   - Đặt tên và chọn "Accounts in this organizational directory only"
   - Click "Register"

2. **Lấy Client ID và Tenant ID:**
   - Sau khi tạo, bạn sẽ thấy **Application (client) ID** và **Directory (tenant) ID**
   - Copy các giá trị này

3. **Tạo Client Secret:**
   - Vào "Certificates & secrets" > "New client secret"
   - Đặt mô tả và chọn thời hạn
   - Click "Add" và **copy ngay giá trị secret** (chỉ hiển thị 1 lần)

4. **Cấp quyền cho Service Principal:**
   - Vào Power BI Admin Portal
   - Settings > Admin API settings
   - Enable "Service principals can use Power BI APIs"
   - Thêm Service Principal vào workspace có chứa report

5. **Thêm vào file .env:**
```env
POWERBI_CLIENT_ID=your-client-id-here
POWERBI_CLIENT_SECRET=your-client-secret-here
POWERBI_TENANT_ID=e7572e92-7aee-4713-a3c4-ba64888ad45f
POWERBI_REPORT_ID=41d0d0e2-cd15-4a2d-939e-4b84911bb59b
```

## Lưu ý:
- Dataset trong Power BI cần có tên bảng là 'Orders' với các cột: OrderDate, TotalAmount, ImportPrice, Quantity, Status
- Hoặc bạn có thể điều chỉnh DAX query trong `powerbi.service.ts` để phù hợp với cấu trúc dataset của bạn


