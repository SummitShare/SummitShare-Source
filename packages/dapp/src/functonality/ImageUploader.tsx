// "use client";
// import { ChangeEvent, useState } from "react";
// import axios from "axios";

//   const uploadedToS3 = async (e: ChangeEvent<HTMLFormElement>) => {
//     const formData = new FormData(e.target);
//     const file = formData.get("file");

//     if (!file)
//       return null;

// // @ts-ignore
//     const fileType = encodeURIComponent(file.type )

//     const {data} = await axios.get({`/aip/media?fileType${file.Type}`})
//     cosnt {UploadUrl,key} = data
//     await axios.put(UploadUrl,file)
//     return key;

// }

// function ImageUploader() {
//     const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
//       e.preventDefault();

//       const key = uploadedToS3(e);
//     };

//   return (
//     <div>
//       <h1>Image uploader</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="file"
//           name="file"
//           accept="image/jpeg image/png"
//         />
//         <button type="submit" value="Upload">
//           upload
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ImageUploader;
