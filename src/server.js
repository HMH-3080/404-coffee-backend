require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

// start running the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});