import { CloseOutlined } from "@ant-design/icons";
import { Input, Radio } from "antd";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/configFireBase";

export default function SignUp() {
  const [gender, setGender] = useState(0);
  const [imageURL, setImageURL] = useState(null);

  const [user, setUser] = useState({
    user_name: "",
    dateOfBirth: "",
    email: "",
    password: "",
    avatar: "",
  });

  // Tạo 1 tham chiếu đến thư mục chứa kho ảnh trên firebase
  const imageListRef = ref(storage, "images/");

  const handleCheck = (e) => {
    console.log("radio checked", e.target.value);
    setGender(e.target.value);
  };

  // Props của upload
  const props = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        // Lấy đường dẫn của ảnh sau khi hoàn tất quá trình tải
        const downloadURL = info.file.response.url;
        // Lưu đường dẫn đấy vào trong 1 state
        setImageURL(downloadURL);
        message.success("Tải hình ảnh lên thành công");
      } else if (info.file.status === "error") {
        message.error("Tải hình ảnh lên thất bại");
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        // Tạo 1 tham chiếu đến kho ảnh trên firebase
        const imageRef = ref(imageListRef, file.name);

        // Tải ảnh lên firebase
        await uploadBytes(imageRef, file);

        // Lấy URL từ firebase về sau khi upload thành công
        const downloadURL = await getDownloadURL(imageRef);

        // Gọi hàm onSuccess để thông báo là upload ảnh thành công
        onSuccess({ url: downloadURL });
      } catch (error) {
        onError(error);
      }
    },
  };

  return (
    <>
      <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-rgba-black">
        <form className="bg-white p-6 rounded w-2/6">
          <div className="flex items-center justify-between py-1.5">
            <h3>SignUp</h3>
            <CloseOutlined className="cursor-pointer hover:bg-slate-400 p-2 rounded-full" />
          </div>

          <div className="mb-3">
            <label htmlFor="name">Họ và tên</label>
            <Input placeholder="Nhập họ và tên" className="mt-2" id="name" />
          </div>

          <div className="mb-3">
            <label htmlFor="dateOfBirth">Ngày sinh</label>
            <Input type="date" className="mt-2" id="dateOfBirth" />
          </div>

          <div className="mb-3">
            <label htmlFor="name">Giới tính</label>
            <div className="mt-2">
              <Radio.Group onChange={handleCheck} value={gender}>
                <Radio value={0}>Nam</Radio>
                <Radio value={1}>Nữ</Radio>
                <Radio value={2}>Khác</Radio>
              </Radio.Group>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="dateOfBirth">Ảnh đại diện</label>
            <div>
              {
                <img
                  style={{ borderRadius: "50%" }}
                  src={imageURL}
                  alt="ảnh"
                  key={imageURL}
                  width={100}
                  height={100}
                />
              }
            </div>
            <div>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email">Email:</label>
            <Input
              placeholder="Nhập địa chỉ email"
              type="text"
              className="mt-2"
              id="email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password">Mật khẩu:</label>
            <Input
              placeholder="Nhập mật khẩu"
              type="password"
              className="mt-2"
              id="password"
            />
          </div>

          <div>
            <Button
              htmlType="submit"
              type="primary"
              className="w-full btn-primary mt-4"
            >
              Đăng ký
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
