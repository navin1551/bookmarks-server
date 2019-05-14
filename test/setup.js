process.env.TZ = "UTC";
require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");
process.env.NODE_ENV = "test";

global.expect = expect;
global.supertest = supertest;
