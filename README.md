
![fetch-dog logo](./_art/fetch-dog-logo.png)

# FETCH-DOG
### React app http agent

[![version](https://img.shields.io/github/package-json/version/vladblindu/fetch-dog)](https://semver.org)
[![<ORG_NAME>](https://circleci.com/gh/vladblindu/fetch-dog.svg?style=shield)](https://app.circleci.com/pipelines/github/vladblindu/fetch-dog)
[![NPM](https://img.shields.io/npm/v/fetch-dog.svg)](https://www.npmjs.com/package/fetch-dog)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-yellow.svg)](https://standardjs.com)

## Install

```bash
npm install --save @vladblindu/fetch-dog
#or
yarn add @vladblindu/fetch-dog
```

## Usage

Create a http-agent file in the ./src folder with the following content
```jsx
import React from 'react
import fetchDog from 'fetch-dog'
import httpConfig from './config/http-agent.config.json'

const useHttpAgent = fetchDog
```

## License

MIT © [vladblindu](https://github.com/vladblindu)
