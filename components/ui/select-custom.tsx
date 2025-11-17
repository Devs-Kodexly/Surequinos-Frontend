import { ChevronDown } from "lucide-react"

interface SelectCustomProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string; disabled?: boolean }[]
  className?: string
}

export function SelectCustom({ name, value, onChange, options, className = "" }: SelectCustomProps) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#0F0B0A] border border-gray-800 rounded-md px-4 py-3 pr-10 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#AA3E11] focus:border-transparent ${className}`}
        style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', lineHeight: '140%', color: '#757575' }}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
            className={option.disabled ? 'text-gray-600' : ''}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
}
