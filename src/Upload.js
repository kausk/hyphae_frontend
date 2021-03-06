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
import { CSVLink, CSVDownload } from "react-csv";



const Img = ({ value }) => {

  return <img height="500" width="1000" src={value} />
};

const columns = [
  { key: 'file', name: 'Filename' },
  { key: 'area', name: 'Area' },
  { key: 'analyzed', name: 'Analyzed', formatter: Img } 
];

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
      let data_to_add = {file: null, area: null, analyzed: null};
      data_to_add['file'] = pic.name;
      data_to_add['area'] = 'Staging';
      data_to_add['analyzed'] = null;
      data_to_add['pic'] = pic
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
    
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
    }

    this.state.rows.map(async row => {
      row['area'] = "Awaiting server";
      this.forceUpdate();

      // Start new request
      const formData = new FormData();
      formData.append('image', row['pic']);

      const getResponse = await axios.post(url, formData, config);
      console.log('done with photo analysis');
      
      // Update table fields
      row['area'] = getResponse.data.area
      row['analyzed'] = getResponse.data.result_img_location
      this.forceUpdate();

    });

  }

  

  render() {
    

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
              <CSVLink data={this.state.rows}>Download Results as Excel</CSVLink>;


               
              <ReactDataGrid
                columns={columns}
                rowGetter={i => Object.assign({}, this.state.rows[i])}
                rowsCount={this.state.pictures.length}
                headerRowHeight={30}
                rowHeight={200}
              />
            </div>
        );

  }

}

export default Upload;
