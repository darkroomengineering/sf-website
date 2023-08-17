export default async function handler(req, res) {
  try {
    const bodyData = {
      channel: `${process.env.SLACK_CHANNEL_ID}`,
      ...JSON.parse(req.body),
    }

    const resp = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify(bodyData),
    })

    if (!resp.ok) {
      console.log('error code', resp)
      throw new Error(`Failed to send message: ${resp.status}`)
    }

    const response = await resp.json()
    res.status(200).json(response)
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error })
  }
}
