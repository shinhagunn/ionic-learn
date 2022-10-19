import { createAnimation } from '@ionic/vue'

export const FindBy = <T>(list: T[], keys: string[], value: string) => {
  if (!value.length) return list

  return list.filter((item: any) => {
    for (const key of keys) {
      if (key.includes('.')) {
        const keys = key.split('.')
        let inv: any = null

        for (let index = 0; index < keys.length; index++) {
          const key = keys[index]

          if (index === 0) {
            inv = item[key]
          } else {
            inv = inv[key]
          }
        }

        if (inv.toString().toLowerCase().includes(value.toLowerCase())) {
          return true
        }
      } else if (item[key].toString().toLowerCase().includes(value.toLowerCase())) {
        return true
      }
    }

    return false
  })
}

export const SideToClass = (side: string, bg?: boolean) => {
  if (!bg) {
    return side === 'buy' ? 'text-up' : 'text-down'
  } else {
    return side === 'buy' ? 'bg-up' : 'bg-down'
  }
}

export const ChangePercentToClass = (change: string | number, bg?: boolean) => {
  if (typeof change === 'string') {
    change = parseFloat(change)
  }

  return SideToClass(change >= 0 ? 'buy' : 'sell', bg)
}

// export const EncryptEmail = (email: string) => {
//   const split = email.split('@')
//   const letter1 = split[0].substring(0, 1)
//   const letter2 = split[0].substring(split[0].length - 1, split[0].length)
//   let newFirst = letter1
//   for (let i = 0; i < split[0].length - 2; i++) {
//     newFirst += '*'
//   }
//   newFirst += letter2

//   const letter3 = split[1].substring(0, 1)
//   let extension = letter3
//   for (let i = 0; i < split[1].split('.')[0].length - 1; i++) {
//     extension += '*'
//   }
//   extension = extension.slice(0, 5)
//   extension += `.${split[1].split('.')[1]}`
//   const result = `${newFirst.slice(0, 5)}@${extension}`

//   return result
// }

export function normalizeArray<T>(arr: T[]): T | undefined {
  return Array.isArray(arr) ? arr[0] : arr
}

// export function CopyToClipboard(content: string) {
//   const aux = document.createElement('input')

//   aux.setAttribute('value', content)
//   document.body.appendChild(aux)
//   aux.select()
//   document.execCommand('copy')
//   document.body.removeChild(aux)
// }

// export function SelectElement(element: HTMLElement) {
//   const range = document.createRange()
//   range.selectNode(element)
//   window.getSelection()?.removeAllRanges()
//   window.getSelection()?.addRange(range)
// }

// export function ClearSelectElement() {
//   window.getSelection()?.removeAllRanges()
// }

export function UserAgentToBrowser(userAgent: string) {
  let nameOffset: number, verOffset: number

  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset = userAgent.indexOf('Opera')) !== -1) {
    return 'Opera'
  } else if ((verOffset = userAgent.indexOf('MSIE')) !== -1) {
    return 'Microsoft Internet Explorer'
  } else if ((verOffset = userAgent.indexOf('Chrome')) !== -1) {
    return 'Chrome'
  } else if ((verOffset = userAgent.indexOf('Safari')) !== -1) {
    return 'Safari'
  } else if ((verOffset = userAgent.indexOf('Firefox')) !== -1) {
    return 'Firefox'
  } else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) < (verOffset = userAgent.lastIndexOf('/'))) {
    return userAgent.substring(nameOffset, verOffset)
  }
}

export function UserAgentToOS(userAgent: string) {
  if (userAgent.includes('Win')) return 'Windows'
  if (userAgent.includes('Mac')) return 'MacOS'
  if (userAgent.includes('X11')) return 'UNIX'
  if (userAgent.includes('Linux')) return 'Linux'

  return 'Unknown OS'
}

export function RandomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// export function RoundNumber(n: string | number, precision: number): string {
//   if (typeof n === 'string') return RoundNumber(Number(n), precision)

//   return n.toFixed(precision)
// }

export const isObject = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function PopupAnimation(_: unknown, opts: any) {
  return createAnimation()
    .addElement(opts.enteringEl)
    .duration(200)
    .keyframes([
      { offset: 0, transform: 'translate(0, 100%)', opacity: 0.3 },
      { offset: 1, transform: 'translate(0, 0)', opacity: 1 },
    ])
}
