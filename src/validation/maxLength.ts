const MaxLength = (value: string, maxLength: number): string => {
  if (value.length > maxLength) return 'input.errors.max_length'
}

export default MaxLength
