const test = require("tap").test;
const server = require("../fixtures/test-server");
const request = require("request-promise-native");

const responseForCssPackage = [
  ["inherits", "2.0.3"],
  ["source-map", "0.6.1"],
  ["source-map-resolve", "0.5.2"],
  ["urix", "0.1.0"],
  ["atob", "2.1.1"],
  ["decode-uri-component", "0.2.0"],
  ["resolve-url", "0.2.1"],
  ["source-map-url", "0.4.0"],
  ["urix", "0.1.0"]
];

test("setup", async t => {
  await server.start();
  t.pass("server available");
});

test("/package/css responds", async t => {
  const res = await request("http://localhost:3000/package/css/2.2.4", {
    resolveWithFullResponse: true
  });

  t.equal(res.statusCode, 200, "returns successful statuscode");
  t.equal(
    res.headers["content-type"],
    "application/json; charset=utf-8",
    "correct content type returned"
  );
});

test("/package/css gets transitive dependencies", async t => {
  const res = await request("http://localhost:3000/package/css/2.2.4", {
    resolveWithFullResponse: true,
    json: true
  });

  t.same(res.body, responseForCssPackage, "returns transitive dependency");
});

test("teardown", async () => {
  server.stop();
});
