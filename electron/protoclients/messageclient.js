const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const path = require('path');
const PROTO_PATH = path.join(__dirname, '../protofiles/unary.proto')
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const UnaryService = grpc.loadPackageDefinition(packageDefinition).unary.Unary;
// console.log(grpc.loadPackageDefinition(packageDefinition).unary);
// console.log(grpc.loadPackageDefinition(packageDefinition).unary.Unary);

const client = new UnaryService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
module.exports = { unaryclient: client }