const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fs = require('fs');
const genbankParser = require('genbank-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Connect to the database
mongoose.connect('mongodb://localhost:27017/phlash', {
  useNewUrlParser: true
});

// Configure multer so that it will upload to './uploads'
const multer = require('multer')
const upload = multer({
   dest: './uploads/',
});

// Create a scheme for gene calls
const geneSchema = new mongoose.Schema({
   id: String,
   name: String,
   start: Number,
   stop: Number,
   strand: String,
   product: String
});
 
// Create a model for items in the museum.
const Gene = mongoose.model('Item', geneSchema);

// Download a file -- for TA use
app.get('/api/downloadFile', (req, res) => {
   // res.download('./fern.gb');
   var files = fs.createReadStream("fern.gb");
   res.writeHead(200, {'Content-disposition': 'attachment; filename=fern.gb'}); //here you can add more headers
   files.pipe(res)
})

// Upload a GenBank file. Parse the file and add each feature to MongoDB.
app.post('/api/upload', upload.single('file'), async (req, res) => {
   // Just a safety check
   if (!req.file) return res.sendStatus(400);
   // Delete all in database before adding
   try {
      await Gene.deleteMany({});
   } catch (error) {
      console.log(error)
   }
   // Parse genbank file and add to database
   const genbank = fs.readFileSync('./uploads/' + req.file.filename, 'utf-8');
   const result = genbankParser(genbank);
   let features = result[0].features
   features.forEach(async cds => {
      if (cds.type === "CDS") {
         const gene = new Gene({
            id: cds.notes.protein_id[0],
            name: cds.name,
            start: cds.start,
            stop: cds.end,
            strand: (cds.strand === 1) ? "+" : "-",
            product: cds.notes.product[0]
         })
         try {
            await gene.save();
         } catch (error) {
            console.log(error)
         }
      }
   });
   // Send genbank results to front end
   res.send({
      genbank: result[0]
   });
});

// Get a list of all genes in the database.
app.get('/api/data', async (req, res) => {
   try {
      let genes = await Gene.find().sort({start:1});
      res.send(genes);
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
});

// Add a gene to the database
app.post('/api/data', async (req, res) => {
   const gene = new Gene({
      id: req.body.id,
      name: req.body.name,
      start: req.body.start,
      stop: req.body.stop,
      strand: req.body.strand,
      product: req.body.product
   });
   try {
      await gene.save();
      res.sendStatus(200);
   } catch (error) {
      console.log(error)
      res.sendStatus(500);
   }
})

// Update a gene in the database
app.put("/api/data/:id", async (req, res) => {
   let gene = await Gene.findOne({
      id: req.params.id
   });
   gene.id = req.body.id
   gene.name = req.body.name
   gene.start = req.body.start
   gene.stop = req.body.stop
   gene.strand = req.body.strand
   gene.product = req.body.product
   try {
      await gene.save()
      res.sendStatus(200);
   } catch(error) {
      console.log(error);
      res.sendStatus(500);
   }
})

// Delete a gene from the database
app.delete("/api/data/:id", async (req, res) => {
   try {
      await Gene.deleteOne({
         id: req.params.id
      })
      res.sendStatus(200);
   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
})

// Start app
app.listen(3000, () => console.log('Server listening on port 3000!'));