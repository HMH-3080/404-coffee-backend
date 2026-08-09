require("dotenv").config();

const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});



// const app = require("./app");

// const PORT = process.env.PORT || 5000;

// // start running the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });