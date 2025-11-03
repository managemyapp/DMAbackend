const crypto = require('crypto');

// Function to generate a JWT secret
function generateSecret(length) {
  return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, length) + 'dma';
}

// Generate JWT secrets
const jwtSecret = generateSecret(32);
const jwtSecretAdmin = generateSecret(64);

console.log(`JWT_SECRET='${jwtSecret}'`);
console.log(`JWT_SECRET_ADMIN='${jwtSecretAdmin}'`);