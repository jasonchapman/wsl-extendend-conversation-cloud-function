const action = require('../../action.js')
const config = require('../support/test.config.json')

// Test an empty request
describe('base response testing', () => {
  it('should return a call without any enrichments', async (done) => {
    const response = await action({
      text: 'hello world'
    })
    expect(response).toBeDefined()
    expect(response).toEqual(jasmine.objectContaining({
      text: 'hello world'
    }))
    done()
  })
})

// Test a WCS request
describe('wcs response testing', () => {
  // Test a simple WCS request
  it('should return a call with wcs responses', async (done) => {
    const response = await action({
      text: 'hello world',
      wcs: {
        username: config.wcs.username,
        password: config.wcs.password,
        workspace_id: config.wcs.workspace_id
      }
    })
    expect(response).toBeDefined()
    expect(response).toEqual(jasmine.objectContaining({
      text: 'hello world',
      wcs: jasmine.objectContaining({
        intents: jasmine.any(Array),
        entities: jasmine.any(Array),
        output: jasmine.any(Object),
        context: jasmine.any(Object)
      }),
      nlu: {},
      ta: {}
    }))
    done()
  })
  // Test manually specifying intent/entity
  it('should allow entity and intent override', async (done) => {
    const intentOverride = [
      {
        intent: 'made_up',
        confidence: 1
      }
    ]
    const entityOverride = [
      {
        entity: 'made_up',
        location: [
          0,
          1
        ],
        value: 'made_up'
      }
    ]
    const response = await action({
      text: 'hello world',
      wcs: {
        username: config.wcs.username,
        password: config.wcs.password,
        workspace_id: config.wcs.workspace_id,
        intents: intentOverride,
        entities: entityOverride
      }
    })
    expect(response).toBeDefined()
    expect(response).toEqual(jasmine.objectContaining({
      text: 'hello world',
      wcs: jasmine.objectContaining({
        intents: intentOverride,
        entities: entityOverride,
        output: jasmine.any(Object),
        context: jasmine.any(Object)
      }),
      nlu: {},
      ta: {}
    }))
    done()
  })
  // Test that we throw an error correctly
  it('should throw an error if invalid information is sent', () => {
    // Expect an error to be thrown
    expect(action.bind(this, {
      text: 'hello world',
      wcs: {
        username: 'NOT ENOUGH INFORMATION'
      }
    })).toThrow()
  })
})

// Test NLU response
describe('nlu response testing', () => {
  // Test the default NLU request
  it('should return a call with default nlu responses', async (done) => {
    const response = await action({
      text: 'Watson is Artifical Intelligence',
      nlu: {
        username: config.nlu.username,
        password: config.nlu.password
      }
    })
    expect(response).toBeDefined()
    expect(response).toEqual(jasmine.objectContaining({
      text: 'Watson is Artifical Intelligence',
      nlu: jasmine.objectContaining({
        language: 'en',
        keywords: jasmine.any(Array),
        entities: jasmine.any(Array),
        concepts: jasmine.any(Array)
      })
    }))
    done()
  })
  // Test a specific NLU request
  it('should return a call with configured nlu responses', async (done) => {
    const response = await action({
      text: 'NLP is easy with NLU',
      nlu: {
        username: config.nlu.username,
        password: config.nlu.password,
        features: {
          semantic_roles: {}
        }
      }
    })
    expect(response).toBeDefined()
    expect(response).toEqual(jasmine.objectContaining({
      text: 'NLP is easy with NLU',
      nlu: jasmine.objectContaining({
        language: 'en',
        semantic_roles: jasmine.any(Array)
      })
    }))
    done()
  })
  // Test that we throw an error correctly
  it('should throw an error if invalid information is sent', () => {
    // Expect an error to be thrown
    expect(action.bind(this, {
      text: 'hello world',
      nlu: {
        username: 'NOT ENOUGH INFORMATION'
      }
    })).toThrow()
  })
})

// TODO These tests need to be written

// Test an tone analyzer request
xdescribe('ta response testing', () => {
  xit('should return a default ta response')
  xit('should return a configured ta response')
  xit('should throw an error if invalid information is sent')
})

// Test a composite request with all 3 services
xdescribe('composite response testing', () => {
  xit('should return a default composite response')
  xit('should return a configured composite response')
})
