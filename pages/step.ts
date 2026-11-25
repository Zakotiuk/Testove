import { test } from '@playwright/test';

export function step() {
  return function <This extends object, Args extends unknown[], Result>(
    method: (this: This, ...args: Args) => Promise<Result>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Result>>,
  ) {
    return function (this: This, ...args: Args): Promise<Result> {
      const title = `${this.constructor.name}.${String(context.name)}`;
      return test.step(title, () => method.apply(this, args));
    };
  };
}
