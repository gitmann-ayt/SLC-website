#!/usr/bin/env node
/** node automation/notify.mjs <to> <subject> <body file>: sends a plain-text email through SES. */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [to, subject, bodyFile] = process.argv.slice(2);
const from = process.env.SLC_MAIL_FROM || to;
const body = readFileSync(bodyFile, "utf8").slice(0, 200_000);
const input = {
  FromEmailAddress: `SLC automation <${from}>`,
  Destination: { ToAddresses: [to] },
  Content: { Simple: { Subject: { Data: subject.slice(0, 180), Charset: "UTF-8" }, Body: { Text: { Data: body, Charset: "UTF-8" } } } },
};
const file = join(tmpdir(), `slc-mail-${process.pid}.json`);
writeFileSync(file, JSON.stringify(input));
execFileSync("aws", ["sesv2", "send-email", "--cli-input-json", `file://${file}`], { stdio: "inherit" });
