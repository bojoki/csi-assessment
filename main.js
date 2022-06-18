const AdmZip = require("adm-zip")
const path = require("path")
const https = require('https')
const fs = require('fs')

// REF: https://www.digitalocean.com/community/tutorials/how-to-work-with-zip-files-in-node-js
async function extractArchive(filepath) {
  try {
    const zip = new AdmZip(filepath)
    const outputDir = `${path.parse(filepath).name}_extracted`;
    zip.extractAllTo(outputDir);
    console.log(`Extracted to "${outputDir}" successfully!`);
    // REF: https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
    fs.readdir(outputDir, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      let filesReverse = files.slice().reverse()
      filesReverse.forEach(file => console.log(file));
      // files.forEach(file => console.log(file));
  });
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

// REF: https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
const file = fs.createWriteStream("Photos_To_Review.zip");
const request = https.get("https://downloads.campbellcloud.io/assessment/202009/Photos_To_Review.zip", function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed");
       extractArchive("./Photos_To_Review.zip")
   });
});