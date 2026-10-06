const selectClassName =
  'rounded-md border border-text-secondary/30 bg-surface px-3 py-2 font-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50'

function SelectField({ label, id, value, onChange, options, required, disabled }) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={id} className="font-body text-sm font-medium text-text-primary">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClassName}
      >
        <option value="">Select {label.replace('*', '')}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectField
