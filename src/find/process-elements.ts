import SVG from './SVG'

async function processElements(strings: string[], location: string) {
  const elements = await Promise.all(
    strings
      .map((string) => new SVG(string, location))
      .filter((svg) => svg.isValid)
      .map((svg) => svg.findUriAndBase64())
      .map((svg) => svg.fetchSvgContent()),
  )
    .then((svgs) => svgs.filter((svg) => svg.isValid))
    .catch((error) => {
      console.error(error)
      return [] as SVG[]
    })

  return [...new Set(elements)]
}

export default processElements
