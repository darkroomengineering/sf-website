export default async function handler(req, res) {
  try {
    const resp = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      body: req.body,
    })

    if (!resp.ok) {
      console.log('error code', resp)
      throw new Error(`Failed to create deal: ${resp.status}`)
    }

    const response = await resp.json()
    res.status(200).json(response)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
}
