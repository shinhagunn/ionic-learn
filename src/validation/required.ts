const Required = (value: any): string => {
  return !value ? 'input.errors.required' : ''
}

export default Required
