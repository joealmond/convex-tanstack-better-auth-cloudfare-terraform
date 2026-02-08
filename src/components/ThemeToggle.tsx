import { useEffect, useMemo, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/cn'

type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeMode>('system')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isThemeMode(stored)) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const prefersDark = media.matches
      const useDark = theme === 'dark' || (theme === 'system' && prefersDark)
      root.classList.toggle('dark', useDark)
    }

    applyTheme()

    if (theme === 'system') {
      const handleChange = () => applyTheme()
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }
  }, [theme])

  const nextTheme = useMemo<ThemeMode>(() => {
    if (theme === 'system') return 'light'
    if (theme === 'light') return 'dark'
    return 'system'
  }, [theme])

  const { icon, label } = useMemo(() => {
    if (theme === 'light') {
      return { icon: Sun, label: 'Light' }
    }
    if (theme === 'dark') {
      return { icon: Moon, label: 'Dark' }
    }
    return { icon: Monitor, label: 'System' }
  }, [theme])

  const Icon = icon

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className={cn(
        'fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full border border-border',
        'bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm',
        'transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      aria-label={`Switch theme (current: ${label})`}
      title={`Theme: ${label}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}
