try {
  JSON.parse("{ not valid json }");
} catch (error) {
  throw new Error("Failed to read settings", { cause: error });
}

module.exports = {};
