# API Documentation for Fast Room Manager Backend

Tài liệu này mô tả các API endpoints cần thiết để thay thế mock data trong project `fast-room-manager`. Backend nên được xây dựng bằng **Node.js** và **Express**.

## 1. Thông tin chung

- **Base URL**: `http://localhost:3000` (hoặc URL server của bạn)
- **API Base Path**: `/api/v1`
- **Content-Type**: `application/json`
- **Response Format**:
  ```json
  {
    "status": "success",
    "data": { ... } | [ ... ]
  }
  ```
  Error responses:
  ```json
  {
    "error": "Error description",
    "details": { ... }
  }
  ```

## 2. Authentication

Endpoints xác thực người dùng (khuyến nghị cho production).

### Register
- **Endpoint**: `POST /api/v1/auth/register`
- **Body**:
  ```json
  {
    "name": "Nguyen Van A",
    "email": "a@example.com",
    "password": "yourStrongPassword"
  }
  ```
- **Response 201**:
  ```json
  {
    "user": {
      "_id": "...",
      "name": "Nguyen Van A",
      "email": "a@example.com",
      "role": "user"
    },
    "token": "<jwt_token>"
  }
  ```

### Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Body**:
  ```json
  {
    "email": "a@example.com",
    "password": "yourStrongPassword"
  }
  ```
- **Response 200**:
  ```json
  {
    "user": { "_id": "...", "name": "...", "email": "...", "role": "user" },
    "token": "<jwt_token>"
  }
  ```

### Get Current User
- **Endpoint**: `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response 200**: User object

## 3. Floor Management

### Get All Floors
- **Endpoint**: `GET /api/v1/floor`
- **Response 200**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "_id": "string",
        "name": "Tầng 1",
        "createdAt": "ISO Date",
        "updatedAt": "ISO Date"
      }
    ]
  }
  ```

## 4. Room Management

**Frontend Store**: `src/stores/rooms.ts`

### Get All Rooms
- **Endpoint**: `GET /api/v1/rooms`
- **Query Params** (optional): 
  - `floorId`: Filter by floor
  - `status`: available|occupied|maintenance
  - `type`: single|double|family
- **Response 200**: Array of Room objects

### Get Room Detail
- **Endpoint**: `GET /api/v1/rooms/:id`
- **Response 200**: Single Room object
- **Response 404**: Room not found

### Create Room
- **Endpoint**: `POST /api/v1/rooms`
- **Body**:
  ```json
  {
    "name": "Phòng 101",
    "floor": 1,
    "type": "single",
    "area": 20,
    "price": 3000000,
    "deposit": 3000000,
    "status": "available",
    "amenities": ["Wifi", "AC"],
    "description": "...",
    "images": []
  }
  ```
- **Response 201**: Created Room object

### Update Room
- **Endpoint**: `PUT /api/v1/rooms/:id`
- **Body**: Partial Room object
- **Response 200**: Updated Room object

### Delete Room
- **Endpoint**: `DELETE /api/v1/rooms/:id`
- **Response 204**: No Content

## 5. Tenant Management

**Frontend Store**: `src/stores/tenant.ts`

### Get All Tenants
- **Endpoint**: `GET /api/v1/tenant`
- **Response 200**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "_id": "...",
        "name": "Nguyễn Văn A",
        "phone": "0987654321",
        "email": "a@example.com",
        "idCard": "123456789",
        "address": "Hanoi",
        "emergencyContact": "Mr B",
        "emergencyPhone": "0123456789",
        "status": "active",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

### Get Tenant Detail
- **Endpoint**: `GET /api/v1/tenant/:id`
- **Response 200**: Single Tenant object

### Create Tenant
- **Endpoint**: `POST /api/v1/tenant`
- **Body**: Tenant object (without _id)
- **Response 201**: Created Tenant

### Update Tenant
- **Endpoint**: `PUT /api/v1/tenant/:id`
- **Body**: Partial Tenant object
- **Response 200**: Updated Tenant

### Delete Tenant
- **Endpoint**: `DELETE /api/v1/tenant/:id`
- **Response 204**: No Content

## 6. Contract Management

**Frontend Store**: `src/stores/contract.ts`

### Get All Contracts
- **Endpoint**: `GET /api/v1/contract`
- **Response 200**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "_id": "...",
        "id": "...",
        "roomId": "room_id",
        "tenantId": "tenant_id",
        "startDate": "2024-01-01",
        "endDate": "2025-01-01",
        "monthlyRent": 3000000,
        "deposit": 3000000,
        "status": "active",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

### Get Contract Detail
- **Endpoint**: `GET /api/v1/contract/:id`
- **Response 200**: Single Contract object

### Create Contract
- **Endpoint**: `POST /api/v1/contract`
- **Body**:
  ```json
  {
    "roomId": "room_id",
    "tenantId": "tenant_id",
    "startDate": "2024-01-01",
    "endDate": "2025-01-01",
    "monthlyRent": 3000000,
    "deposit": 3000000,
    "status": "active"
  }
  ```
- **Response 201**: Created Contract

### Update Contract
- **Endpoint**: `PUT /api/v1/contract/:id`
- **Body**: Partial Contract object
- **Response 200**: Updated Contract

### Delete Contract
- **Endpoint**: `DELETE /api/v1/contract/:id`
- **Response 204**: No Content

## 7. Payments Management

**Frontend Store**: `src/stores/payment.ts`

### Get Payments
- **Endpoint**: `GET /api/v1/payments`
- **Query Params** (optional):
  - `contractId`: Filter by contract
  - `status`: pending|paid|overdue
  - `month`: Format "MM/YYYY"
- **Response 200**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "_id": "...",
        "contractId": "...",
        "month": "01/2026",
        "rentAmount": 3000000,
        "electricityAmount": 200000,
        "waterAmount": 100000,
        "otherFees": 0,
        "totalAmount": 3300000,
        "paidAmount": 0,
        "status": "pending",
        "dueDate": "2026-01-05",
        "paidDate": null,
        "notes": "",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

### Create Payment
- **Endpoint**: `POST /api/v1/payments`
- **Body**:
  ```json
  {
    "contractId": "contract_id",
    "month": "01/2026",
    "rentAmount": 3000000,
    "electricityAmount": 200000,
    "waterAmount": 100000,
    "totalAmount": 3300000
  }
  ```
- **Response 201**: Created Payment

### Update Payment (Mark as Paid)
- **Endpoint**: `PUT /api/v1/payments/:id`
- **Body**:
  ```json
  {
    "status": "paid",
    "paidAmount": 3300000,
    "paidDate": "2026-01-29"
  }
  ```
- **Response 200**: Updated Payment

### Delete Payment
- **Endpoint**: `DELETE /api/v1/payments/:id`
- **Response 204**: No Content

## 8. Reports & Dashboard

**Frontend Store**: `src/stores/report.ts`

### Get Dashboard Stats
- **Endpoint**: `GET /api/v1/reports/dashboard`
- **Response 200**:
  ```json
  {
    "status": "success",
    "data": {
      "totalRooms": 10,
      "occupiedRooms": 8,
      "availableRooms": 2,
      "maintenanceRooms": 0,
      "totalTenants": 8,
      "monthlyRevenue": 45000000,
      "pendingPayments": 8500000,
      "overduePayments": 0
    }
  }
  ```

### Get Revenue Stats
- **Endpoint**: `GET /api/v1/reports/revenue`
- **Response 200**:
  ```json
  {
    "status": "success",
    "data": {
      "thisMonth": 45000000,
      "growth": 12.5,
      "pending": 8500000
    }
  }
  ```

## 9. TypeScript Interfaces Reference

Các interface được định nghĩa trong `src/types/index.ts`:

### Room
```typescript
{
  _id?: string;
  id?: string;
  name: string;
  idFloor?: Floor;  // hoặc có thể là floor: number
  floor?: number;
  type: 'single' | 'double' | 'family';
  area: number;
  price: number;
  deposit: number;
  status: 'available' | 'occupied' | 'maintenance';
  amenities: string[];
  description?: string;
  images: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

### Tenant
```typescript
{
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email?: string;
  idCard: string;
  address: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'terminated';
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

### Contract
```typescript
{
  _id?: string;
  id: string;
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: 'active' | 'expired' | 'terminated';
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

### Payment
```typescript
{
  id: string;
  contractId: string;
  month: string;  // "MM/YYYY"
  rentAmount: number;
  electricityAmount: number;
  waterAmount: number;
  otherFees: number;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate?: string | Date;
  paidDate?: string | Date;
  notes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

## 10. Ghi chú Implementation

1. **Database**: Khuyến nghị sử dụng MongoDB với Mongoose để phù hợp với cấu trúc dữ liệu.
2. **Validation**: Sử dụng Joi hoặc express-validator để validate request body.
3. **Error Handling**: Sử dụng middleware xử lý lỗi tập trung.
4. **CORS**: Cấu hình CORS để cho phép frontend truy cập.
5. **Environment Variables**: 
   - `PORT`: Cổng server (default: 3000)
   - `MONGODB_URI`: Connection string MongoDB
   - `JWT_SECRET`: Secret key cho JWT authentication

## 11. Sử dụng với Frontend

Frontend đã được cấu hình để gọi API thông qua:
- **Axios instance**: `src/plugins/axios.ts`
- **Base URL**: Đọc từ `import.meta.env.VITE_API_BASE_URL`
- **Stores**: Tất cả API calls đã được implement trong các stores:
  - `src/stores/rooms.ts`
  - `src/stores/tenant.ts`
  - `src/stores/contract.ts`
  - `src/stores/payment.ts`
  - `src/stores/report.ts`

Để chạy frontend với backend:
1. Tạo file `.env` trong root project frontend:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```
2. Khởi động backend server
3. Chạy frontend với `pnpm dev`

## 12. Ví dụ Express Server Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── Room.js
│   │   ├── Tenant.js
│   │   ├── Contract.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── rooms.js
│   │   ├── tenants.js
│   │   ├── contracts.js
│   │   ├── payments.js
│   │   └── reports.js
│   ├── controllers/
│   ├── middlewares/
│   └── app.js
├── .env
└── package.json
```
