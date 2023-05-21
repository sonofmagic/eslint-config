//  str.match(/node_modules[\\\/]([\\\/\w\.@-]+)$/)
export function slash(path: string) {
  const isExtendedLengthPath = path.startsWith('\\\\?\\')

  if (isExtendedLengthPath) {
    return path
  }

  return path.replace(/\\/g, '/')
}

export function eslintFormatParser(str: string) {
  if (typeof str === 'string') {
    str = slash(str)
    const idx = str.lastIndexOf('node_modules')
    if (idx > -1) {
      return str.slice(idx)
    }
    return str
  }
  return str
}
