#!/usr/bin/env node
import * as cdk from "aws-cdk-lib"
import {TicTacToeFrontEndStack} from "../lib/TicTacToeFrontEndStack"
import path from "path"

const app = new cdk.App()

new TicTacToeFrontEndStack(
  app,
  "TicTacToeFrontEndStack",
  "tic-tac-toe.ruchij.com",
  path.resolve(__dirname, "../../build/client/"),
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: "us-east-1"
    }
  }
)