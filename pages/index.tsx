import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const [imgSrc, setImgSrc] = useState<string>('')

  useEffect(() => {
    fetch('/api/web-screenshot').then((res) => {
      if (res.status !== 200) {
        alert('error')
        return
      }
      res.json().then((dataRes) => {
        const { base64 } = dataRes
        setImgSrc(base64)
      })
    })
  }, [])
  return (
    <div className={styles.container}>
      <Image
        src={`data:image/gif;base64,${imgSrc}`}
        alt="Vercel Logo"
        width={600}
        height={375}
      />
    </div>
  )
}

export default Home
