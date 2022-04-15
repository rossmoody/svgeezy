type SVGType =
  | 'inline'
  | 'sprite'
  | 'symbol'
  | 'img src'
  | 'object'
  | 'bg img'
  | 'invalid'
  | 'g'

class SVG {
  type: SVGType = 'invalid'
  cors = false
  spriteHref?: string
  imgSrcHref?: string
  dataSrcHref?: string
  viewBox?: string
  width?: number
  height?: number
  size?: string
  presentationSvg?: string
  spriteSymbolArray?: SVGSymbolElement[]

  readonly id = Math.random()

  constructor(public element: Element, public location: string) {
    this.determineType()
    this.buildSpriteElement()
  }

  private stringToElement(string: string) {
    const parser = new DOMParser()
    const { documentElement } = parser.parseFromString(string, 'image/svg+xml')
    return documentElement
  }

  private determineType() {
    const svgElement = this.element

    switch (this.element.tagName) {
      case 'svg': {
        this.type = 'inline'
        break
      }

      case 'symbol': {
        this.type = 'symbol'
        break
      }

      case 'g': {
        if (svgElement.id) {
          this.type = 'g'
        }
        break
      }

      case 'OBJECT': {
        this.type = 'object'
        this.dataSrcHref = (this.element as HTMLObjectElement).data
        break
      }

      case 'IMG': {
        this.type = 'img src'

        const imgSrc = (this.element as HTMLImageElement).src
        const hasSvgFilename = imgSrc.includes('.svg')
        const hasDataUriBgImg = imgSrc.includes('data:image/svg+xml;utf8')
        const hasBase64BgImg = imgSrc.includes('data:image/svg+xml;base64')

        if (hasBase64BgImg || hasSvgFilename) {
          this.imgSrcHref = imgSrc
        }

        if (hasDataUriBgImg) {
          const regex = /(?=<svg)(.*\n?)(?<=<\/svg>)/
          const svgString = regex.exec(imgSrc)

          if (svgString) {
            this.element = this.stringToElement(svgString[0])
          }
        }
        break
      }
    }
  }

  private createSvgElement() {
    const clone = this.element.cloneNode(true) as SVGSymbolElement

    const nameSpace = 'http://www.w3.org/2000/svg'
    const viewBox = clone.getAttribute('viewBox')
    const height = clone.getAttribute('height')
    const width = clone.getAttribute('width')
    const svgElement = document.createElementNS(nameSpace, 'svg')

    svgElement.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns',
      nameSpace
    )

    if (viewBox) svgElement.setAttribute('viewBox', viewBox)
    if (height) svgElement.setAttribute('height', height)
    if (width) svgElement.setAttribute('width', width)

    const useElement = document.createElementNS(nameSpace, 'use')
    useElement.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'xlink:href',
      `#${clone.id}`
    )

    svgElement.appendChild(clone)
    svgElement.appendChild(useElement)
    return svgElement
  }

  private buildSpriteElement() {
    if (this.type === 'symbol' || this.type === 'g') {
      this.type = 'sprite'
      this.element = this.createSvgElement()
    }
  }

  removeFillNone() {
    const fill = this.element.getAttribute('fill')
    const stroke = this.element.getAttribute('stroke')
    const hasFillNone = fill === 'none'
    const hasStroke = Boolean(stroke)
    if (hasFillNone && !hasStroke) {
      this.element.removeAttribute('fill')
    }
  }

  removeClass() {
    this.element.removeAttribute('class')
  }

  get isValid() {
    return this.type !== 'invalid'
  }

  get svgString() {
    return new XMLSerializer().serializeToString(this.element)
  }

  get whiteFill() {
    const whiteFills = ['#FFF', '#fff', '#FFFFFF', '#ffffff', 'white']
    const svgOuterHtml = this.element.outerHTML
    return whiteFills.some((fill) => svgOuterHtml.includes(fill))
  }
}

export default SVG
