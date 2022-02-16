// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const browser = await puppeteer.launch({defaultViewport: {width: 1280, height: 800}})
  const page = await browser.newPage()
  await page.goto('https://fhub-admin.vercel.app/')
  const base64 = await page.screenshot({
    encoding: 'base64',
    fullPage: true,
  })
  await browser.close()
  res.status(200).json({ base64: base64 })
}
