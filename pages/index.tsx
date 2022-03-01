import type { NextPage } from 'next'
import {
  Input,
  Image,
  Button,
  VStack,
  Heading,
  Skeleton,
  FormLabel,
  Container,
  FormControl,
  AspectRatio,
} from '@chakra-ui/react'
import { FormEvent, useState } from 'react'

const Home: NextPage = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [url, setUrl] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setImgSrc(null)
    setShow(true)
    fetch(`/api/screenshot?url=${encodeURI(url)}`).then((res) => {
      if (res.status !== 200) {
        alert('error')
        return
      }
      res.json().then((dataRes) => {
        const { base64 } = dataRes
        setImgSrc(base64)
      })
    })
  }

  return (
    <Container
      minH="100vh"
      minW="100vw"
      p={7}
      bg={'gray.900'}
    >
      <VStack spacing={10}>
        <Heading>Website Capture</Heading>
        <FormControl
          maxW="sm"
          rounded="lg"
          borderStyle="dotted"
          borderWidth="3px"
          p={7}
        >
          <FormLabel>
            WebSite URL:
          </FormLabel>
          <Input
            type="url"
            value={url}
            onChange={(e) => {setUrl(e.target.value)}}
          />
          <Button
            type="submit"
            onClick={handleSubmit}
            colorScheme="blue"
            mt={3}
          >
            Submit
          </Button>
        </FormControl>
        {
          show
            ? <AspectRatio w={{ base: 'sm', sm: 'md', md: 'xl', lg: '3xl', }} ratio={1280 / 800}>
              <Skeleton
                isLoaded={imgSrc !== null} w="100%" h="100%"
                rounded="lg"
              >
                <Image
                  alt="website screenshot"
                  src={`data:image/gif;base64,${imgSrc}`}
                />
              </Skeleton>
            </AspectRatio>
            : null
        }
      </VStack>
    </Container>
  )
}

export default Home
