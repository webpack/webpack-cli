const express = require("express");
const app = express();
const PORT = 5678;

app.use(express.static("docs"));
app.listen(PORT, () =>
	console.log("Docs are being served at\n" + `http://127.0.0.1:${PORT}\n` + `http://localhost:${PORT}\n`)
);
