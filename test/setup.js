if (typeof window.fetch !== 'function') {
  window.fetch = () => Promise.reject(new Error('fetch no mockeado'))
}
