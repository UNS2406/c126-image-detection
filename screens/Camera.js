/*
we are going to make use of what we learned earlier
to provide data to the classifier model and that is we are going to create a
react native app which would allow you to upload digits pictures from your
phones directly to the classifier model. 

Our app will have just one screen with a button which will take us to our
phone gallery and let us pick an image.

*/



/*
The libraries are "expo-permissions" to gain permission from the device and "expo-image-picker".
We can install them using commands "expo install expo-permissions" and "expo install expo-image-picker".

*/


import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

/*
create a component called PickImage and inside it create a state
for the image and set it to null. Here we'll store the uri of the image later.
*/

export default class PickImage extends React.Component {
  state = {
    image: null,
  };
  
  /* 
     our component has 2 functions: render and return. Return function is used inside of the
     render function. Now inside the render function we'll declare a variable image and 
     set state value to it. Then inside the return function we'll create a button. 
     Button has a title prop and onPress prop. 
     On the on press prop we'll call a sudo _pickImage function. 
  */

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  /*
  This function takes the uri of the image as a parameter. 
  As we have seen in previous class that the data to be sent on an API should be a form data 
  as we are sending image files. 
  
  So we'll create a variable called data and set new form data as its value. 
  From the uri we also want the name of the image and its type. 
  We'll get that by splitting the uri using split() function. 
  Then we'll create a fileToUpload object which will have the uri, image, type as key and 
  the image name and type which we got before as its values. 
  
  We need this data to send the image using an API.
  We'll then upload the fileToUpload object to the from data.
  Then using fetch we'll make a post request to the provided API. 
  The method will be POST, body will contain the form data, header will contain content-type as multipart form data.
  We'll also have to resolve a promisE which we will be doing using .then and getting the response in json form.
  Using catch we'll catch any exceptions or errors that might occur and console.log them.
  
  */
  uploadImage = async (uri) => {
    const data = new FormData();
    let filename = uri.split("/")[uri.split("/").length - 1]
    let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
    const fileToUpload = {
      uri: uri,
      name: filename,
      type: type,
    };
    data.append("digit", fileToUpload);
    fetch("https://f292a3137990.ngrok.io/predict-digit", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

    /*
   This function will help us to pick the
   image from the device.
   In this function we'll use the try catch
   block. We use this block to get the
   exceptions that code might throw.
   The try block will contain the code we
   want to execute and the catch block
   will contain the error or the exception
   which we'll denote by "e".
   Now inside the try block we'll use the
   launchImageLibraryAsync() function
   of the Image Picker library. And pass
   mediaTypes, allowsEditing, aspect
   and quality as its parameters and
   store it inside a variable called result.
   If the results are not cancelled then
   we'll set the data provided by the
   result to the image in the state.
   
   Here we'll also call an uploadImage() function and pass the result.uri to it.
    
    */
    _pickImage = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          this.setState({ image: result.data });
          console.log(result.uri)
          this.uploadImage(result.uri);
        }
      } catch (E) {
        console.log(E);
      }
    };
}
