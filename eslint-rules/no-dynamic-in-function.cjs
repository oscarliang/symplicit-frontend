const common = require('./common.cjs');

module.exports = {
  create: (context) => ({
    CallExpression: (node) => {
      if (node.callee.name === 'dynamic') {
        // lintCode(context, node.callee);
        const dynamicVariable = common.findVariable('dynamic', context);
        if (
          dynamicVariable &&
          common.isFromImport('next/dynamic', dynamicVariable) &&
          common.isWithinFunction(node)
        ) {
          context.report({
            message:
              'NextJS `dynamic` function call detected within a function',
            node,
          });
        }
      }
    },
  }),
  meta: {
    docs: {
      category: 'Possible Errors',
      description:
        'Disallow the use of the NextJS `dynamic` function within functions.',
    },
    fixable: 'code',
    schema: [],
    type: 'problem',
  },
};
