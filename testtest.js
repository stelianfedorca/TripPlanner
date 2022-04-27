 //             const img = await fetch(image);
        //             const blob = await img.blob();
        
        //             console.log("Uploading image...");
        
        //             // upload data to storage
        //             const uploadTask = uploadBytesResumable(storageRef,blob);
        
        
        //                 // Listen for state changes, errors, and completion of the upload.
        //             uploadTask.on('state_changed',(snapshot) => {
        //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     console.log('Upload is ' + progress + '% done');
        //     switch (snapshot.state) {
        //        case 'paused':
        //            console.log('Upload is paused');
        //        break;
        //        case 'running':
        //           console.log('Upload is running');
        //        break;
        //     }
        //  },
        //  (error) => {
        //     // this.setState({ isLoading: false })
        //     // A full list of error codes is available at
        //     // https://firebase.google.com/docs/storage/web/handle-errors
        //     switch (error.code) {
        //        case 'storage/unauthorized':
        //           console.log("User doesn't have permission to access the object");
        //        break;
        //        case 'storage/canceled':
        //           console.log("User canceled the upload");
        //        break;
        //        case 'storage/unknown':
        //           console.log("Unknown error occurred, inspect error.serverResponse");
        //        break;
        //     }
        //  },
        //  () => {
        //     // Upload completed successfully, now we can get the download URL
        //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //        console.log('File available at ', downloadURL);
        //        //perform your task
        //     });
        //  });
 //             const img = await fetch(image);
        //             const blob = await img.blob();
        
        //             console.log("Uploading image...");
        
        //             // upload data to storage
        //             const uploadTask = uploadBytesResumable(storageRef,blob);
        
        
        //                 // Listen for state changes, errors, and completion of the upload.
        //             uploadTask.on('state_changed',(snapshot) => {
        //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     console.log('Upload is ' + progress + '% done');
        //     switch (snapshot.state) {
        //        case 'paused':
        //            console.log('Upload is paused');
        //        break;
        //        case 'running':
        //           console.log('Upload is running');
        //        break;
        //     }
        //  },
        //  (error) => {
        //     // this.setState({ isLoading: false })
        //     // A full list of error codes is available at
        //     // https://firebase.google.com/docs/storage/web/handle-errors
        //     switch (error.code) {
        //        case 'storage/unauthorized':
        //           console.log("User doesn't have permission to access the object");
        //        break;
        //        case 'storage/canceled':
        //           console.log("User canceled the upload");
        //        break;
        //        case 'storage/unknown':
        //           console.log("Unknown error occurred, inspect error.serverResponse");
        //        break;
        //     }
        //  },
        //  () => {
        //     // Upload completed successfully, now we can get the download URL
        //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //        console.log('File available at ', downloadURL);
        //        //perform your task
        //     });
        //  });
        const updateUserWithPhoto = async (filename) => {
          const docRef = doc(db,'users',email)
          
          console.log("Filename: ",filename);
  
          const data = {
              postImage: filename,
          }
  
          await updateDoc(docRef,data);
      };
  
      async function uploadImageToFirebase(uri){
          const id = 101;
  
          // setFilename(`userphoto/${id}`);
  
          // console.log(filename);
          const filename = `userphoto/${id}`;
  
      const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
  
          // on load
          xhr.onload = function () {
          resolve(xhr.response);
      };
          // on error
          xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
      };
          // on complete
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
      });
  
      // a reference that points to this 'userphoto/image_name' location 
      const fileRef = ref(getStorage(), filename);
      // upload the 'blob' (the image) in the location refered by 'fileRef'
      const result = await uploadBytes(fileRef, blob);
  
      // We're done with the blob, close and release it
      blob.close();
  
      // add the image name to current user
      await updateUserWithPhoto(filename);
  
      // download the url from storage
      return await getDownloadURL(fileRef);
      };
  
      const chooseImage = async () => {
          const requestResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
          if(requestResult.granted === false){
              alert("Permision to access camera roll is required");
              return ;
          }
  
          // permission granted
          let pickerResult = await ImagePicker.launchImageLibraryAsync();
  
          if(pickerResult === true){
              return ;
          }
  
          // upload the image to firebase storage
          const uploadUrl = await uploadImageToFirebase(pickerResult.uri);
  
          // // add the image name to current user
          // await updateUserWithPhoto();
  
          setImage({url: uploadUrl});
      };
  
      const updateUserWithPhoto2 = async () => {
          const docRef = doc(db,'users',email)
          
          console.log("Filename: ",file);
  
          const data = {
              image: file,
          }
  
          await updateDoc(docRef,data);
      };
  