const URL = (value: string) => {
  if (!value) return

  const valid = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.?[a-zA-Z0-9()]{0,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(value)
  if (!valid || /(\W)\1+/.test(value.slice(7))) return 'input.error.url'
}

export default URL
