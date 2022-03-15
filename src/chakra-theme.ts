import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  useSystemColorMode: true,
}

const chakraTheme = extendTheme({ config })

export default chakraTheme