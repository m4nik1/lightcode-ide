import http from "node:http";

const port = Number(process.env.PORT ?? 3000);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const sendJson = (
  response: http.ServerResponse,
  statusCode: number,
  body: unknown,
) => {
  response.writeHead(statusCode, {
    ...corsHeaders,
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(body));
};

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders);
    response.end();
    return;
  }

  if (request.url === "/") {
    sendJson(response, 200, { message: "Server is running" });
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
