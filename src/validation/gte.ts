const Gte = (value: any, valueEqual: string) => {
  if (!value) return

  if (value < valueEqual) {
    return 'input.errors.getter_than_equal'
  }
}

export default Gte
