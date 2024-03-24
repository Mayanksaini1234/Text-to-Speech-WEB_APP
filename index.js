import  express  from "express";
import axios from "axios";
import ejs from "ejs";
import bodyParser from "body-parser";
import textToSpeech from "@google-cloud/text-to-speech";
import fs from "fs";
import util from "util";
let port = 3000;
let app = express();
app.use(express.static("public"));
import dotenv from "dotenv";
dotenv.config();
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")

app.get("/", (req,res)=>{
      res.render("index.ejs", {});
  })

// const textToSpeech = require('@google-cloud/text-to-speech');

// require("dotenv").config();
// // Import other required libraries
// const fs = require('fs');
// const util = require('util');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();
app.post("/speech",async(req,res)=> {
try{
// The text to synthesize
const data = req.body.text;
  const text = data;

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

// Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  // await writeFile('output.mp3', response.audioContent, 'binary');
  // console.log('Audio content written to file: output.mp3');
  const outputPath = 'public/audio/output.mp3';
await writeFile(outputPath, response.audioContent, 'binary');
console.log('Audio content written to file: output.mp3');
  // res.send("file done")
res.render("index.ejs", {data:outputPath})
} catch(error){
console.error("error speech", error);
res.status(500).send("error geneartion speech")
}
})

app.listen(port, () => {
  console.log(`Port ${port} is ready`);
});