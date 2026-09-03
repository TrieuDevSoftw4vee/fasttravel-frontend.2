# FastTravel Frontend Vue 3

Frontend đã được chuyển từ React sang Vue 3 + Vite. Điểm khởi động mới là
`src/main.js` và giao diện chính nằm trong `src/App.vue`.

## Chạy trên Windows

Thư mục `node_modules` cũ trong dự án được tạo cho React. Hãy mở terminal tại
thư mục `frontend` và chạy:

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

Nếu dùng PowerShell:

```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
npm run dev
```

Backend chạy tại `http://localhost:8080`, frontend Vue chạy tại
`http://localhost:5173`.

Chạy `npm install` và `npm run dev`. API mặc định tại `http://localhost:8080/api`; có thể đổi bằng biến `VITE_API_URL`.
