import MaxLength from './maxLength'
import MinLength from './minLength'
import Required from './required'
import NotEqual from './notEqual'
import Pattern from './pattern'
import Integer from './integer'
import Double from './double'
import Equal from './equal'
import Email from './email'
import Min from './min'
import Max from './max'
import Gte from './gte'
import Lte from './lte'
import URL from './url'

const Validate = {
  required: (value: string) => Required(value),
  email: (value: string) => Email(value),
  min: (min: number) => (value: string) => Min(value, min),
  max: (max: number) => (value: string) => Max(value, max),
  minLength: (minLength: number) => (value: string) => MinLength(value, minLength),
  maxLength: (maxLength: number) => (value: string) => MaxLength(value, maxLength),
  pattern: (pattern: RegExp) => (value: string) => Pattern(value, pattern),
  double: (precision?: number) => {
    if (precision) {
      return (valueInput: string) => Double(valueInput, precision)
    } else {
      return Double
    }
  },
  integer: (value: string) => Integer(value),
  equal: (value: string) => (valueEqual: string) => Equal(value, valueEqual),
  NotEqual: (value: string) => (valueEqual: string) => NotEqual(value, valueEqual),
  gte: (value: string) => (valueEqual: string) => Gte(value, valueEqual),
  lte: (value: string) => (valueEqual: string) => Lte(value, valueEqual),
  url: (value: string) => URL(value),
}

export default Validate
