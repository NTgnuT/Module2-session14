import React, { useEffect, useState } from "react";
import { storage } from "../firebase/configFireBase";
import { getDownloadURL, listAll, uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import "./Register.css";

export default function Register() {
  const [gender, setGender] = useState(0);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);

  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    user_name: "",
    address: "",
    dateOfBirth: "",
    avatar: "",
    role: 1,
  });

  // Danh sách gender
  const listGender = [
    {
      id: 0,
      title: "Nam",
    },
    {
      id: 1,
      title: "Nữ",
    },
    {
      id: 2,
      title: "Khác",
    },
  ];

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isDisable, setIsDisable] = useState(false);

  // Hàm validate dữ liệu nhập vào
  const validateData = (nameInput, valueInput) => {
    switch (nameInput) {
      case "email":
        if (!valueInput) {
          setEmailError("Email không được để trống");
        } else {
          setEmailError("");
        }
        break;
      case "password":
        if (!valueInput) {
          setPasswordError("Mật khẩu không được để trống");
        } else if (valueInput.length < 8) {
          setPasswordError("Mật khẩu không được ngắn hơn 8 ký tự");
        } else {
          setPasswordError("");
        }
        break;
      case "user_name":
        if (!valueInput) {
          setNameError("Họ và tên không được để trống");
        } else {
          setNameError("");
        }
        break;
      case "confirmPassword":
        if (!valueInput) {
          setConfirmPasswordError("Mật khẩu không được để trống");
          return;
        } else if (user.password !== valueInput) {
          setConfirmPasswordError("Mật khẩu không trùng khớp");
          return;
        } else {
          setConfirmPasswordError("");
        }
        break;

      default:
        break;
    }
  };

  // Xử lý sự kiện checked trong ô checkbox
  const handleChecked = (e) => {
    setIsDisable(e.target.checked);
  };

  // Lấy giá trị từ các ô input
  const handleInputChange = (e) => {
    const { value, name } = e.target;

    validateData(name, value);

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateData("user_name", user.user_name);
    validateData("email", user.email);
    validateData("password", user.password);
    validateData("confirmPassword", user.confirmPassword);
    console.log("user", user);
    if (user.user_name && user.email && user.password && user.confirmPassword) {
      const newUser = {
        user: user.user_name,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        address: user.address,
        password: user.password,
        role: 1,
        avatar,
      };
    }
  };

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
    <>
      <div className="container-login">
        <form className="form-login" onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center">
            <h3>Form đăng ký</h3>
            <div className="btn btn-close"></div>
          </div>

          <div className="register-info">
            <div className="register-info-left">
              {/* Họ tên  */}
              <div className="form-group mb-3">
                <label className="form-label" htmlFor="name">
                  Họ và tên
                </label>
                <input
                  placeholder="Nhập họ và tên"
                  className={`form-control `}
                  id="name"
                  name="user_name"
                  type="text"
                  onChange={handleInputChange}
                />
                {nameError && <div className="text-err mt-1">{nameError}</div>}
              </div>

              {/* Ngày sinh */}
              <div className="form-group mb-3">
                <label className="form-label" htmlFor="date">
                  Ngày sinh
                </label>
                <input
                  onChange={handleInputChange}
                  className={`form-control `}
                  id="date"
                  name="dateOfBirth"
                  type="date"
                />
              </div>

              {/* Email */}
              <div className="form-group mb-3">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  placeholder="Nhập địa chỉ email"
                  className={`form-control `}
                  id="email"
                  name="email"
                  type="text"
                  onChange={handleInputChange}
                />
                {emailError && (
                  <div className="text-err mt-1">{emailError}</div>
                )}
              </div>

              {/* Giới tính */}
              <div className="mb-3">
                <label className="form-label">Giới tính</label>
                <div className="d-flex gap-3">
                  {listGender.map((g) => (
                    <div className="form-check" key={g.id}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        onChange={() => setGender(g.id)}
                        checked={g.id === gender}
                      />
                      <label className="form-check-label">{g.title}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="register-info-right">
              {/* Địa chỉ  */}
              <div className="form-group mb-3">
                <label className="form-label" htmlFor="name">
                  Địa chỉ
                </label>
                <input
                  placeholder="Nhập địa chỉ "
                  className={`form-control `}
                  id="address"
                  name="address"
                  type="text"
                  onChange={handleInputChange}
                />
              </div>

              {/* Mật khẩu */}
              <div className="form-group mb-3">
                <label className="form-label" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  placeholder="Nhập mật khẩu"
                  className={`form-control `}
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                />
                {passwordError && (
                  <div className="text-err mt-1">{passwordError}</div>
                )}
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="form-group mb-3">
                <label className="form-label" htmlFor="confirmPassword">
                  Nhập lại mật khẩu
                </label>
                <input
                  placeholder="Nhập lại mật khẩu"
                  className={`form-control `}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={handleInputChange}
                />
                {confirmPasswordError && (
                  <div className="text-err mt-1">{confirmPasswordError}</div>
                )}
              </div>

              {/* Thêm ảnh avartar */}
              <div>
                <div>
                  {imageUrl.map((url) => (
                    // Upload hình ảnh lên firebase
                    <img
                      src={url}
                      alt="ảnh"
                      key={url}
                      width={100}
                      height={100}
                      style={{ borderRadius: "50%" }}
                    />
                  ))}
                </div>
                <input type="file" onChange={handleSelectFiles} />
                <button onClick={handleUpload}>Upload</button>
              </div>
            </div>
          </div>

          <div className="form-check form-check-inline mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox1"
              value="option1"
              onChange={handleChecked}
            />
            <label className="form-check-label" for="inlineCheckbox1">
              Bạn có đồng ý với <a href="#">điều khoản</a> của chúng tôi?
            </label>
          </div>

          <div>
            <button
              disabled={!isDisable}
              style={{ width: "100%" }}
              className="btn btn-primary mt-1  "
            >
              Đăng ký
            </button>
            <p className=" text-center">
              Bạn đã có tài khoản? <a href="#">Đăng nhập</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
