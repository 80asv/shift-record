export default {
  // ... other options
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  }
};
