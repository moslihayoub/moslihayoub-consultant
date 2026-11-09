/**
 * Utilitaire de détection et d'aiguillage du mode d'application :
 * - Mode 'portfolio' (par défaut sur moslih84.vercel.app / localhost:5173)
 * - Mode 'portal'    (sur m84ops.vercel.app / ops.* / VITE_APP_MODE=portal)
 */

export function isPortalMode() {
  if (typeof window === 'undefined') return false;

  // 1. Variable d'environnement Vercel / .env
  if (import.meta.env.VITE_APP_MODE === 'portal') return true;

  // 2. Détection par nom de domaine / host
  const host = window.location.hostname.toLowerCase();
  if (host.includes('m84ops') || host.startsWith('ops.') || host.includes('portal.')) {
    return true;
  }

  // 3. Détection par paramètre URL (ex: localhost:5173/?mode=portal ou ?app=ops)
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get('mode') || urlParams.get('app');
  if (param === 'portal' || param === 'ops' || param === 'm84ops') {
    localStorage.setItem('m84_app_mode', 'portal');
    return true;
  }
  if (param === 'portfolio') {
    localStorage.removeItem('m84_app_mode');
    return false;
  }

  // 4. Persistence locale (sur localhost)
  return localStorage.getItem('m84_app_mode') === 'portal';
}

export function setAppMode(mode) {
  if (typeof window === 'undefined') return;
  if (mode === 'portal') {
    localStorage.setItem('m84_app_mode', 'portal');
  } else {
    localStorage.removeItem('m84_app_mode');
  }
  window.location.reload();
}
