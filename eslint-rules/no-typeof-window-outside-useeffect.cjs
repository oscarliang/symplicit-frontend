const common = require('./common.cjs');

function isGlobalWindowReference(context) {
  const rootScope = context.getScope();
  let variable = null;
  let scope = rootScope;
  while (scope !== null) {
    if (scope.set.get('window')) {
      variable = scope.set.get('window');
      break;
    } else {
      scope = scope.upper;
    }
  }

  return !!(variable?.defs.length === 0);
}

function isTypeofGlobalWindow(node, context) {
  const isTypeof = node.operator === 'typeof';

  const isWindowReference =
    node.argument.type === 'Identifier' && node.argument.name === 'window';

  return isTypeof && isWindowReference && isGlobalWindowReference(context);
}

function isWithinUseEffect(rootNode, context) {
  let node = rootNode;
  while (node) {
    if (node.type === 'CallExpression' && node.callee.name === 'useEffect') {
      const useEffectVariable = common.findVariable('useEffect', context);
      if (common.isFromImport('react', useEffectVariable)) {
        return true;
      }
    }
    node = node.parent;
  }

  return false;
}

module.exports = {
  create: (context) => ({
    UnaryExpression: (node) => {
      if (
        isTypeofGlobalWindow(node, context) &&
        !(common.isWithinFunction(node) && isWithinUseEffect(node, context))
      ) {
        context.report({
          message: '`typeof window` detected outside of a `useEffect` hook',
          node,
        });
      }
    },
  }),
  meta: {
    docs: {
      category: 'Possible Errors',
      description:
        'Disallow the use of `typeof window` outside of useEffect hooks',
    },
    fixable: 'code',
    schema: [],
    type: 'problem',
  },
};
