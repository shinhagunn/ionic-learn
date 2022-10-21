const Max = (value: string, max: number): string => {
  if (!value) return

  if (Number(value) > max) return 'input.errors.max'
}

export default Max
