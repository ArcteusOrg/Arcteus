const express = require("express");
const http = require("http");
const path = require("path");
const sirv = require("sirv");

const api = express();
api.listen(3000); // lol

if (process.env.NODE_ENV === "production") {
  const serve = sirv(path.join(__dirname, "../../frontend/dist"), {
    single: true,
    etag: true,
    maxAge: 31536000,
    immutable: true,
    ignores: [/^\/assets\//],
  });

  http.createServer(serve).listen(3001);
}
