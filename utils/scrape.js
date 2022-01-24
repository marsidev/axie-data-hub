/* eslint-disable no-useless-escape */

const { chromium } = require('playwright')

const url = 'https://axie.live'
// const url = 'https://books.toscrape.com/'

const scrapeData = async () => {
  try {
    const timeline = []

    timeline.push(new Date())
    console.log('launching browser...')
    const browser = await chromium.launch({ headless: true })
    console.log(`launching browser took ${Date.now() - timeline.at(-1)}ms`)
    timeline.push(new Date())

    timeline.push(new Date())
    console.log('opening empty page...')
    const page = await browser.newPage()
    console.log(`opening empty page took ${Date.now() - timeline.at(-1)}ms`)

    timeline.push(new Date())
    console.log('navigating to url...')
    await page.goto(url)
    console.log(`navigating to url took ${Date.now() - timeline.at(-1)}ms`)

    // await page.waitFor(1000)

    timeline.push(new Date())
    console.log('getting html content...')

    // const html = await page.content()
    // await page.textContent('#root > div > div > div.relative.bg-main.shadow-lg.sm\:rounded-3xl.p-0.sm\:text-lg > div > div:nth-child(3) > div.pt-5.pb-2.text-base.leading-7.space-y-4 > div > table > tbody > tr')

    // const html = await page.evaluate(() => {
    //   const data = []
    //   const rows = document.querySelectorAll('#root > div > div > div.relative.bg-main.shadow-lg.sm\:rounded-3xl.p-0.sm\:text-lg > div > div:nth-child(3) > div.pt-5.pb-2.text-base.leading-7.space-y-4 > div > table > tbody > tr')
    //   for (const row of rows) {
    //     const cells = row.querySelectorAll('td')
    //     const temp = {
    //       name: cells[0].innerText,
    //       type: cells[1].innerText,
    //       rarity: cells[2].innerText
    //     }
    //     data.push(temp)
    //   }
    //   return data
    // })

    const content = await page.$$eval('.contents.sm\:table-row')
    // const content = await page.$$eval('.product_pod', allItems => {
    //   const data = []
    //   allItems.forEach(book => {
    //     const name = book.querySelector('h3').innerText
    //     const price = book.querySelector('.price_color').innerText
    //     const stock = book.querySelector('.availability').innerText
    //     data.push({ name, price, stock })
    //   })
    //   return data
    // })
    console.log(content)
    console.log(`getting html content took ${Date.now() - timeline.at(-1)}ms`)

    timeline.push(new Date())
    console.log('closing browser...')
    await browser.close()
    console.log(`closing browser took ${Date.now() - timeline.at(-1)}ms`)

    console.log(`time elapsed: ${Date.now() - timeline.at(0)}ms`)
  } catch (err) {
    console.error(err)
  }
}

scrapeData()

// module.exports = scrapeData
