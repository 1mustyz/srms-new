const fs = require('fs')
// const path = require('path')
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')

/* start of helpers for dealing with decimals */
handlebars.registerHelper('averageDecimal', (average) => {
  average = parseFloat(average).toFixed(2)
  return average
})

handlebars.registerHelper('scoreDecimal', (score) => {
  score = parseFloat(score).toFixed(3)
  return score
})

handlebars.registerHelper('ifIsNaN', (score) => {
  if (isNaN(score)){
    return '0.0'
  }else{

    return score
  } 
})

handlebars.registerHelper('ifIsThirdTerm', (term) => {
  if (term == 3){
    return true
  }else{

    return false
  } 
})


/* end of helpers for dealing with decimals */

  
const createPDF = async (data) => {
  const templateHtml = fs.readFileSync('./views/results.html', { encoding: 'utf8', flag: 'r' })
  const template = handlebars.compile(templateHtml)
  const html = template(data)

  // const options = {
  //   width: '1230px',
  //   headerTemplate: '<p></p>',
  //   footerTemplate: '<p></p>',
  //   displayHeaderFooter: false,
  //   margin: {
  //     top: '10px',
  //     bottom: '30px',
  //     right: '15px'
  //   },
  //   printBackground: true,
  //   format: 'A4'
  //   // path: pdfPath
  // }

  // const browser = await puppeteer.launch({
  //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //   headless: true
  // })

  // const page = await browser.newPage()

  // await page.setContent(html, {
  //   waitUntil: 'networkidle0'
  // })

  // const pdf = await page.pdf(options)
  // await browser.close()
  return html
}

module.exports = createPDF
