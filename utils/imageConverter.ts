export const base64ToFile = (base64String: string, filename: string) => {
  try {
    const arr = base64String.split(",");

    if (arr.length < 2) {
      throw new Error("Format base64 tidak valid");
    }

    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error("Gagal convert base64 ke File:", error);
    throw error;
  }
};
