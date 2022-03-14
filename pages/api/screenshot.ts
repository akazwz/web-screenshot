import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer, { Browser } from 'puppeteer'
import { runCors } from '../../src/middleware/cors'

const getBrowserInstance = async () => {
  return puppeteer.launch({
    headless: true,
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
  let browser: Browser
  const defaultViewport = { width: 1280, height: 800 }
  try {
    browser = await getBrowserInstance()
    const page = await browser.newPage()
    await page.setViewport(defaultViewport)
    await page.goto(url)
    /*await page.waitForNetworkIdle({
      idleTime: 5000,
      timeout: 5000,
    })*/
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


