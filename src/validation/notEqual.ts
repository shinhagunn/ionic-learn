const NotEqual = (value: string, valueEqual: string) => {
  if (!value) return

  if (value !== valueEqual) {
    return 'input.errors.equal'
  }
}

export default NotEqual
