import React, { Component } from 'react';
import Navigation from './Component/Navigation/Navigation';
import FaceRecognition from './Component/FaceRecognition/FaceRecognition';
import Logo from './Component/Logo/Logo';
import Rank from './Component/Rank/Rank';
import Signin from './Component/Signin/Signin';
import Register from './Component/Register/Register';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import './App.css';
import 'tachyons';

const app = new Clarifai.App({
 apiKey: 'a116c50d0421402081a020220119dd7c'
});

const particlesOptions = {
  particles: {
                 number:{
                  value: 30,
                  density:{
                    enable: true,
                    value_area: 800
                  }
                 }
                 }
}
class App extends Component {
  constructor() {
    super();
    this.state={
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false

    }
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box) => {
    this.setState({box: box});
  }
  onInputChange=(event)=>{
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox (this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
    if(route==='signout'){
      this.setState({isSignedIn: false});
    }
    else if(route==='home'){
       this.setState({isSignedIn: true});

    }
    this.setState({route: route}); 
    
  }
  render() {
    const {isSignedIn,box,imageUrl,route}= this.state;
    return (
      <div className="App">
      <Particles className='Particles'
              params={particlesOptions}
              />
      <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange} />
      {
        route==='home'
            ? <div>
              <Logo/> 
              <Rank/>
              <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box } imageUrl={imageUrl }/>
            </div>
            :(
              route==='signin'
              ? <Signin onRouteChange = {this.onRouteChange}  />
              : <Register onRouteChange = {this.onRouteChange} />

              )            

          }
        
      </div>  
    );
  }
}

export default App;
