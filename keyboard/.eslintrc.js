module.exports = {
    "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": ["compat"],
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "mocha": true,
    "jest": true,
    "jasmine": true
  },
  "rules": {
    "react/no-access-state-in-setstate": [0], // 阻止在this.setState中使用this.state
    "react/destructuring-assignment": [0], // 解构赋值
    "linebreak-style": ["off", "windows"],
    "generator-star-spacing": [0],
    "consistent-return": [0],
    "react/forbid-prop-types": [0],
    "react/jsx-filename-extension": [1, { "extensions": [".js"] }],
    "global-require": [1],
    "import/prefer-default-export": [0],
    "react/jsx-no-bind": [0],
    "react/prop-types": [0],
    "react/prefer-stateless-function": [0],
    "react/jsx-wrap-multilines": ["error", {
      "declaration": "parens-new-line",
      "assignment": "parens-new-line",
      "return": "parens-new-line",
      "arrow": "parens-new-line",
      "condition": "parens-new-line",
      "logical": "parens-new-line",
      "prop": "ignore"
    }],
    "react/no-find-dom-node": "off",
    "no-else-return": [0],
    "no-restricted-syntax": [0],
    "no-new-func": 0,
    "no-console": ["warn", { "allow": ["warn", "error"]}],
    "no-continue": 0,
    "import/no-extraneous-dependencies": [0],
    "no-use-before-define": [0],
    "jsx-a11y/no-static-element-interactions": [0],
    "jsx-a11y/no-noninteractive-element-interactions": [0],
    "jsx-a11y/click-events-have-key-events": [0],
    "jsx-a11y/anchor-is-valid": [0],
    "jsx-a11y/label-has-for": [0],
    "no-nested-ternary": [0],
    "arrow-body-style": [0],
    "import/extensions": [0],
    "no-bitwise": [0],
    "no-cond-assign": [0],
    "import/no-unresolved": [0],
    "comma-dangle": ["error", {
      "arrays": "never",
      "objects": "never",
      "imports": "never",
      "exports": "never",
      "functions": "ignore"
    }],
    "object-curly-newline": [0],
    "function-paren-newline": [0],
    "no-restricted-globals": [0],
    "require-yield": [1],
    "compat/compat": "warn",
    "func-names": 0,
    "class-methods-use-this": "off",
    "no-param-reassign":"off",
    "max-len":[1,200],
    "no-underscore-dangle": [0],
    "no-template-curly-in-string": [1]
  },
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  "settings": {
    "polyfills": ["fetch", "promises"]
  }
};
