const glados = async () => {
  const cookie = process.env.GLADOS
  if (!cookie) return
  try {
    const headers = {
      'cookie': cookie,
      'referer': 'https://glados.rocks/console/checkin',
      'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    }
    const checkin = await fetch('https://glados.rocks/api/user/checkin', {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: '{"token":"glados.one"}',
    }).then((r) => r.json())
    const status = await fetch('https://glados.rocks/api/user/status', {
      method: 'GET',
      headers,
    }).then((r) => r.json())
    return [
      'Checkin OK',
      `${checkin.message}`,
      `Left Days ${Number(status.data.leftDays)}`,
    ]
  } catch (error) {
    return [
      'Checkin Error',
      `${error}`,
      `<${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}>`,
    ]
  }
}

const notify = async (contents) => {
  const token = process.env.NOTIFY
  if (!token || !contents) return
  await fetch(`https://bark-for-notifications.realzuanzuan.workers.dev/${token}/glados/${contents}?icon=https://raw.githubusercontent.com/zuanzuanshao/ImageHostingService/main/uPic/20240810133326.png`, {
    method: 'POST',
    // headers: { 'content-type': 'application/json' },
    // body: JSON.stringify({
    //   token,
    //   title: contents[0],
    //   content: contents.join('<br>'),
    //   template: 'markdown',
    // }),
  })
}

const main = async () => {
  await notify(await glados())
}

main()
