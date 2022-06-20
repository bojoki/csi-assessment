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
    return outputDir;

  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

function readFolder(foldername) {
    // REF: https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
    fs.readdir("./"+foldername, (err, files) => {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      // reverse order
      let fileListReversed = files.slice().reverse()
      fileListReversed.forEach(filename => console.log(filename));
      // normal order
      // files.forEach(file => console.log(file));
    });
}
function downloadResource(resource) {}
function saveResource(filename, resource) {
  const file = fs.createWriteStream(filename);
  resource.pipe(file);

  // after download completed close filestream
  file.on("finish", async () => {
    file.close();
    console.log("Download Completed");
    let outputDirectory = await extractArchive(filename)
    readFolder(outputDirectory)
  });
}

async function main() {
  // REF: https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
  https.get("https://downloads.campbellcloud.io/assessment/202009/Photos_To_Review.zip", (response) => {
    let filename = "Photos_To_Review.zip"
    saveResource(filename, response)
  
  });
}

main();