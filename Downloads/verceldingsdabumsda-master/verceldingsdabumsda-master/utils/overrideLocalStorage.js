import safeStorage from './safeStorage';

// Überschreibe die standardmäßige localStorage API
(function() {
  const originalLocalStorage = window.localStorage;
  
  // Sicherheitskopie der ursprünglichen Methoden erstellen
  const originalMethods = {
    setItem: originalLocalStorage.setItem.bind(originalLocalStorage),
    getItem: originalLocalStorage.getItem.bind(originalLocalStorage),
    removeItem: originalLocalStorage.removeItem.bind(originalLocalStorage),
    clear: originalLocalStorage.clear.bind(originalLocalStorage),
    key: originalLocalStorage.key.bind(originalLocalStorage),
    get length() { return originalLocalStorage.length; }
  };
  
  // Sichere Methoden ersetzen
  originalLocalStorage.setItem = function(key, value) {
    safeStorage.setItem(key, value);
  };
  
  originalLocalStorage.getItem = function(key) {
    return safeStorage.getItem(key);
  };
  
  originalLocalStorage.removeItem = function(key) {
    safeStorage.removeItem(key);
  };
  
  originalLocalStorage.clear = function() {
    safeStorage.clear();
  };
  
  // Erstelle einen Hinweis für Debugging
  console.debug('localStorage wurde durch SafeStorage gesichert');
})(); 