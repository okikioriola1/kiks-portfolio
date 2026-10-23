export default {
    build: {
      rollupOptions: {
        input: {
          index: './index.html',
          about: './about.html',
          projects: './projects.html',
          home:'./home.html'
          // Add other HTML entry points as needed
        },
      },
    },
  };