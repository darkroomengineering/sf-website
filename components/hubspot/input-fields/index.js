import cn from 'clsx'
import { Select, SelectItem } from 'components/forms/select'
import { slugify } from 'lib/slugify'
import { forwardRef } from 'react'
import s from './input-fields.module.scss'

const InputField = forwardRef(
  (
    {
      name = '',
      label = '',
      type = '',
      error = '',
      pattern = undefined,
      placeholder = '',
      value = '',
      onChange,
      onBlur,
      required,
    },
    ref
  ) => {
    return (
      <div className={s.wrapper} ref={ref}>
        <label
          htmlFor={slugify(name)}
          className={cn(s.label, 'p-xs text-uppercase text-muted')}
        >
          {label} {required && '*'}
        </label>
        <input
          type={type}
          id={slugify(name)}
          className={cn(s.input)}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
        />
        {error?.type === 'required' && (
          <strong className={cn('p-s', s.error)}>'{label}'' is required</strong>
        )}
        {error?.type === 'validate' && (
          <>
            <strong className={cn('p-s', s.error)}>
              '{label}'' is invalid.
            </strong>
            {pattern && (
              <strong className={cn('p-s', s.error)}>{pattern}</strong>
            )}
          </>
        )}
      </div>
    )
  }
)

const TextArea = forwardRef(
  (
    {
      name = '',
      label = '',
      type = '',
      error = '',
      pattern = undefined,
      placeholder = '',
      value = '',
      onChange,
      onBlur,
      required,
    },
    ref
  ) => {
    return (
      <div className={s.wrapper} ref={ref}>
        <label
          htmlFor={slugify(name)}
          className={cn(s.label, 'p-xs text-uppercase text-muted')}
        >
          {label} {required && '*'}
        </label>
        <textarea
          type={type}
          id={slugify(name)}
          className={s.textarea}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
        />
        {error?.type === 'required' && (
          <strong className={cn('p-s', s.error)}>{label} is required</strong>
        )}
        {error?.type === 'validate' && (
          <>
            <strong className={cn('p-s', s.error)}>{label} is invalid.</strong>
            {pattern && (
              <strong className={cn('p-s', s.error)}>{pattern}</strong>
            )}
          </>
        )}
      </div>
    )
  }
)

const MultipleCheckboxField = forwardRef(
  ({ name = '', label = '', register, options, required }, ref) => {
    return (
      <div className={s['multiple-checkboxes']} ref={ref}>
        <label
          htmlFor={name}
          className={cn('p-xs text-muted text-uppercase', s.label)}
        >
          {label} {required && '*'}
        </label>
        {options.map((option) => (
          <label
            className={s.checkbox}
            htmlFor={option}
            key={`checkbox-${option}`}
          >
            <input
              id={option}
              type="checkbox"
              value={option}
              name={name}
              {...register(name.toLowerCase())}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    )
  }
)

const SelectField = forwardRef(
  (
    {
      name = '',
      label = '',
      options,
      placeholder = '',
      required = false,
      onChange = () => {},
      onBlur = () => {},
    },
    ref
  ) => {
    return (
      <div className={s.wrapper} ref={ref}>
        <label
          htmlFor={slugify(name)}
          className={cn(s.label, 'p-xs text-uppercase text-muted')}
        >
          {label} {required && '*'}
        </label>
        <Select
          placeholder={placeholder}
          className={s.select}
          name={name}
          required={required}
          onValueChange={(e) => {
            onChange(e)
            onBlur(e)
          }}
        >
          {options.map((option, i) => (
            <SelectItem key={i} value={option}>
              {option}
            </SelectItem>
          ))}
        </Select>
      </div>
    )
  }
)

InputField.displayName = 'InputField'
TextArea.displayName = 'TextArea'
MultipleCheckboxField.displayName = 'MultipleCheckboxField'
SelectField.displayName = 'SelectField'

export { InputField, TextArea, MultipleCheckboxField, SelectField }
