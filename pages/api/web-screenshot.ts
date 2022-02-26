import type { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  if (typeof url !== 'string') {
    res.status(400).json({ msg: 'params error' })
    return
  }

  const defaultViewPort = { width: 1280, height: 800 }

  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath,
    defaultViewport: defaultViewPort,
  })
  const page = await browser.newPage()
  await page.goto(url)
  const base64 = await page.screenshot({
    encoding: 'base64',
  })
  await browser.close()
  res.status(200).json({ base64: base64 })
  return
}
