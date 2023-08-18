import cn from 'clsx'
import { useStore } from 'lib/store'
import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  InputField,
  MultipleCheckboxField,
  SelectField,
  TextArea,
} from './input-fields'

import s from './hubspot.module.scss'

const removeHTMLFromStrings = (data) => {
  const actionForEachType = (item) => {
    switch (typeof item) {
      case 'string':
        return item.replace(/(<([^>]+)>)/gi, '')
      case 'object':
        return item.map((elm) => elm.replace(/(<([^>]+)>)/gi, '')).join(';')
      default:
        console.log('Not secure parsing for this type:', typeof item)
        return item
    }
  }

  data.fields.forEach((item) => {
    item.value = actionForEachType(item.value)
  })
}

export const Hubspot = ({ form, children }) => {
  const [setShowThanks] = useStore((state) => [state.setShowThanks])

  const { register, control, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
  })

  const { errors, isSubmitting, isValid } = formState
  const [IP, setIP] = useState('')
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${form.portalId}/${form.id}`
  const formFields = form.inputs.map((field) => field.name)

  async function fetchIP() {
    const res = await fetch('https://ip.nf/me.json')
    res
      .json()
      .then((res) => setIP(res.ip.ip))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchIP()
  }, [])

  const onSubmit = (input) => {
    const hsCookie = document.cookie.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=').map((c) => c.trim())
      cookies[name] = value
      return cookies
    }, {})

    const data = {
      fields: formFields.map((item) => {
        return {
          name: item,
          value: input[item] || '',
        }
      }),
      context: {
        hutk: hsCookie?.hubspotutk,
        pageUri: `${window.location.href}`,
        pageName: `${window.location.pathname}`,
        ipAddress: `${IP}`,
      },
    }

    const dealData = {
      properties: {
        dealstage: 'bf25df15-53fb-48aa-9f5f-0fe15f725ea2',
        dealname: '',
        inquiry_date: new Date().toISOString().slice(0, 10),
        hubspot_owner_id: `${process.env.NEXT_PUBLIC_HUSBPOT_OWNER_ID}`,
      },

      associations: [],
    }

    let contactEmail = ''
    let dealID = ''

    data.fields.forEach((field) => {
      if (field.name === 'company') {
        dealData.properties.dealname = field.value
      }
      if (field.name === 'email') {
        contactEmail = field.value
      }
      // add more conditions if you want to map other fields
    })

    removeHTMLFromStrings(data)
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    fetch('/api/create-deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    })
      .then((res) => {
        if (res?.status === 'error') return
        return res.json()
      })
      .then((dealResponse) => {
        console.log('DEAL REPONSE', dealResponse.id)
        dealID = dealResponse.id

        const blockDealData = [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: ':rotating_light: New BizDev Inquiry :rotating_light:',
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Company Name:*\n${dealData.properties.dealname}`,
              },
              {
                type: 'mrkdwn',
                text: `*When:*\n${dealData.properties.inquiry_date}`,
              },
              {
                type: 'mrkdwn',
                text: `*Contact Info:*\n${contactEmail}`,
              },

              {
                type: 'mrkdwn',
                text: `*Review deal in hubspot:*\nhttps://app.hubspot.com/contacts/${process.env.NEXT_PUBLIC_HUSBPOT_TEAM_ID}/record/0-3/${dealID}`,
              },
            ],
          },
        ]

        fetch('/api/slack', {
          method: 'POST',
          body: JSON.stringify({
            blocks: blockDealData,
          }),
        })
      })
      .then((slackResponse) => {
        console.log({ slackResponse })

        if (form?.actions?.redirect && !!form.actions.redirectValue) {
          setShowThanks(true)
          setTimeout(() => {
            window.open(form.actions.redirectValue, '_self')
          }, 1000)
        } else {
          setShowThanks(true)
        }

        setTimeout(() => {
          reset()
        }, 1500)
      })

      .catch((failed) => {
        console.log({ failed })
        failed?.errors?.map((error) => {
          console.log('failed: ', error)
        })
      })
  }

  const helpers = {
    handlers: {
      handleSubmit,
      onSubmit,
      register,
      Controller,
      control,
      errors,
      MultipleCheckboxField,
      InputField,
      SelectField,
      isValid,
      isSubmitting,
      reset,
    },
    form: {
      id: form.id,
      fields: form.inputs,

      submitButton: form.submitButton,
    },
    legalConsent: form.legalConsent,
  }

  return children(helpers)
}

const FieldTypeSwitcher = ({ field, input, handlers }) => {
  const { errors, InputField, SelectField, register } = handlers

  switch (input.hubspotType) {
    case 'single_line_text':
      return (
        <InputField
          error={errors[input.name]}
          label={input.label}
          placeholder={input.placeholder}
          required={input.required}
          type={input.type}
          {...field}
        />
      )
    case 'number':
      return (
        <InputField
          error={errors[input.name]}
          label={input.label}
          placeholder={input.placeholder}
          required={input.required}
          type={input.type}
          {...field}
        />
      )
    case 'dropdown':
      return (
        <SelectField
          label={input.label}
          placeholder={input.placeholder}
          options={input.options}
          required={input.required}
          {...field}
        />
      )
    case 'multiple_checkboxes':
      return (
        <MultipleCheckboxField
          name={input.name}
          label={input.label}
          placeholder={input.placeholder}
          required={input.required}
          options={input.options}
          register={register}
          {...field}
        />
      )
    case 'multi_line_text':
      return (
        <TextArea
          error={errors[input.name]}
          label={input.label}
          placeholder={input.placeholder}
          required={input.required}
          type={input.type}
          {...field}
        />
      )
    default:
      console.log(
        'WARNING: Unknown Form Input Type and is not going to be render and may cause Form submiting problems. Type:',
        input.type,
      )
      return null
  }
}

const Form = ({ handlers, form, className, children, style }) => {
  return (
    <form
      className={className}
      onSubmit={handlers.handleSubmit(handlers.onSubmit)}
      id={form.id}
      style={style}
    >
      {form.fields
        .filter((item) => !item.hidden)
        .map((input, key) => {
          if (input.type.includes('multiple')) {
            return (
              <Fragment key={`form-input-${key}`}>
                <FieldTypeSwitcher
                  field={{}}
                  input={input}
                  handlers={handlers}
                />
              </Fragment>
            )
          }
          return (
            <handlers.Controller
              key={`form-input-${key}`}
              name={input.name}
              control={handlers.control}
              rules={{ required: input.required }}
              render={({ field }) => (
                <FieldTypeSwitcher
                  field={field}
                  input={input}
                  handlers={handlers}
                />
              )}
            />
          )
        })}
      <button type="submit" className={cn('button', s.button)}>
        {form.submitButton.text}
      </button>
      {children}
    </form>
  )
}

Hubspot.Form = Form
