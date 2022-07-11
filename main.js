/**
 * @file Project to demonstrate ability with node.js and docker for Campbell Scientific tier 3 position.
 *
 * @projectname CSI Assessment
 * @version 2.0
 * @author Forrest Olson
 * @copyright 2022
 *
 * @reference {@link https://stackoverflow.com/questions/30716438/default-home-text-and-content-for-jsdoc Reference}
 */

const AdmZip = require("adm-zip");
const path = require("path");
const https = require("https");
const fs = require("fs");

/**
 * Async function to retrieve the url contents from the web using https.
 *
 * @async
 *
 * @param {string} url - location of the resource to retrieve
 *
 * @returns Downloaded content
 *
 * {@link https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries Reference}
 */
async function get_zip(url) {
  return new Promise((resolve) => {
    https.get(url, (response) => {
      resolve(response);
    });
  });
}

/**
 * Async function to save web contents to file system.
 *
 * @async
 *
 * @param {IncomingMessage} content - Web content to save
 *
 * @returns Filepath of saved content
 */
async function save_zip(content) {
  const filename = "./Photos_To_Review.zip";
  const stream = fs.createWriteStream(filename);
  content.pipe(stream);
  return new Promise((resolve) => {
    stream.on("finish", () => {
      stream.close(() => {
        console.log("Download Completed");
        resolve(filename);
      });
    });
  });
}

/**
 * Async function to extract contents of an archive.
 *
 * @async
 *
 * @param {string} filepath - location of archive to extract
 *
 * @returns Location of extracted content
 *
 * {@link https://www.digitalocean.com/community/tutorials/how-to-work-with-zip-files-in-node-js Reference}
 */
async function extract_zip(filepath) {
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

/**
 * Function to list files from a directory in reverse order.
 *
 * @param {string} directory - location of directory
 *
 * {@link https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5 Reference}
 */
function list_files(directory) {
  const files = fs.readdirSync(directory);
  const fileListReversed = files.slice().reverse();
  fileListReversed.forEach((filename) => console.log(filename));
}

/**
 * Main function to combine logic of downloading, saving, extracting, and listing files from remote archive.
 */
async function main() {
  let response = await get_zip(
    "https://downloads.campbellcloud.io/assessment/202009/Photos_To_Review.zip"
  );
  let file = await save_zip(response);
  let unzipped_folder = await extract_zip(file);
  list_files(unzipped_folder);
}

main();
