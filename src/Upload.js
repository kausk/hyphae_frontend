import React from 'react';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import Results from './Results';

// Adapted from https://github.com/JakeHartnell/react-images-upload

class Upload extends ImageUploader {

  constructor(props){
    super(props);
    this.state = { pictures: [], response: null };
    this.onDrop = this.onDrop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onDrop = pictureFiles => {
    // this.setState({ pictures: pictureFiles });
    this.setState({ pictures: this.state.pictures.concat(pictureFiles) });
    console.log(pictureFiles);
  }

  handleClick = event => {
    console.log('event');
    event.preventDefault();
  }


  // Adapted from https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513
  // https://alligator.io/react/axios-react/
  handleSubmit = async event => {
    console.log('event');
    console.log(event);
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
      }
    }


    const getResponse = await axios.post(url, formData, config);

    if (getResponse.status == 200) {
      this.setState({ response: getResponse.data })
    }



    // const response = await post(url, formData, config);
    //if response == 200
  }

  render() {
      console.log('rendering');
      if (this.state.response == null) {
          return (
            <div id="submit">
              <ImageUploader
                withIcon = {true}
                buttonText = 'Choose Images'
                onChange = {this.onDrop}
                imgExtension = {['.jpg', '.gif', '.png']}
                maxFileSize = {5242800}
                withPreview = {true}
                singleImage = {true}
              />

              <form method="POST" action='image' onSubmit={this.handleSubmit} >
                <input type="submit" title="analyze" />
              </form>

            </div>
        );
      } else {
        return (
            <Results text={this.state.response} />
        )
      }

  }

}

export default Upload;
