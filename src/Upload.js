import React from 'react';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import Results from './Results';
import { BrowserRouter, Route } from 'react-router-dom'
import {
	withRouter
} from 'react-router-dom';

import { createStore } from 'redux';

import Button from 'react-bootstrap/Button';
import ReactDataGrid from 'react-data-grid';
import ImageFormatter from 'react-data-grid';

const Img = ({ value }) => {
  if (value == null) {
    return "-"
  }
  return <img height="200" width="400" src={value} />
};

var FileSaver = require('file-saver');

const fs = require('fs');

// Adapted from https://github.com/JakeHartnell/react-images-upload

class Upload extends ImageUploader {

  state = { pictures: [], area:'', response:null, loaded: false, src:null, title:"Staging", rows: [] }; 

  constructor(props){
    super(props);
    
    this.onDrop = this.onDrop.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onDrop = pictureFiles => {
    // this.setState({ pictures: pictureFiles });
    

    pictureFiles.map(pic => {
      console.log(pic);
      let data_to_add = {file: null, orig: null, area: null, analyzed: null, picture: null};
      data_to_add['file'] = pic.name;
      data_to_add['area'] = 'Staging';
      data_to_add['analyzed'] = null;
      console.log('data to add');
      console.log(data_to_add);

      this.state.rows.push(data_to_add);
      console.log(this.state.rows);
    });

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
  sendData = async e => {
    
    e.preventDefault();

    const url = 'http://localhost:3000/image';
    

    console.log('pictures');
    console.log(this.state.pictures.length);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
    }

    this.state.rows.map(row => {
      row['area'] = "Awaiting server";

      // Start new request
      const formData = new FormData();
      console.log(row)
      this.forceUpdate();
    });
    console.log('rows')
    console.log(this.state.rows);
    
    /*
    this.state.pictures.map(pic => {
      console.log('pic');
      console.log(pic);
      formData.append('image', pic);
      // formData.append('files[]', pic, pic.name);
    });
    for(var pair of formData.entries()) {
       console.log(pair[0]+ ', '+ pair[1]);
    }


    
    this.setState({ title:"Awaiting Response" });

    
    const getResponse = await axios.post(url, formData, config);
    console.log('done');

    
    console.log(getResponse);
    if (getResponse.status == 200) {
      
      console.log(getResponse);
      this.setState({ title: "Loaded" });
      this.setState({ area: getResponse.data.area });
      this.setState({ loaded: true });
      this.setState({ src: getResponse.data.result_img_location });
    }
    */
    
  }

  

  render() {

    const columns = [
      { key: 'file', name: 'Filename' },
      { key: 'area', name: 'Area' },
      { key: 'analyzed', name: 'Analyzed', formatter: Img } 
    ];
  
    console.log('re rendering')
    console.log(this.state.rows)
    

      return (

            <div id="submit">
              <ImageUploader
                withIcon = {true}
                buttonText = 'Choose Image'
                label = "Upload Images (up to 8MB each)"
                onChange = {this.onDrop}
                imgExtension = {['.jpg', '.gif', '.png', '.tif', '.tiff']}
                withPreview = {true}
                maxFileSize = {9242880}
              />

              <button name="data" type="button" onClick={this.sendData.bind(this)}>Analyze! </button>

              <br />

              <ReactDataGrid
                columns={columns}
                rowGetter={i => Object.assign({}, this.state.rows[i])}
                rowsCount={this.state.pictures.length}
                minHeight={150} 
              />

              <br />

            </div>
        );
        /*
              <Results title={this.state.title} area={this.state.area} src={this.state.src} />

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
