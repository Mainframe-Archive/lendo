import { createGlobalStyle } from 'styled-components'
import { defaultFontFamily, defaultFontSize, defaultTextColor } from './theme'

import MuliRegularLatinExt from 'fonts/Muli-Regular-LatinExt.woff2'
import MuliRegularLatin from 'fonts/Muli-Regular-Latin.woff2'
import MuliSemiboldLatinExt from 'fonts/Muli-Semibold-LatinExt.woff2'
import MuliSemiboldLatin from 'fonts/Muli-Semibold-Latin.woff2'

export default createGlobalStyle`
  /* latin-ext */
  @font-face {
    font-family: 'Muli';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Muli Regular'), local('Muli-Regular'), url(${MuliRegularLatinExt}) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Muli';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Muli Regular'), local('Muli-Regular'), url(${MuliRegularLatin}) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Muli';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local('Muli SemiBold'), local('Muli-SemiBold'), url(${MuliSemiboldLatinExt}) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Muli';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local('Muli SemiBold'), local('Muli-SemiBold'), url(${MuliSemiboldLatin}) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  
  html {
    font-size: ${defaultFontSize};
  }

  body {
    background-color: white;
    margin: 0;
    font-family: ${defaultFontFamily};
    color: ${defaultTextColor};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  #root {
    display: flex;
    height: 100vh;
  }
`
