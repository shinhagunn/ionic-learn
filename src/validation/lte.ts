const Gte = (value: any, valueEqual: string): string => {
  if (!value) return

  if (value > valueEqual) {
    return 'input.errors.less_than_equal'
  }
}

export default Gte
