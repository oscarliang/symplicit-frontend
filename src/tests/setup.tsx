/* global jest */
/* istanbul ignore file */
// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from the Jest config

// used for __tests__/testing-library.js
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.scrollTo = jest.fn();

type DynamicFunctionComponent = React.FunctionComponent<unknown>;

jest.mock(
  'next/dynamic',
  () =>
    (
      func: () => Promise<
        DynamicFunctionComponent | { default: DynamicFunctionComponent }
      >,
    ) => {
      let component: DynamicFunctionComponent | null = null;
      func()
        .then((module) => {
          component = 'default' in module ? module.default : module;
        })
        .catch(() => {});
      const DynamicComponent = (props: unknown) => component?.(props);
      DynamicComponent.displayName = 'LoadableComponent';
      return DynamicComponent;
    },
);
