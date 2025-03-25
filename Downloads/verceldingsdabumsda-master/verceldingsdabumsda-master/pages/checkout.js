// Importiere den SafeStorage
import safeStorage from '../utils/safeStorage';

// Ersetze localStorage.setItem(...) durch:
safeStorage.setItem('key', 'value');

// Ersetze localStorage.getItem(...) durch:
const value = safeStorage.getItem('key'); 