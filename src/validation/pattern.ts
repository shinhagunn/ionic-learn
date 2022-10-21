const Pattern = (value: string, pattern: RegExp) => {
  if (!value) return

  const valid = pattern.test(value)
  if (!valid) return 'input.error.pattern'
}

export default Pattern
