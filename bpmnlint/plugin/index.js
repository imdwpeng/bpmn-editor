module.exports = {
  configs: {
    recommended: {
      rules: {
        'playground/target-namespace': 'error'
      }
    },
    all: {
      rules: {
        'playground/target-namespace': 'warn',
        'playground/no-manual-task': 'warn'
      }
    }
  }
}