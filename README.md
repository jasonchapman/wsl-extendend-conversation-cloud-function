# Extended Conversation Serverless function
This is simple serverless function that will combine responses as requested from *Watson Conversation Service*, *Watson Natural Language Understanding*, and *Watson Tone Analyzer*.

This is a serverless function suitable for deployment on a serverless runtime such as IBM's *Cloud Functions*. The action code is contained in `action.js`

To include a Watson service in the composite response, include the connection details in the request. If no connection details are provided, the service is ignored

The action has the following signature:

```
{
  text: string // Input Text to supply to the services,
  nlu: {
    username: string // NlU username,
    password: string // NlU password,
    model: string (optional) // Optional custom NLU model for extracting entities',
    version: string (optional) // Optional API version specification'
  },
  wcs: {
    username: string // WCS username,
    password: string // WCS password,
    workspace_id: string // WCS workspace,
    alternate_intents: boolean (optional) // Return multiple intents
    version: string (optional) // Optional API version specification'
    context: object (optional) // Optional context object for WCS
    entities: [object] (optional) // Optional entities override for WCS
    intents: [object] (optional) // Optional intent override for WCS
    version: string (optional) // Optional API version specification'
  },
  ta: {
    username: string // TA username,
    password: string // TA password,
    tones: string (optional) // A comma separated list of tone categories to return
    sentences: boolean (optional) // Optionally apply the tone analyzer to each individual sentence
    isHTML: boolean (optional) // Specify if input is HTML
    version: string (optional) // Optional API version specification'
  }
}
```

The action has the following output:

```
{
    wcs: WCSResponse,
    nlu: NLUResponse,
    ta: TAResponse,
    text: string
}
```
