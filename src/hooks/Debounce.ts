import { debounce } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function useDebouncedFunction<T extends any[]>(func: (...args: T) => void, delay = 500): (...args: T) => void {
  const debouncedFunction = useMemo(
    () => debounce(func, delay),
    [func, delay]
  );
  
  return (...args: T) => debouncedFunction(...args);
}