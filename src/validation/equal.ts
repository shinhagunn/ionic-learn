const Equal = (value: any, valueEqual: string): string => {
  if (!value || !valueEqual) return ''

  if (value !== valueEqual) {
    return 'input.errors.equal'
  }
  return ''
}

export default Equal
