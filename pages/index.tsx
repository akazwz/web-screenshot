import { FormEvent, useState } from 'react'
import type { NextPage } from 'next'
import {
  Input,
  Image,
  Stack,
  Slider,
  Switch,
  HStack,
  Button,
  Tooltip,
  Heading,
  Skeleton,
  FormLabel,
  Container,
  InputGroup,
  FormControl,
  AspectRatio,
  SliderThumb,
  NumberInput,
  SliderTrack,
  InputLeftElement,
  NumberInputField,
  SliderFilledTrack,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  useToast, useColorModeValue,
} from '@chakra-ui/react'
import isUrl from 'is-url'
import { AutoHeightOne, AutoWidth, LinkOne } from '@icon-park/react'

const Home: NextPage = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [url, setUrl] = useState<string>('')
  const [width, setWidth] = useState<number>(1280)
  const [height, setHeight] = useState<number>(800)
  const [timeout, setTimeout] = useState<number>(15)
  const [sleep, setSleep] = useState<number>(0)
  const [isFull, setIsFull] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)

  const [quality, setQuality] = useState(70)
  const [showTooltip, setShowTooltip] = useState(false)

  const toast = useToast()

  /* 校验参数 */
  const validateParams = () => {
    if (!isUrl(url)) {
      toast({
        title: '非法url',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    if (sleep >= timeout) {
      toast({
        title: '睡眠时间不能大于等于超时时间',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
      return
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    validateParams()
    setImgSrc(null)
    setShow(true)
    const input = `http://localhost:8000/screenshot?url=${encodeURI(url)}&width=${width}&height=${height}&full=${isFull}&quality=${quality}&timeout=${timeout}&sleep=${sleep}`
    fetch(input)
      .then((res) => {
        if (res.status !== 200) {
          toast({
            title: '截屏失败',
            status: 'error',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
          setShow(false)
          return
        }
        res.json().then((dataRes) => {
          toast({
            title: '截屏成功',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          })
          const { base64 } = dataRes
          setImgSrc(base64)
        })
      })
      .catch((e) => {
        console.log(e)
        setShow(false)
      })
  }

  return (
    <Container
      minH="100vh"
      minW="100vw"
      p={7}
      bg={useColorModeValue('white', 'gray.900')}
    >
      <Heading textAlign="center" mb={5}>Website Capture</Heading>
      <Stack direction={'column'} alignItems="center" spacing={7}>
        <FormControl
          w={{ base: 'sm', sm: 'md', md: 'xl', lg: '3xl', }}
          rounded="lg"
          borderStyle="dotted"
          borderWidth="3px"
          alignItems="center"
          p={3}
        >
          <Stack direction={{ base: 'column', md: 'row' }} mb={3}>
            {/* 网址 url */}
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
              >
                <LinkOne/>
              </InputLeftElement>
              <Input
                placeholder={'website url'}
                type="url"
                value={url}
                onChange={(e) => {setUrl(e.target.value)}}
              />
            </InputGroup>
          </Stack>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={3} mb={3}>
            {/* 截图宽度 */}
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
              >
                <AutoWidth/>
              </InputLeftElement>
              <Input
                placeholder={'screen width'}
                type="number"
                value={width}
                onChange={(e) => {setWidth(Number(e.target.value))}}
              />
            </InputGroup>

            {/* 截图高度 */}
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
              >
                <AutoHeightOne/>
              </InputLeftElement>
              <Input
                placeholder={'screen height'}
                type="number"
                value={height}
                onChange={(e) => {setHeight(Number(e.target.value))}}
              />
            </InputGroup>

            {/* 是否截取全屏 */}
            <HStack
              borderStyle="dashed"
              borderWidth="3px"
              alignItems="center"
              p={3}
            >
              <FormLabel htmlFor={'switch-full'} w="100%" mb={0}>
                full?
              </FormLabel>
              <Switch id={'switch-full'} isChecked={isFull} onChange={() => setIsFull(!isFull)}/>
            </HStack>
          </Stack>

          <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
            <HStack
              borderStyle="dashed"
              borderWidth="3px"
              alignItems="center"
              p={3}
            >
              {/* 超时时间 */}
              <FormLabel htmlFor="timeout" mb={0}>
                timeout:
              </FormLabel>
              <NumberInput
                id="timeout"
                min={5}
                max={15}
                size="md"
                maxH="50px"
                defaultValue={timeout}
                value={timeout}
                onChange={(value) => setTimeout(Number(value))}
              >
                <NumberInputField/>
                <NumberInputStepper>
                  <NumberIncrementStepper/>
                  <NumberDecrementStepper/>
                </NumberInputStepper>
              </NumberInput>
            </HStack>

            <HStack
              borderStyle="dashed"
              borderWidth="3px"
              alignItems="center"
              p={3}
            >
              {/* 睡眠时间 */}
              <FormLabel htmlFor="sleep" mb={0}>
                sleep:
              </FormLabel>
              <NumberInput
                id="sleep"
                min={0}
                max={timeout}
                size="md"
                maxH="50px"
                defaultValue={sleep}
                value={sleep}
                onChange={(value) => setSleep(Number(value))}
              >
                <NumberInputField/>
                <NumberInputStepper>
                  <NumberIncrementStepper/>
                  <NumberDecrementStepper/>
                </NumberInputStepper>
              </NumberInput>
            </HStack>

            {/* 截图质量 */}
            <HStack
              borderStyle="dashed"
              borderWidth="3px"
              alignItems="center"
              p={3}
            >
              <FormLabel htmlFor={'quality-base'} mb={0} display={{ base: 'block', md: 'none' }}>
                quality
              </FormLabel>
              <FormLabel htmlFor={'quality-md'} mb={0} display={{ base: 'none', md: 'block' }}>
                quality
              </FormLabel>

              <Slider
                id={'quality-base'}
                display={{ base: 'flex', md: 'none' }}
                aria-label="quality slider"
                orientation="horizontal"
                defaultValue={quality}
                min={0}
                max={100}
                colorScheme="teal"
                onChange={(v) => {
                  setShowTooltip(true)
                  setQuality(v)
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderTrack>
                  <SliderFilledTrack/>
                </SliderTrack>
                <Tooltip
                  display={{ base: 'flex', md: 'none' }}
                  hasArrow
                  bg="teal.500"
                  color="white"
                  placement="top"
                  isOpen={showTooltip}
                  label={`${quality}%`}
                >
                  <SliderThumb/>
                </Tooltip>
              </Slider>

              <Slider
                id={'quality-md'}
                display={{ base: 'none', md: 'flex' }}
                aria-label="quality slider"
                orientation="vertical"
                minH="100px"
                defaultValue={quality}
                min={0}
                max={100}
                colorScheme="teal"
                onChange={(v) => setQuality(v)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <SliderTrack>
                  <SliderFilledTrack/>
                </SliderTrack>
                <Tooltip
                  display={{ base: 'none', md: 'flex' }}
                  hasArrow
                  bg="teal.500"
                  color="white"
                  placement="top"
                  isOpen={showTooltip}
                  label={`${quality}%`}
                >
                  <SliderThumb/>
                </Tooltip>
              </Slider>
            </HStack>
          </Stack>
          <Button
            type="submit"
            onClick={handleSubmit}
            colorScheme="blue"
            mt={3}
            isDisabled={!isUrl(url)}
          >
            Submit
          </Button>
        </FormControl>
      </Stack>

      <Stack alignItems="center" mt={3}>
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
      </Stack>
    </Container>
  )
}

export default Home
