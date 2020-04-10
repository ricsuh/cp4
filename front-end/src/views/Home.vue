<template>
<div class="container">
   <h1><strong>Phlash</strong></h1>

   <div class="alert alert-primary" align="left">
      <h5>Welcome to <strong><i>Phlash</i></strong>!</h5><br/>
      <p>
         <strong>To the TA grading this project:</strong><br/>
      </p>
      <p>
         This project is part of a greater application that I'm creating to
         reduce the manual intensivity of bacteriophage genome annotation. The
         workflow of this app is sequential. Once you complete all the steps
         provided on the current page, you can move on to the next page
         (i.e. once you download the file using the button below, a <i>Next</i>
         button will appear).
      </p>
      <p>
         <i><strong>***IMPORTANT***:</strong></i> The file that you will
         download below can be used to test this website. Ideally, a user would
         upload a file like the one you downloaded on the next step of
         <i>Phlash</i>. <i><strong>Or</strong></i> you can find your own file in
         the <a href="https://www.ncbi.nlm.nih.gov/Sitemap/samplerecord.html">
         GenBank file format</a> and try uploading your own!
      </p>
      <p>
         (But either way, I can guarantee that this website works with the file
         I provided. &#128578;) 
      </p>
      <div>
         <button class="btn btn-dark btn-download" type="button" @click="downloadFile">
            <strong>Download File</strong>
         </button>
      </div>
      <div class="next" v-show="downloadClicked">
         <router-link :to="{ name: 'Upload' }">
            <button class="btn btn-light"><strong>Next</strong></button>
         </router-link>
      </div>
   </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
   name: 'Home',
   data() {
      return {
         id: "",
         message: "",
         downloadClicked: false,
      }
   },
   methods: {
      downloadFile() {
         axios.get('/api/downloadFile')
         .then((response) => {
            let data = response.data;
            const blob = new Blob([data], { type: 'application/gb' })
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = `upload-this-file-next-step.gb`
            link.click()
            this.downloadClicked = true;
         });
      },
   }
}
</script>

<style scoped>
h1 {
   margin: 40px auto;
}

.next {
   margin-top: 30px;
}
</style>
