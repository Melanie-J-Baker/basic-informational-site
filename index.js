const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const filepath = path.join(
    __dirname,
    req.url === "/" ? "index.html" : req.url
  );
  console.log("Sending request", path.basename(filepath));
  const ext = path.extname(filepath);
  let contentType = "text/html";
  switch (ext) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
  }

  fs.readFile(filepath, (err, data) => {
    if (err) {
      if (err.code == "ENOENT") {
        console.log("404 File not found!");
        fs.readFile(path.join(__dirname, "404.html"), "utf-8", (err, data) => {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error ${err.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
      console.log("Finished");
    }
  });
});

server.listen(8080, () => console.log("Listening on port 8080"));
