const http = require("http");
const fs = require("fs");
const hostname = "127.0.0.1";
const port = 3000;

const readTodos = () => {
  const todos = fs.readFileSync("./todo.json", "utf8") || "[]";
  return todos;
};

const returnList = (items) => {
  let ul = "<ul>";
  items.forEach(item => {
    ul += `<li>${item.title}</li>`;
  });
  ul += '</ul>';
  return ul;
}

const returnImgs = (imgs, dir) => {
  let div = `<div style="text-align: center;">`;
  imgs.forEach((img) => {
    div += `<img style="max-width: 1140px;" src="./${dir}/${img}" />`;
  });
  div+="</div>";
  return div;
}

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/":
      res.setHeader("content-type", "text/html");
      const todos = JSON.parse(readTodos());
      let ul = returnList(todos);
      res.end(`
        <section>
          ${ul}
          <a href="/Nature">Nature</a>
          <a href="/Quotes">Quotes</a>
        </section>
      `);
      break;

    case "/Nature":
      res.setHeader("content-type", "text/html");
      const natureFiles = fs.readdirSync("./Nature");
      let natureDiv = returnImgs(natureFiles, "Nature");
      res.end(natureDiv);
      break;

    case "/Quotes":
      res.setHeader("content-type", "text/html");
      const quoteFiles = fs.readdirSync("./Quotes");
      let quoteDiv = returnImgs(quoteFiles, "Quotes");
      res.end(quoteDiv);
      break;
    default:
      const url = req.url.split("/");
      if (url[2]) {
        res.setHeader("content-type", "image/jpeg");
        const imageBuffer = fs.readFileSync(`./${url[1]}/${url[2]}`);
        res.end(imageBuffer);
      } else {
        res.statusCode = 404;
        res.end("<h1>Page not found</h1>");
      }
  }
});

server.listen(port, hostname);