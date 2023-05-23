const hubspotFormApi = async (id) => {
  try {
    const resp = await fetch(
      `https://api.hubapi.com/marketing/v3/forms/${id}`,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
      }
    )
    const response = await resp.json()
    return apiParser(id, response)
  } catch (err) {
    return err
  }
}

const apiParser = (id, data) => {
  const typeSetter = (type) => {
    switch (type) {
      case 'phone':
        return 'single_line_text'
      case 'email':
        return 'single_line_text'
      default:
        return type
    }
  }

  const legalConsentOptions =
    data?.legalConsentOptions?.communicationsCheckboxes || null

  const removeHTML = (htmlText) =>
    htmlText.replace('<p>', '').replace('</p>', '')

  return {
    portalId: process.env.HUSBPOT_PORTAL_ID,
    id: id,
    inputs: data.fieldGroups.map((item) => {
      const flatData = item.fields[0]
      return {
        name: flatData?.name || '',
        label: flatData?.label || '',
        placeholder: flatData?.placeholder || 'placeHolder',
        required: flatData?.required || false,
        hubspotType: typeSetter(flatData.fieldType),
        type: flatData.fieldType || '',
        hidden: flatData.hidden || false,
        helpText: flatData?.helpText || '',
        options: flatData.options
          ? flatData.options.map((option) => option.label)
          : [],
      }
    }),
    submitButton: {
      text: data.displayOptions.submitButtonText || 'LFG',
    },
    legalConsent: legalConsentOptions
      ? {
          // required: legalConsentOptions[0]?.required || false,
          required: true,
          subscriptionTypeId: legalConsentOptions[0].subscriptionTypeId,
          label: removeHTML(legalConsentOptions[0].label),
          disclaimer: [
            removeHTML(data.legalConsentOptions.privacyText),
            removeHTML(data.legalConsentOptions.consentToProcessText),
          ],
        }
      : { required: false },
    actions: {
      redirect:
        data.configuration.postSubmitAction.type === 'redirect_url'
          ? true
          : false,
      redirectValue: data.configuration.postSubmitAction.value,
    },
  }
}

export const getForm = async (formId, handler = async () => {}) => {
  const form = {
    form: await hubspotFormApi(
      formId || 'de44d66e-443e-4708-beb5-538221a0e90c'
    ),
  }

  await handler(form)

  return form
}
