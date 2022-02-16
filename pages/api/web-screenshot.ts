// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer'
import chromium from 'chrome-aws-lambda'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  if (typeof url !== 'string') {
    res.status(400).json({ msg: 'params error' })
    return
  }
  /* dev and prod */
  const browser = process.env.NODE_ENV === 'development'
    ? await puppeteer.launch({ defaultViewport: { width: 1280, height: 800 } })
    : await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        ...chromium.defaultViewport,
        width: 1280,
        height: 800,
      },
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      env: {
        ...process.env,
      }
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
