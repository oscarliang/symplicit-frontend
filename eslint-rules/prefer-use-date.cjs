function isGlobalDateReference(identifier, context) {
  if (identifier.type !== 'Identifier' || identifier.name !== 'Date') {
    return false;
  }

  const rootScope = context.getScope();
  let variable = null;
  let scope = rootScope;
  while (scope !== null) {
    if (scope.set.get('Date')) {
      variable = scope.set.get('Date');
      break;
    } else {
      scope = scope.upper;
    }
  }

  return !!(variable?.defs.length === 0);
}

function test(node, identifier, context) {
  if (isGlobalDateReference(identifier, context)) {
    context.report({
      message: 'Prefer use of useDate or state.conf.timestamp instead of Date',
      node,
    });
  }
}

module.exports = {
  create: (context) => {
    if (
      context.options.some((options) => options.ignoreTests) &&
      context.getFilename().endsWith('.test.tsx')
    ) {
      return {};
    }
    if (
      context.options.some((options) => options.ignoreStories) &&
      context.getFilename().endsWith('.stories.tsx')
    ) {
      return {};
    }

    return {
      MemberExpression: (node) => {
        if (node.object) {
          test(node, node.object, context);
        }
      },
      NewExpression: (node) => {
        if ((node.arguments?.length ?? 0) <= 0 && node.callee) {
          test(node, node.callee, context);
        }
      },
      VariableDeclarator: (node) => {
        if (node.init) {
          test(node, node.init, context);
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Possible Errors',
      description:
        'Prefer use of useDate or state.conf.timestamp instead of Date',
    },
    fixable: 'code',
    schema: [
      {
        ignoreStories: {
          type: 'boolean',
        },
        ignoreTests: {
          type: 'boolean',
        },
      },
    ],
    type: 'problem',
  },
};
