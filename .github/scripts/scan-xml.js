/**
 * Scan Empty XML Fields for Description and Help
 *
 * Description:
 * Reads each xml file from Objects folder and checks if help and
 * description tag were empty. Prompts error when empty.
 *
 * @copyright 2023, ERP Success Partners
 * @author Xavier Grajo
 *
 */

const fs = require('fs');
const path = require('path');

const manualReadFileContent = (xmlFile, fileName) => {
  // exitWithError boolean
  let exitWithErrorBool = false;
  // Sample XML file as a string
  const xmlString = xmlFile;

  // Split the XML string into lines
  const lines = xmlString.split('\n');

  // Initialize variables to keep track of line number and help tag count
  let lineNumber = 0;
  let helpTagCount = 0;
  let descriptionTagCount = 0;

  // Loop through each line of the XML
  for (let i = 0; i < lines.length; i++) {
    lineNumber += 1;
    const line = lines[i].trim();

    // Skip empty lines
    if (line.length === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // Check if the line contains a <help> tag
    if (line.includes('<help>') && line.includes('</help>')) {
      helpTagCount += 1;
      console.log(`Help tag found on line ${lineNumber}`);
      // Do something with the help tag, e.g. extract its content
      const helpText = line.substring(line.indexOf('>') + 1, line.lastIndexOf('<'));
      console.log(`Help text: ${helpText}`);
      const isHelpEmpty = helpText.length === 0;
      if (isHelpEmpty === true) {
        const helpTitleLog = 'Empty <help> element found, please update HELP tag for proper documentation.';

        console.log(`::error file=${fileName},line=${lineNumber}::${helpTitleLog}`);
        // console.log(`::error::Empty <help> element found in ${fileName}, please update HELP tag for proper documentation. #L${lineNumber}`);
        exitWithErrorBool = true;
      }
      console.log(`Help tag content is empty: ${isHelpEmpty}`);
    } else if (line.includes('<description>') && line.includes('</description>')) {
      // eslint-disable-next-line no-plusplus
      descriptionTagCount += 1;
      console.log(`Description tag found on line ${lineNumber}`);
      // Do something with the help tag, e.g. extract its content
      const descriptionText = line.substring(line.indexOf('>') + 1, line.lastIndexOf('<'));
      console.log(`Description text: ${descriptionText}`);
      const isHelpEmpty = descriptionText.length === 0;
      if (isHelpEmpty === true) {
        const descTitleLog = 'Empty <description> element found, please update DESCRIPTION tag for proper documentation.';
        // console.log(`::error::Empty <description> element found in ${fileName}, please update DESCRIPTION tag for proper documentation. #L${lineNumber}`);
        console.log(`::error file=${fileName},line=${lineNumber}::${descTitleLog}`);
        exitWithErrorBool = true;
      }
      console.log(`Help tag content is empty: ${isHelpEmpty}`);
    }
  }


  // Print a message if no help tags were found
  if (helpTagCount === 0) {
    console.log('No help tags found in the XML.');
  }

  // Print a message if no DESCRIPTION tags were found
  if (descriptionTagCount === 0) {
    console.log('No description tags found in the XML.');
  }

  return exitWithErrorBool;
};

const scanDir = (dirPath) => {
  const xmlFiles = [];
  const files = fs.readdirSync(dirPath);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      xmlFiles.push(...scanDir(filePath)); // recursively call scanDir
    } else if (stats.isFile() && file.endsWith('.xml')) {
      xmlFiles.push(filePath);
    }
  }
  return xmlFiles;
};
let xmlFiles = [];
const directoryPath = './src/Objects';
// Check if directory exists
if (fs.existsSync(directoryPath)) {
  console.log(`Directory at path ${directoryPath} exists.`);
  xmlFiles = scanDir(directoryPath);
} else {
  console.log(`Directory at path ${directoryPath} does not exist.`);
}

let exitWithErrorBool = false;

xmlFiles.forEach((file) => {
  const xml = fs.readFileSync(file, 'utf8');
  const currScenarioBool = manualReadFileContent(xml, file);

  if (currScenarioBool === true) {
    exitWithErrorBool = true;
  }
});

if (exitWithErrorBool === true) {
  process.exitCode = 1;
}

