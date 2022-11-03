//  str.match(/node_modules[\\\/]([\\\/\w\.@-]+)$/)

export function eslintFormatParser(str: string) {
  if (typeof str === 'string') {
    const idx = str.lastIndexOf('node_modules')
    if (idx > -1) {
      return str.slice(idx)
    }
    return str
  }
  return str
}
