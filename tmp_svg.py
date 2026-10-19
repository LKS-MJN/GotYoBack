import re

with open('src/views/Components.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the ComponentIcon function
start = content.find('function ComponentIcon(')
# Find the end of the function (matching closing brace)
# The function ends before "const CATEGORY_LABEL"
end = content.find('const CATEGORY_LABEL')

# The new function with per-component SVGs
new_func = '''function ComponentIcon({ id, category }: { id: string; category: ComponentEntry["category"] }) {
  const c = "size-6 text-primary"
  switch (id) {
    case "resistor":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M2 12h4" />
          <path d="M4 12l1-3 2 6 2-6 2 6 2-6 2 6 1-3" />
          <path d="M18 12h4" />
          <rect x="7" y="9" width="2" height="6" fill="#d97706" stroke="none" />
          <rect x="11" y="9" width="2" height="6" fill="#1e3a8a" stroke="none" />
          <rect x="15" y="9" width="2" height="6" fill="#92400e" stroke="none" />
        </svg>
      )
    case "led":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 2v4" />
          <path d="M8 6h8l-4 8z" fill="currentColor" opacity="0.3" />
          <path d="M8 6h8l-4 8z" />
          <path d="M8 14h8" />
          <path d="M10 14v4M14 14v4" />
          <path d="M6 4l2 2M18 4l-2 2" stroke="#facc15" />
        </svg>
      )
    case "capacitor":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M2 12h8" />
          <path d="M10 6v12" />
          <path d="M14 6v12" />
          <path d="M14 12h8" />
        </svg>
      )
    case "diode":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M2 12h8" />
          <path d="M10 6l8 6-8 6z" fill="currentColor" opacity="0.3" />
          <path d="M10 6l8 6-8 6z" />
          <path d="M18 6v12" />
          <path d="M20 12h2" />
        </svg>
      )
    case "transistor":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="6" />
          <path d="M6 8l6 4-6 4" />
          <path d="M18 8v8" />
          <path d="M12 6v2M12 16v2" />
        </svg>
      )
    case "ldr":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 7v10M7 12h10" />
          <path d="M4 4l2 2M20 4l-2 2" stroke="#facc15" />
        </svg>
      )
    case "hc-sr04":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="2" y="8" width="20" height="8" rx="1" />
          <circle cx="7" cy="12" r="3" />
          <circle cx="17" cy="12" r="3" />
          <path d="M7 5v3M17 5v3" />
        </svg>
      )
    case "dht11":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <circle cx="12" cy="8" r="2" />
          <path d="M9 12h6M9 15h6M9 18h4" />
        </svg>
      )
    case "ir":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <circle cx="8" cy="12" r="2" fill="#ef4444" stroke="none" />
          <circle cx="16" cy="12" r="2" fill="#3b82f6" stroke="none" />
        </svg>
      )
    case "servo":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="8" width="16" height="8" rx="1" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 12l3-2" />
        </svg>
      )
    case "dc-motor":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4v-2M12 20v2M4 12h-2M20 12h2" />
        </svg>
      )
    case "l298n":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h12M6 12h12M6 16h8" />
        </svg>
      )
    case "relay":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8 10h2l2 4h2" />
          <circle cx="8" cy="10" r="1" fill="currentColor" />
        </svg>
      )
    case "buzzer":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M8 8l-4 2v4l4 2z" />
          <path d="M8 6v12" />
          <path d="M12 8c2 1 2 7 0 8" />
          <path d="M15 6c3 2 3 10 0 12" />
        </svg>
      )
    case "esp32":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h5" />
          <circle cx="12" cy="19" r="1" fill="#22c55e" />
        </svg>
      )
    case "arduino-uno":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h4M6 12h4M6 16h4M14 8h6M14 12h6" />
        </svg>
      )
    case "battery":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h3" />
          <path d="M12 2v2M12 20v2" />
          <text x="12" y="11" textAnchor="middle" fontSize="4" fill="currentColor">+</text>
        </svg>
      )
    // Fallback to category-based icons
    default:
      switch (category) {
        case "module":
          return (
            <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 9h10M7 13h10M7 17h6" />
            </svg>
          )
        case "passive":
          return (
            <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M3 12h18" />
            </svg>
          )
        case "input":
          return (
            <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <circle cx="12" cy="12" r="6" />
            </svg>
          )
        case "output":
          return (
            <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          )
        default:
          return null
      }
  }
}

'''

# Replace the old function
old_func_start = content.find('function ComponentIcon(')
old_func_end = content.find('const CATEGORY_LABEL')
old_func = content[old_func_start:old_func_end]
content = content.replace(old_func, new_func)

with open('src/views/Components.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ComponentIcon with per-component SVGs")