#!/usr/bin/env node

import {launch} from "puppeteer";
import HeartPing from 'heart-ping'
import chalk from "chalk";
import * as ansiEscapes from "ansi-escapes";

function progress(state: string) {
    process.stdout.write(`\r${chalk.bgYellow.black(` ${state} `)}${ansiEscapes.eraseEndLine}`)
}


(async () => {
    progress("Launching");
    const browser = await launch({headless: true, slowMo: 100});
    const page = await browser.newPage();
    page.on("dialog", (dialog) => dialog.accept());

    progress("Visiting page");
    await page.goto("http://192.168.1.1", {waitUntil: "networkidle0"});

    progress("Logging in");
    await page.keyboard.type("admin");
    await page.keyboard.press("Tab");
    await page.keyboard.type("admin");
    await page.keyboard.press("Enter");

    progress("Clicking button");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.evaluate(() => {
        // @ts-ignore
        document.querySelector("#listfrm").contentDocument.body.querySelector("#link_User_4").click();
        // @ts-ignore
        document.querySelector("#listfrm").contentDocument.body.querySelector("#link_User_4_1").click();
        // @ts-ignore
        // setTimeout(() => document.querySelector("#contentfrm").contentDocument.body.querySelector("button").click(), 1000);
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    progress("Closing");
    await page.close();
    await browser.close();

    progress("Pinging");
    const ping = new HeartPing();
    let pings = 0;

    ping.setBeatTimeout(1000);
    ping.setOnTimeout(updatePings);
    await new Promise((resolve) => {
        ping.start("http://example.com", 80, () => {
            progress("Finished");
            process.stdout.write('\n');
            process.stdout.destroy();
            ping.stop();
            resolve();
        }, updatePings)
    });

    function updatePings() {
        progress(`Waiting ${++pings}`);
    }

})();
