export default function fetchModel(url) {
  return new Promise(function (resolve, reject) {
    fetch(url)
      .then((response) => {
        // Nếu server báo lỗi (ví dụ sai ID, lỗi mạng)
        if (!response.ok) {
          reject(new Error(response.statusText));
        }
        // Nếu thành công thì ép kiểu dữ liệu về JSON
        return response.json();
      })
      .then((data) => {
        resolve(data); // Trả cục dữ liệu về cho React xử lý
      })
      .catch((error) => {
        reject(error);
      });
  });
}
