// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

function calcPath(relativePath) {
  return path.join(__dirname, relativePath);
}

const getEnvVariables = () => {
  return dotenv.parse(fs.readFileSync(calcPath('../../../.env')));
};

module.exports = { getEnvVariables };
