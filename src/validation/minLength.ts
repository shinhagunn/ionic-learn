const MinLength = (value: string, minLength: number) => {
  if (!value) return

  if (value.length < minLength) return 'input.errors.min_length'
}

export default MinLength
