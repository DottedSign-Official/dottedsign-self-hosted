export const uploadFile = async (upload_link, file) => {
  try {
    let formData = new FormData();
    formData.append("file", file);

    const response = await fetch(upload_link, {
      method: "POST",
      body: formData,
    });

    return response;
  } catch (err) {
    console.log(err);
  }
};
