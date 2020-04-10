<template>
<div class="container">
   <h1>Upload File</h1>
   <div class="alert alert-primary">
      <p><strong>Instructions</strong></p>
      <p>Please upload the following file(s):</p>
      <ul>
         <li v-if="!genbank">GenBank file <strong>(.gb, .gbk)</strong></li>
         <li v-if="genbank">You have uploaded all required files. Thank you!</li>
      </ul>
      <p>Uploaded files:</p>
      <ul>
         <li v-if="genbank">GenBank file <strong>(.gb, .gbk)</strong></li>
         <li v-if="!genbank">You have not uploaded any files yet.</li>
      </ul>
      <router-link  :to="{ name: 'Data', params: {version: currentVersion, source: currentSource} }" v-if="genbank">
         <button class="btn btn-light" id="next-top"><strong>Next</strong></button>
      </router-link>
   </div>

   <div class="upload-wrapper">
      <h5 class="upload-title">GenBank file</h5>
      <div id="genbank-success-alert" class="alert alert-success" role="alert" v-if="showGenBankSuccessAlert"></div>
      <div id="genbank-danger-alert" class="alert alert-danger" role="alert" v-if="showGenBankDangerAlert"></div>
      <div class="upload">
         <form id="genbank-upload-form" role="form" enctype="multipart/form-data">
            <div class="upload-btn-wrapper">
               <button class="btn btn-upload">Drag files here or click to browse<br/>
                  <div class="selected-file" v-if="showGenBankFile">
                     <strong>Selected file: {{ this.genbankFile.name }}</strong>
                  </div>
               </button>
               <input type="file" id="file" ref="file" name="file" v-on:change="handleFileUpload('genbank')" class="form-control">
            </div>
         </form>
      </div>
      <button class="btn btn-dark btn-upload-submit" v-if="showGenBankFile" @click="uploadFile"><strong>Upload</strong></button>
   </div>

   <router-link  :to="{ name: 'Data', params: {version: currentVersion, source: currentSource} }" v-if="genbank">
      <button class="btn btn-light" id="next-bottom"><strong>Next</strong></button>
   </router-link>
</div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

export default {
   data() {
      return {
         genbank: false,
         genbankFile: null,
         showGenBankFile: false,
         showGenBankDangerAlert: false,
         showGenBankSuccessAlert: false,
         uploadedFilename: '',
         currentVersion: '',
         currentSource: '',
      }
   },
   methods: {
      handleFileUpload(fileType) {
         this.genbankFile = document.querySelector(`#${fileType}-upload-form`).file.files[0]
         this.showGenBankFile = true;
      },
      async uploadFile() {
         try {
            const formData = new FormData();
            formData.append('file', this.genbankFile);
            let response = await axios.post('/api/upload', formData);
            this.uploadedFilename = response.data.filename;
            this.showGenBankSuccessAlert = true;
            let successMessage = `<strong>${this.genbankFile.name}</strong> uploaded successfully!`;
            Vue.nextTick(() => {
               document.getElementById(`genbank-success-alert`).innerHTML = successMessage;
            });
            this.currentVersion = response.data.genbank.version
            this.currentSource = response.data.genbank.source
            this.genbank = true;
            // console.log(response.data.genbank)
         } catch (error) {
            console.log(error);
         }
      },
   },
};
</script>

<style scoped>
/* ----- Title and Alerts ----- */
h1 {
   margin: 40px auto;
}

.alert-primary {
   text-align: left;
   margin: 40px auto;
}

/* ----- Upload ----- */
.upload-wrapper {
   margin: 50px auto;
   margin-bottom: 20px;
}

.upload-title {
   margin: 15px auto;
}

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;
}

.btn-upload {
  border: 3px dashed gray;
  color: gray;
  background-color: white;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.selected-file {
   display: inline-block;
   /* text-align: left; */
   margin: 10px;
}

.selected-file strong {
   color: #474747;
   font-size: 16px;
   text-align: center;
}

.selected-file span {
   margin: 0;
   color: #474747;
   font-size: 16px;
   text-align: left;
}

.btn-upload-submit {
   display: block;
   margin:  auto;
   width: 100%;
}

/* ----- Rest of Page ----- */
#next-top {
   margin: 10px auto;
}

#next-bottom {
   margin: 20px auto;
}
</style>
