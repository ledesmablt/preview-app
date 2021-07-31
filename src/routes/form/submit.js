export async function post(req, res) {
  console.log(req.body)
  res.setHeader('Content-Type', 'application/json')
  res.writeHead(200)
  res.end('OK')
}
