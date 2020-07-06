import FileSaver from 'file-saver'
import JSZip from 'jszip'

const download = {
  createRegDownload(i) {
    const blob = new Blob([i.svgString], { type: 'text/xml' })
    FileSaver.saveAs(blob, 'gobbler-icon.svg')
  },

  copyRegClipboard(i) {
    const el = document.createElement('textarea')
    el.value = i.svgString
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  },

  downloadAll(i) {
    const zip = new JSZip()
    i.forEach((svg, index) => {
      zip.file(`svg-${index}.svg`, svg.svgString)
    })
    zip.generateAsync({ type: 'blob' }).then(content => {
      FileSaver.saveAs(content, 'gobbled_svgs.zip')
    })
  },
}

export default download
