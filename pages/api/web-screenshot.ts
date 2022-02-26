import type { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'chrome-aws-lambda'
import { addExtra } from 'puppeteer-extra'

// Add the Imports before StealthPlugin
import 'puppeteer-extra-plugin-stealth/evasions/chrome.app'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.csi'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes'
import 'puppeteer-extra-plugin-stealth/evasions/chrome.runtime'
import 'puppeteer-extra-plugin-stealth/evasions/defaultArgs' // pkg warned me this one was missing
import 'puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow'
import 'puppeteer-extra-plugin-stealth/evasions/media.codecs'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.languages'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.permissions'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.plugins'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.vendor'
import 'puppeteer-extra-plugin-stealth/evasions/navigator.webdriver'
import 'puppeteer-extra-plugin-stealth/evasions/sourceurl'
import 'puppeteer-extra-plugin-stealth/evasions/user-agent-override'
import 'puppeteer-extra-plugin-stealth/evasions/webgl.vendor'
import 'puppeteer-extra-plugin-stealth/evasions/window.outerdimensions'

const StealthPlugin = require('puppeteer-extra-plugin-stealth')

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  if (typeof url !== 'string') {
    res.status(400).json({ msg: 'params error' })
    return
  }

  const defaultViewPort = { width: 1280, height: 800 }

  let puppeteer
  let browser
  if (process.env.NODE_ENV === 'production') {
    puppeteer = addExtra(chromium.puppeteer)
    puppeteer.use(StealthPlugin())
    browser = await puppeteer.launch({
      executablePath: await chromium.executablePath,
      defaultViewport: defaultViewPort,
    })
  } else {
    puppeteer = require('puppeteer-extra')
    puppeteer.use(StealthPlugin())
    browser = await puppeteer.launch({ defaultViewport: defaultViewPort })
  }
  const page = await browser.newPage()
  await page.goto(url)
  const base64 = await page.screenshot({
    encoding: 'base64',
  })
  await browser.close()
  res.status(200).json({ base64: base64 })
  return
}
