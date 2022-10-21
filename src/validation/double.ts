const Double = (value: string, precision?: number): string => {
  if (!value) return

  if (!Number(value) && Number(value) !== 0) {
    return 'input.error.double'
  }

  if (precision) {
    if (value.length - 1 - value.indexOf('.') > precision) return 'input.error.double_precision'
  }

  if (/^0[0-9]/.test(value)) return 'input.error.double_precision'
}

export default Double
