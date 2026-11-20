const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");
const sirv = require("sirv");
const { LRUCache } = require('lru-cache')

const options = {
  ttl: 1000 * 60 * 5,
  maxSize: 5000,
  sizeCalculation: (value, key) => {
    return Buffer.byteLength(JSON.stringify(value));
  },
}
const cache = new LRUCache(options)

const api = express();
api.use(express.json());
api.use(cookieParser());
injectModules();
api.set("cache",cache);
api.listen(3004); // lol

if (process.env.NODE_ENV === "production") {
  const serve = sirv(path.join(__dirname, "../../frontend/dist"), {
    single: true,
    etag: true,
    maxAge: 31536000,
    immutable: true,
    ignores: [/^\/assets\//],
  });

  http.createServer(serve).listen(3008);
}

async function injectModules(){
  require("./api/mod")(api);
}

