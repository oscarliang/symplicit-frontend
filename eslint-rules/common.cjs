module.exports = {
  findVariable(name, context) {
    const rootScope = context.getScope();
    let variable = null;
    let scope = rootScope;
    while (scope !== null) {
      if (scope.set.get(name)) {
        variable = scope.set.get(name);
        break;
      } else {
        scope = scope.upper;
      }
    }

    return variable;
  },

  isFromImport(name, variable) {
    return variable.defs.some((def) => {
      let node = def;
      while (node && node.type !== 'ImportDeclaration') {
        node = node.parent;
      }
      return node?.source.value === name;
    });
  },

  isWithinFunction(rootNode) {
    let node = rootNode;
    while (node) {
      if (
        node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression' ||
        node.type === 'ArrowFunctionExpression'
      ) {
        return true;
      }
      node = node.parent;
    }

    return false;
  },
};
