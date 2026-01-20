/**
 * Card Component
 * A reusable card container component
 */
const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  }

  const roundings = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-2xl',
  }

  return (
    <div 
      className={`
        bg-white 
        ${paddings[padding]} 
        ${shadows[shadow]} 
        ${roundings[rounded]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
