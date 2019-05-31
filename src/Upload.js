import React from 'react';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import Results from './Results';
import { BrowserRouter, Route } from 'react-router-dom'
import {
	withRouter
} from 'react-router-dom';


var FileSaver = require('file-saver');

const fs = require('fs');


// Adapted from https://github.com/JakeHartnell/react-images-upload

class Upload extends ImageUploader {

  constructor(props){
    super(props);
    this.state = { pictures: [], area:'', response:null, loaded: false, src:null };
    this.onDrop = this.onDrop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onDrop = pictureFiles => {
    // this.setState({ pictures: pictureFiles });
    this.setState({ pictures: this.state.pictures.concat(pictureFiles) });
    console.log(pictureFiles);
  }

  onLoad = event => {
    event.preventDefault();
  }

  handleClick = event => {
    event.preventDefault();
  }

  componentDidMount = () => {
    console.log('componentDidMount');
    console.log(this.state);
  }

  // Adapted from https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513
  // https://alligator.io/react/axios-react/
  handleSubmit = async event => {
    event.preventDefault();
    const url = 'http://localhost:3000/image';
    const formData = new FormData();

    console.log('pictures');
    console.log(this.state.pictures);

    this.state.pictures.map(pic => {
      formData.append('files[]', pic, pic.name);
    });
    for(var pair of formData.entries()) {
       console.log(pair[0]+ ', '+ pair[1]);
    }

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
    }



    const getResponse = await axios.post(url, formData, config);

    console.log(getResponse);
    if (getResponse.status == 200) {
      /*
      const blob = new Blob([getResponse.data], {
        type: 'image/png',
      });
      FileSaver.saveAs(blob, 'tempImg.png');
      */

      this.history.push('/path')
      console.log(getResponse);
      this.setState({ title: "Analysis Results" });
      this.setState({ area: getResponse.data.area });
      this.setState({ loaded: true });
      this.setState({ src: process.env.PUBLIC_URL + '/output.png' })


    }



    // const response = await post(url, formData, config);
    //if response == 200
  }

  render() {


      console.log(this.state.loaded);
      return (

            <div id="submit">
              <ImageUploader
                withIcon = {true}
                buttonText = 'Choose Image'
                onChange = {this.onDrop}
                imgExtension = {['.jpg', '.gif', '.png', '.tif']}
                maxFileSize = {5242800}
                withPreview = {true}
                singleImage = {true}
              />

              <form method="POST" action='image' onSubmit={this.handleSubmit} >
                <input type="submit" title="analyze" />
              </form>

              <Results title={this.state.title} area={this.state.area} src={this.state.src} />
            </div>
        );
        /*
        <BrowserRouter>
          <Route
            path='/results/'
            render={ props => <Results area={this.state.response.area} />}
          />
        </BrowserRouter>
        */


        //<Results area={this.state.response.area} wait={1000} />


  }

}

export default Upload;
