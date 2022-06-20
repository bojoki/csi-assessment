// The idea here was to decompose each little function for easier to read and self-documenting code.
// Due to using callbacks, I found the result to be overcomplicated and harder to read, in turn defeating my initial purpose.

const AdmZip = require("adm-zip");
const path = require("path");
const https = require("https");
const fs = require("fs");

async function extractArchive(filepath) {
  // REF: https://www.digitalocean.com/community/tutorials/how-to-work-with-zip-files-in-node-js
  try {
    const zip = new AdmZip(filepath);
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
  fs.readdir("./" + foldername, (err, files) => {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    // reverse order
    let fileListReversed = files.slice().reverse();
    fileListReversed.forEach((filename) => console.log(filename));
    // normal order
    // files.forEach(file => console.log(file));
  });
}

function saveResource(filename, resource) {
  const file = fs.createWriteStream(filename);
  resource.pipe(file);

  // after download completed close filestream
  file.on("finish", async () => {
    file.close();
    console.log("Download Completed");
    let outputDirectory = await extractArchive(filename);
    readFolder(outputDirectory);
  });
}

function downloadResource(resource) {
  // REF: https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
  https.get(resource, (response) => {
    let filename = "Photos_To_Review.zip";
    saveResource(filename, response);
  });
}

function downloadSaveAndListFilenames() {
  let remoteFilename =
    "https://downloads.campbellcloud.io/assessment/202009/Photos_To_Review.zip";
  downloadResource(remoteFilename);
}

downloadSaveAndListFilenames();
