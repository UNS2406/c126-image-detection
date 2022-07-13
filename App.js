import React from "react";
/* 
our component created so to render it we’ll import it in the app.js file 
and pass it inside the render function of app.js
*//**/
import PickImage from "./screens/Camera.js";

export default class App extends React.Component {
  render() {
    return <PickImage/>;
  }
}
