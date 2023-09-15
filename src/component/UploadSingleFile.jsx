import React, { useEffect, useState } from "react";
import { storage } from "../firebase/configFireBase";
import { getDownloadURL, listAll, uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import Register from "./Register";
import ReactPlayer from "react-player";

export default function UploadSingleFile() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);

  // Hàm upload file lên firebase
  const uploadFiles = (files) => {
    // Phải xử lý được tác vụ thêm nhiều file => bất đồng bộ => sử dụng promise
    Promise.all(
      files.map((file) => {
        // Tạo 1 tham chiếu <=> Tạo folder trên firebase
        const imageRef = ref(storage, `images/${file.name}`);
        return uploadBytes(imageRef, file).then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        });
      })
    ).then((urls) => {
      // Trả về danh sách các urls
      setImageUrl((prev) => [...prev, urls]);
    });
  };

  const handleSelectFiles = (e) => {
    // Lấy tất cả các giá trị trong ô input có type = 'file'
    const files = Array.from(e.target.files);
    setImageUpload(files);
  };

  // Khi click vào nút upload thì tiến hành upload lên firebase
  const handleUpload = (e) => {
    // console.log(e.target.files[0]);
    if (!imageUpload) {
      return;
    } else {
      uploadFiles(imageUpload);
    }
  };

  // Tạo 1 tham chiếu đến thư mục chứa kho ảnh trên firebase
  const imageListRef = ref(storage, "images/");

  // Lấy url trên firebase
  useEffect(() => {
    listAll(imageListRef).then((response) => {
      // response trả về là 1 mảng danh sách các url
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          // Danh sách url
          setImageUrl((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div>
      <h1>Danh sách hình ảnh</h1>
      <div>
        {imageUrl.map((url) => (
          // Upload video lên firebase
          //   <ReactPlayer url={url} controls={true} />

          // Upload hình ảnh lên firebase
          <img src={url} alt="ảnh" key={url} width={100} height={100} />
        ))}
      </div>
      <input type="file" onChange={handleSelectFiles} multiple />
      <button onClick={handleUpload}>Upload</button>
      <Register />
    </div>
  );
}
