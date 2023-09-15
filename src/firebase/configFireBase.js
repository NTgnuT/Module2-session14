// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBD7w0_8W_95ggjfE93uvBuDUV022mG2NA",
  authDomain: "project-md2-d9d96.firebaseapp.com",
  projectId: "project-md2-d9d96",
  storageBucket: "project-md2-d9d96.appspot.com",
  messagingSenderId: "698925248079",
  appId: "1:698925248079:web:e943f22b5f2278a5a6043a",
};

// Khởi tạo fire base
const app = initializeApp(firebaseConfig);
// Tạo tham chiếu đến dịch vụ lưu trữ
// được sử dụng để tham chiếu trong toàn bộ ứng dụng
const storage = getStorage(app);

// export ra bên ngoài để sử dụng
export { storage };
