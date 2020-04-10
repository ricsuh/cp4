<template>
<div class="container">
   <h1>Data</h1>
   <div class="alert alert-primary">
      <p><strong>Instructions</strong></p>
      <p>
         Below is the data from your uploaded GenBank file. If you would
         like to modify any of the gene calls, please
         <b>add</b>, <b>update</b>, or <b>delete</b> accordingly.
      </p>
   </div>
   
   <div id="phlash">
      <div class="info">
         <h3>{{ $route.params.source }}</h3>
         <h4>{{ $route.params.version }}</h4>
         </div>
      <div id="success-alert" class="alert alert-success" role="alert" v-if="showMessage">{{ message }}</div>
      <button class="btn btn-dark btn-sm" id="add-btn" align="center" v-b-modal.add-modal>
         <strong>Add a new gene call</strong>
      </button>
      <div class="table-responsive">
         <table class="table table-hover">
            <thead>
               <tr>
                  <th align="left">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Start</th>
                  <th scope="col">Stop</th>
                  <th scope="col">Strand</th>
                  <th scope="col">Product</th>
                  <th scope="col">Action</th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="(gene, index) in geneCalls" :key="index">
                  <td>{{ gene.id }}</td>
                  <td>{{ gene.name }}</td>
                  <td>{{ gene.start }}</td>
                  <td>{{ gene.stop }}</td>
                  <td>{{ gene.strand }}</td>
                  <td width="100px">{{ gene.product }}</td>
                  <td>
                     <div class="btn-group" role="group">
                        <button class="btn btn-dark btn-sm" id="update-btn" v-b-modal.update-modal @click="updateGene(gene)">
                           <strong>Update</strong>
                        </button>
                        <button class="btn btn-dark btn-sm" id="delete-btn" v-b-modal.delete-modal @click="deleteGene(gene)">
                           <strong>Delete</strong>
                        </button>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
   </div>
   <b-modal ref="addGeneModal" id="add-modal" title="Add a new CDS" hide-footer>
      <b-form @submit="onSubmitAdd" @reset="onResetAdd" align="left">
         <b-form-group label="ID:" label-for="add-id-input">
            <b-form-input id="add-id-input" type="text" v-model="newGene.id" required placeholder="Enter ID"></b-form-input>
         </b-form-group>
         <b-form-group label="Name:" label-for="add-name-input">
            <b-form-input id="add-name-input" type="text" v-model="newGene.name" required placeholder="Enter name"></b-form-input>
         </b-form-group>
         <b-form-group label="Start:" label-for="add-start-input">
            <b-form-input id="add-start-input" type="number" v-model="newGene.start" required placeholder="Enter start"></b-form-input>
         </b-form-group>
         <b-form-group label="Stop:" label-for="add-stop-input">
            <b-form-input id="add-stop-input" type="number" v-model="newGene.stop" required placeholder="Enter stop"></b-form-input>
         </b-form-group>
         <b-form-group label="Strand:">
            <b-form-select v-model="newGene.strand" :options="strandOptions"></b-form-select>
         </b-form-group>
         <b-form-group label="Product:" label-for="add-product-input">
            <b-form-input id="add-product-input" type="text" v-model="newGene.product" required placeholder="Enter product"></b-form-input>
         </b-form-group>
         <b-button class="modal-btn" type="submit" variant="success"><strong>Submit</strong></b-button>
         <b-button class="modal-btn" type="reset" variant="danger"><strong>Cancel</strong></b-button>
      </b-form>
   </b-modal>
   <b-modal ref="updateGeneModal" id="update-modal" title="Update CDS" hide-footer>
      <b-form @submit="onSubmitUpdate" @reset="onResetUpdate" align="left">
         <b-form-group label="Name:" label-for="update-start-input">
            <b-form-input id="update-name-input" type="text" v-model="updatedGene.name" required placeholder="Enter name"></b-form-input>
         </b-form-group>
         <b-form-group label="Start:" label-for="update-start-input">
            <b-form-input id="update-start-input" type="number" v-model="updatedGene.start" required placeholder="Enter start position"></b-form-input>
         </b-form-group>
         <b-form-group label="Stop:" label-for="update-stop-input">
            <b-form-input id="update-stop-input" type="number" v-model="updatedGene.stop" required placeholder="Enter stop position"></b-form-input>
         </b-form-group>
         <b-form-group label="Strand:">
            <b-form-select v-model="updatedGene.strand" :options="strandOptions"></b-form-select>
         </b-form-group>
         <b-form-group label="Product:" label-for="update-start-input">
            <b-form-input id="update-product-input" type="text" v-model="updatedGene.product" required placeholder="Enter product"></b-form-input>
         </b-form-group>
         <b-button class="modal-btn" type="submit" variant="success"><strong>Submit</strong></b-button>
         <b-button class="modal-btn" type="reset" variant="danger"><strong>Cancel</strong></b-button>
      </b-form>
   </b-modal>
   <b-modal ref="deleteGeneModal" id="delete-modal" title="Warning" hide-footer>
      <b-form @submit="onSubmitDelete" @reset="onResetDelete" align="left">
         <p>Are you sure you want to delete this gene?</p>
         <ul>
            <li><strong>ID:</strong> {{ deletedGene.id }}</li>
            <li><strong>Name:</strong> {{ deletedGene.name }}</li>
            <li><strong>Start:</strong> {{ deletedGene.start }}</li>
            <li><strong>Stop:</strong> {{ deletedGene.stop }}</li>
            <li><strong>Strand:</strong> {{ deletedGene.strand }}</li>
            <li><strong>Product:</strong> {{ deletedGene.product }}</li>
         </ul>
         <b-button class="modal-btn" type="submit" variant="success"><strong>Yes, delete it</strong></b-button>
         <b-button class="modal-btn" type="reset" variant="danger"><strong>No, cancel</strong></b-button>
      </b-form>
   </b-modal>
</div>
</template>

<script>
import axios from 'axios';

export default {
   data() {
      return {
         geneCalls: [],
         newGene: {
            name: '',
            id: '',
            start: null,
            stop: null,
            strand: '',
            product: ''
         },
         updatedGene: {
            name: '',
            id: '',
            start: null,
            stop: null,
            strand: '',
            product: ''
         },
         deletedGene: {
            name: '',
            id: '',
            start: null,
            stop: null,
            strand: '',
            product: ''
         },
         strandOptions: [
            { value: null, text: 'Please select a direction' },
            { value: '+', text: '+ (Direct)' },
            { value: '-', text: '- (Complementary)' }
         ],
         message: '',
         showMessage: false,
      };
   },
   created() {
      this.getData();
   },
   methods: {
      // ---------- GET DATA ----------
      async getData() {
         try {
            let response = await axios.get(`/api/data`);
            this.geneCalls = response.data;
            // console.log(this.geneCalls)
            return true;
         } catch (error) {
            console.log(error);
         }
      },
      // ---------- ADD DATA ----------
      async addData(payload, geneID) {
         try {
            await axios.post(`/api/data`, payload)
            this.message = `${geneID} added!`;
            this.showMessage = true;
            this.getData();
            return true;
         } catch (error) {
            console.log(error);
         }
      },
      onSubmitAdd(evt) {
         evt.preventDefault();
         this.$refs.addGeneModal.hide();
         const payload = {
            id: this.newGene.id,
            name: this.newGene.name,
            start: this.newGene.start,
            stop: this.newGene.stop,
            strand: this.newGene.strand,
            product: this.newGene.product
         };
         this.addData(payload, this.newGene.id);
         this.initForm();
      },
      onResetAdd(evt) {
         evt.preventDefault();
         this.$refs.addGeneModal.hide();
         this.initForm();
         this.getData();
      },
      // ---------- UPDATE DATA ----------
      async updateData(payload, geneID) {
         try {
            await axios.put(`/api/data/${geneID}`, payload)
            this.message = `${geneID} updated!`;
            this.showMessage = true;
            this.getData();
            return true;
         } catch (error) {
            console.log(error);
         }
      },
      updateGene(gene) {
         this.updatedGene.id = gene.id;
         this.updatedGene.name = gene.name;
         this.updatedGene.start = gene.start;
         this.updatedGene.stop = gene.stop;
         this.updatedGene.strand = gene.strand;
         this.updatedGene.product = gene.product;
      },
      onSubmitUpdate(evt) {
         evt.preventDefault();
         this.$refs.updateGeneModal.hide();
         const payload = {
            id: this.updatedGene.id,
            name: this.updatedGene.name,
            start: this.updatedGene.start,
            stop: this.updatedGene.stop,
            strand: this.updatedGene.strand,
            product: this.updatedGene.product
         };
         this.updateData(payload, this.updatedGene.id);
      },
      onResetUpdate(evt) {
         evt.preventDefault();
         this.$refs.updateGeneModal.hide();
         this.initForm();
         this.getData();
      },
      // ---------- DELETE DATA ----------
      async deleteData(geneID) {
         try {
            await axios.delete(`/api/data/${geneID}`);
            this.message = `${geneID} deleted!`;
            this.showMessage = true;
            this.getData();
            return true;
         } catch (error) {
            console.log(error)
         }
      },
      deleteGene(gene) {
         this.deletedGene.id = gene.id;
         this.deletedGene.name = gene.name;
         this.deletedGene.start = gene.start;
         this.deletedGene.stop = gene.stop;
         this.deletedGene.strand = gene.strand;
         this.deletedGene.product = gene.product;
      },
      onSubmitDelete(evt) {
         evt.preventDefault();
         this.$refs.deleteGeneModal.hide();
         this.deleteData(this.deletedGene.id);
      },
      onResetDelete(evt) {
         evt.preventDefault();
         this.$refs.deleteGeneModal.hide();
         this.initForm();
         this.getData();
      },
      // ---------- INITIALIZE MODALS ---------- //
      initForm() {
         this.newGene.id = '';
         this.newGene.start = '';
         this.newGene.stop = '';
         this.newGene.strand = '';
         this.updatedGene.id = '';
         this.updatedGene.start = '';
         this.updatedGene.stop = '';
         this.updatedGene.strand = '';
         this.deletedGene.id = '';
         this.deletedGene.start = '';
         this.deletedGene.stop = '';
         this.deletedGene.strand = '';
      },
   },
};
</script>

<style scoped>
h1 {
   margin: 40px auto;
}

.info {
   margin: 20px auto;
}

.alert-primary {
   text-align: left;
   margin: 40px auto;
}

.alert-success {
   margin: 30px auto;
}

table {
   text-align: left;
}

.btn-bottom {
   margin-bottom: 50px;
}

#add-btn {
   margin: 10px auto;
}

#update-btn, #delete-btn {
   margin: auto 3px;
}

/* ----- Modals ----- */
.modal-btn {
   margin: 5px;
}

.strand-dropdown {
   width: 100%;
   text-align: left;
   border: none;
   background: none;
}
</style>