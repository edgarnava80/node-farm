const fs = require("fs")
const http = require("http")
const url = require("url")
const replaceTemplate = require("./modules/replaceTemplate")

const slugify = require("slugify")

////////////////////////////////////////
/////////// FILES
// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)
// const textOut = `This is what we know about the avocado ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/text.txt', textOut)
// console.log('File has been written')

//Non-blocking asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!")
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2)
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3)

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//         console.log("File has been written 😄")
//       })
//     })
//   })
// })
// console.log("will read file")

////////////////////////////////////////
/////////// SERVER

// This is executed once at the beginning

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8")
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8")
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8")
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")

const dataObj = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))

console.log(slugs)

const server = http.createServer((req, res) => {
  //const pathName = req.url
  const { query, pathname } = url.parse(req.url, true)

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" })

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("")
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml)

    res.end(output)

    // Product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id]
    res.writeHead(200, { "Content-type": "text/html" })
    const output = replaceTemplate(tempProduct, product)
    res.end(output)

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" })
    res.end(data)

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world"
    })
    res.end("<h1>Page not found!</h1>")
  }
})
//  192.168.15.6 or 192.168.11.94,95
server.listen(8000, "192.168.11.95", () => {
  console.log("Listening to requests on port 8000")
})
