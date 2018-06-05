---
title: Moving to TypeScript
date: "2018-06-04T12:00:00.000Z"
---

Moving a large React application written in vanilla JS (actually ES6 with some additional plugins) to Typescript has benefits, but breaks a lot of things that were working just fine. Since the original application was created with `create-react-app` and we did not want to eject, a solution had to be found.

Our initial attempt was to take `webpack.config.js` from `react-scripts` package, modify it to use TS and then replace it. This could be done manually, through shell script and as a build step.

Unfortunately, this was brittle and we decided to go with `react-app-rewired` along with `react-scripts-ts`. This was a really simple change in the end, not to mention a lot more stable one. All we needed to do is to replace `npm scripts` with:

```json
{
  "scripts": {
    "start": "react-app-rewired start --scripts-version react-scripts-ts",
    "build": "react-app-rewired build --scripts-version react-scripts-ts"
  }
}
```

### Errors, lots of errors

TypeScript can be unforgiving, but it can be customized via `tsconfig.json`. Since there were no type annotations before and we are using imports from untyped packages, here are some recommended default settings:

- `allowSyntheticDefaultImports` - allows you to write `import React from 'react'` instead of `import * as React from 'react'`
- `noImplicitAny` - since everything is untyped, do this or change all the files


Even though `awesome-typescript-loader` can support `js` extension it is strongly recommended that all files are renamed to `ts`/`tsx` unless they are some helper pure js files.