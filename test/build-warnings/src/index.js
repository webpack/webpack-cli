let module;

try {
  module = require('unknown');  
} catch (e) {
    // Ignore
}

export default module
