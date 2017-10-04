const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')
const ConversationV1 = require('watson-developer-cloud/conversation/v1')
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3')

function main (params) {
  // Validate request
  if (!params.text) {
    throw new Error('no text present')
  } else if (params.nlu && (!params.nlu.username || !params.nlu.password)) {
    throw new Error('nlu requires username, password, optionally features, optionally language, and optionally version')
  } else if (params.wcs && (!params.wcs.username || !params.wcs.password || !params.wcs.workspace_id)) {
    throw new Error('wcs requires username, password, workspace, and optionally version')
  } else if (params.ta && (!params.ta.username || !params.ta.password)) {
    throw new Error('ta requires username, password, and optionally version')
  }

  const promises = []

  // If requested, return WCS results
  if (params.wcs) {
    // Build WCS connection
    const wcs = new ConversationV1({
      username: params.wcs.username,
      password: params.wcs.password,
      version_date: params.wcs.version || '2017-05-26'
    })

    promises.push(new Promise((resolve, reject) => {
      let wcsRequest = params.wcs
      // Set input
      wcsRequest.input = { text: params.text }
      wcs.message(wcsRequest, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    }))
  } else {
    promises.push(getEmptyPromise())
  }

  // If requested, return NLU results
  if (params.nlu) {
    // Build NLU connection
    const nlu = new NaturalLanguageUnderstandingV1({
      username: params.nlu.username,
      password: params.nlu.password,
      version_date: params.nlu.version || NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
    })
    const features = params.nlu.features || {
      entities: {},
      keywords: {},
      concepts: {}
    }

    // Promise to get NLU results
    promises.push(new Promise((resolve, reject) => {
      nlu.analyze({
        text: params.text,
        language: params.nlu.language || 'en',
        features: features
      }, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    }))
  } else {
    promises.push(getEmptyPromise())
  }

  // Promise to get Tone Analyzer results
  if (params.ta) {
    // Build tone analyzer connection
    const ta = new ToneAnalyzerV3({
      username: params.ta.username,
      password: params.ta.password,
      version_date: params.ta.version || '2016-05-19'
    })
    // TODO Add Tone Analyzer Piece
  } else {
    promises.push(getEmptyPromise())
  }

  // Execute these simulateneously and combine when both are complete
  return Promise.all(promises)
    .then((results) => {
      return {
        wcs: results[0],
        nlu: results[1],
        ta: results[2],
        text: params.text
      }
    })
    .catch((e) => {
      console.log(e)
      return 'error in watson composite service'
    })
}

function getEmptyPromise () {
  return new Promise((resolve) => {
    resolve({})
  })
}

module.exports = main
