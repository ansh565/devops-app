const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello from Docker App - CI/CD Test 4");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
