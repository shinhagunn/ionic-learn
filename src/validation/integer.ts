const Integer = (value: string): string => {
  if (!value) return

  const valid = /^\d+$/.test(value)
  if (!valid) return 'input.error.integer'
}

export default Integer
