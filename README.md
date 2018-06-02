# Redux Promisify Action

Promisify action [middleware](https://redux.js.org/advanced/middleware) for Redux.

[![npm version](https://img.shields.io/npm/v/redux-promisify-action.svg?style=flat-square)](https://www.npmjs.com/package/redux-promisify-action)
[![npm downloads](https://img.shields.io/npm/dm/redux-promisify-action.svg?style=flat-square)](https://www.npmjs.com/package/redux-promisify-action)

```js
npm install --save redux-promisify-action
```

## Motivation

Sometimes you need to wait for the completion of asynchronous actions that are managed by other
middlewares.

## Installation

```
npm install --save redux-promisify-action
```

Then, to enable Redux Promisify Action, use
[`applyMiddleware()`](https://redux.js.org/api-reference/applymiddleware):

```js
import { createStore, applyMiddleware } from "redux";
import promisifyActionMiddleware from "redux-promisify-action";
import rootReducer from "./reducers/index";

// Note: this API requires redux@>=3.1.0
const store = createStore(
  rootReducer,
  applyMiddleware(promisifyActionMiddleware)
);
```

## Using

After installing, you can promisify you actions. This code below you can run in [REPL.it](https://repl.it/@orlov_vo/redux-promisify-action)

```js
import { promisifyAction } from "redux-promisify-action";

// For example you have this action creator:
//
// function createSomeAction() {
//   return {
//     type: "SOME_ACTION",
//     payload: "foo"
//   };
// }
//
// Wrap it by "promisifyAction":

function createSomeAction() {
  return promisifyAction({
    action: {
      type: "SOME_ACTION",
      payload: "foo"
    },
    resolveOn: "SOME_ACTION_SUCCESS",
    rejectOn: "SOME_ACTION_ERROR" // it is not required option
  });
}

// ...
// After this changes result of dispatch will be Promise:

dispatch(createSomeAction()).then(
  successAction => {
    // It will be executed after dispatch action with type "SOME_ACTION_SUCCESS"
  },
  rejectAction => {
    // It will be executed after dispatch action with type "SOME_ACTION_ERROR"
  }
);
```

## Advance examples

You can configure middleware by `createPromisifyAction`:

```js
import { createStore, applyMiddleware } from "redux";
import { createMiddleware } from "redux-promisify-action";
import rootReducer from "./reducers/index";

const { promisifyAction, middleware } = createMiddleware({
  actionType: "MY_PROMISIFY_ACTION_TYPE"
});

// Note: this API requires redux@>=3.1.0
const store = createStore(rootReducer, applyMiddleware(middleware));

function createSomeAction() {
  return promisifyAction({
    action: {
      type: "SOME_ACTION",
      payload: "foo"
    },
    resolveOn: "SOME_ACTION_SUCCESS",
    rejectOn: "SOME_ACTION_ERROR" // it is not required option
  });
}

dispatch(createSomeAction()).then(
  successAction => {
    // It will be executed after dispatch action with type "SOME_ACTION_SUCCESS"
  },
  rejectAction => {
    // It will be executed after dispatch action with type "SOME_ACTION_ERROR"
  }
);
```

## License

This project is licensed under the MIT License - see the LICENSE file for details
