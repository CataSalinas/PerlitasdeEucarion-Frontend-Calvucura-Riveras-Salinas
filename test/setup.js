// Garantiza que window.fetch exista (jsdom no lo trae) para poder usar spyOn(window, 'fetch')
if (typeof window.fetch !== 'function') {
  window.fetch = () => Promise.reject(new Error('fetch no mockeado'))
}
