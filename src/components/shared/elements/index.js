
import Container from './container'
import Grid from './grid'
import GridCell from './gridCell'
import Heading from './heading'
import Section from './section'

const elements = {
  Container,
  Grid,
  GridCell,
  Heading,
  Section
}

export const components = Object.entries(elements).reduce((acc, [key, data]) => {
  acc[key] = data.component
  return acc
}, {})

export default {
  ...elements
}
