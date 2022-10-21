const Min = (value: string, min: number): string => {
  if (!value) return

  if (Number(value) < min) return 'input.errors.min'
}

export default Min
