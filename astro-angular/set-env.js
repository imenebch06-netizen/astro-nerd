const fs = require('fs');
const targetPath = './src/environments/environment.ts';
const envConfigFile = `export const environment = {
  production: true,
  groqApiKey: '${process.env.GROQ_API_KEY || ''}'
};`;

fs.writeFileSync(targetPath, envConfigFile);