import {useState} from 'react';
export default function useInput (options) {
  const [value, setValue] = useState(options.value || '')
  return {
    name: options.name,
    type: options.type,
    value: value,
    onChange: event => setValue(event.target.value)
  }
}
