import type { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'chrome-aws-lambda'
import { Browser } from 'puppeteer'
import type { Browser as BrowserCore } from 'puppeteer-core'
import { runCors } from '../../src/middleware/cors'

const getBrowserInstance = async () => {
  const executablePath = await chromium.executablePath

  if (!executablePath) {
    // running locally
    const puppeteer = await import('puppeteer')
    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      ignoreHTTPSErrors: true,
    })
  }

  return chromium.puppeteer.launch({
    executablePath,
    args: chromium.args,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  await runCors(req, res)
  const { url } = req.query
  if (typeof url !== 'string') {
    res.status(400).json({ msg: 'params error' })
    return
  }
  let browser: Browser | BrowserCore | null = null
  const defaultViewport = { width: 1280, height: 800 }
  try {
    await chromium.font('/NotoSansSC-Medium.otf')
    browser = await getBrowserInstance()
    const page = await browser.newPage()
    await page.setViewport(defaultViewport)
    await page.goto(url)
    await page.waitForNetworkIdle()
    const base64 = await page.screenshot({
      encoding: 'base64',
    })
    await browser.close()
    res.status(200).json({ base64: base64 })
    return
  } catch (e: unknown) {
    console.log(e)
    res.status(400).json({ msg: 'error' })
  }
}


