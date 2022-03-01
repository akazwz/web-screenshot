import cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'

const corsI = cors({
  methods: ['GET', 'HEAD']
})

export function runCors(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    corsI(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}