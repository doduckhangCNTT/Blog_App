export const checkImage = (file: File) => {
  const types = ["image/png", "image/jpeg"];
  let err = "";

  if (!file) return (err = "File does not exist");

  if (file.size > 1024 * 1024) {
    err = "The largest file size is 1mb";

    if (!types.includes(file.type)) err = "The image type is png / jpeg";
    return err;
  }
};

export const imageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "gbix2mzn");
  formData.append("cloud_name", "duan5rafi");

  const res = await fetch("https://api.cloudinary.com/v1_1/duan5rafi/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return { public_id: data.public_id, url: data.secure_url };
};
