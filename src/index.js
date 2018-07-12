// @flow
import { isError } from "flux-standard-action";
import type { Middleware } from "redux";

export const PROMISIFY_ACTION = "@@PROMISIFY_ACTION";

type PromisifyActionPayload<A> = {
  action: A,
  resolveOn: string | (A => boolean),
  rejectOn?: string | (A => boolean)
};

type Observer<A> = {
  resolveOn: string | (A => boolean),
  resolve: (action: A) => void,
  rejectOn?: string | (A => boolean),
  reject: (action: A) => void
};

type MiddlewareOptions = {
  actionType?: string
};

type PromisifyResult<S, A> = {
  promisifyAction: (options: PromisifyActionPayload<A>) => *,
  middleware: Middleware<S, A, any>
};

export function createMiddleware<S, A>(
  options: MiddlewareOptions = {}
): PromisifyResult<S, A> {
  const { actionType = PROMISIFY_ACTION } = options;

  let observers: Array<Observer<A>> = [];

  const promisifyAction = (payload: PromisifyActionPayload<A>) => ({
    type: actionType,
    payload
  });

  const middleware = ({ dispatch }) => next => action => {
    if (
      typeof dispatch === "function" &&
      action &&
      action.type === actionType
    ) {
      const { payload }: { payload: PromisifyActionPayload<A> } = action;

      if (!payload) {
        throw new TypeError(`Empty payload in action "${actionType}"!`);
      }

      dispatch(payload.action);

      return new Promise((resolve, reject) => {
        const { resolveOn, rejectOn } = payload;

        observers = [
          ...observers,
          {
            resolveOn,
            resolve,
            rejectOn,
            reject
          }
        ];
      });
    }

    observers = observers.filter(
      ({ resolveOn, resolve, rejectOn, reject }) =>
        applyFunctionToActionByPredicate(resolve, action, resolveOn) ||
        (rejectOn && applyFunctionToActionByPredicate(reject, action, rejectOn))
    );

    return next(action);
  };

  return {
    promisifyAction,
    middleware
  };
}

function applyFunctionToActionByPredicate<A>(
  func: (action: A) => void,
  action: A,
  predicate: string | (A => boolean)
): boolean {
  switch (typeof predicate) {
    case "string": {
      if (action && action.type === predicate) {
        func(isError(action) ? action.payload : action);
        return true;
      }
      break;
    }

    case "function": {
      if (predicate(action)) {
        func(isError(action) ? action.payload : action);
        return true;
      }
      break;
    }

    default:
  }

  return false;
}

const { promisifyAction, middleware } = createMiddleware();

export { promisifyAction };

export default middleware;
