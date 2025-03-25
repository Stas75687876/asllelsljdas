/**
 * SafeStorage - Eine sichere Wrapper-Klasse für localStorage
 * Verhindert QuotaExceededError durch Prüfung und Bereinigung
 */
class SafeStorage {
  constructor() {
    this.isAvailable = this.checkAvailability();
    this.maxSize = 4 * 1024 * 1024; // 4MB als sicheres Limit
    this.memoryStorage = {}; // Fallback-Speicher im RAM
  }

  // Prüft, ob localStorage verfügbar ist
  checkAvailability() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Schätzt die Größe von Daten
  getItemSize(value) {
    return new Blob([value]).size;
  }

  // Schätzt den aktuellen Speicherverbrauch
  getCurrentSize() {
    if (!this.isAvailable) return 0;
    
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      size += this.getItemSize(key) + this.getItemSize(value);
    }
    return size;
  }

  // Befreit Speicherplatz durch Löschen alter Einträge
  makeRoom(neededSize) {
    if (!this.isAvailable) return;
    
    // Sammle Einträge mit Zeitstempeln
    const entries = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Ignoriere interne oder wichtige Einträge
      if (key.startsWith('__') || key === 'cart' || key === 'auth') continue;
      
      try {
        const value = localStorage.getItem(key);
        entries.push({ key, value, size: this.getItemSize(key) + this.getItemSize(value) });
      } catch (e) {
        // Ignoriere fehlerhafte Einträge
      }
    }
    
    // Sortiere nach Größe (größte zuerst)
    entries.sort((a, b) => b.size - a.size);
    
    // Lösche Einträge bis genug Platz frei ist
    let freedSize = 0;
    for (const entry of entries) {
      localStorage.removeItem(entry.key);
      freedSize += entry.size;
      if (freedSize >= neededSize) break;
    }
  }

  // Sicheres Speichern mit Fehlerbehebung
  setItem(key, value) {
    if (!this.isAvailable) {
      this.memoryStorage[key] = value;
      return;
    }
    
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    const neededSize = this.getItemSize(key) + this.getItemSize(valueStr);
    
    try {
      localStorage.setItem(key, valueStr);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // Versuche Platz zu schaffen
        this.makeRoom(neededSize);
        
        try {
          // Erneuter Versuch
          localStorage.setItem(key, valueStr);
        } catch (e2) {
          // Fallback auf Memory-Storage
          this.memoryStorage[key] = value;
          console.warn('SafeStorage: Fallback auf Memory-Storage für', key);
        }
      } else {
        // Anderer Fehler: Fallback
        this.memoryStorage[key] = value;
      }
    }
  }

  // Sicheres Abrufen
  getItem(key) {
    if (!this.isAvailable) {
      return this.memoryStorage[key] || null;
    }
    
    try {
      const value = localStorage.getItem(key);
      if (value === null && this.memoryStorage[key]) {
        return this.memoryStorage[key];
      }
      return value;
    } catch (e) {
      return this.memoryStorage[key] || null;
    }
  }

  // Sicheres Löschen
  removeItem(key) {
    if (this.isAvailable) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Ignoriere Fehler
      }
    }
    delete this.memoryStorage[key];
  }

  // Alles löschen
  clear() {
    if (this.isAvailable) {
      try {
        localStorage.clear();
      } catch (e) {
        // Ignoriere Fehler
      }
    }
    this.memoryStorage = {};
  }
}

// Exportiere eine Singleton-Instanz
const safeStorage = new SafeStorage();
export default safeStorage; 