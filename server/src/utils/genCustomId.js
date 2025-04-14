// utils/generateCustomId.js
function generateCustomId(role, sequenceNumber) {
    let prefix;
    if (role === 'retailer') prefix = 'RET';
    else if (role === 'supplier') prefix = 'SUP';
    else if (role === 'admin') prefix = 'ADM';
    else prefix = 'USR';
  
    // Pad number to 4 digits → 0001, 0023, etc.
    const paddedNumber = String(sequenceNumber).padStart(4, '0');
  
    return `${prefix}-${paddedNumber}`;
  }
  
  export {generateCustomId};
  