import { NextRequest } from 'next/server'

export default function middleware (req: NextRequest) {
  const { geo } = req
  console.log(geo?.country)
}