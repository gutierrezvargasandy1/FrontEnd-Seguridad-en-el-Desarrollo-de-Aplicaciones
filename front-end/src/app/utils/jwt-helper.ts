// app/utils/jwt-helper.ts (crear este archivo)
export class JwtHelper {
  
  /**
   * Decodifica un JWT y devuelve su payload
   */
  static decodeToken(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }
  
  /**
   * Extrae el rol del token
   */
  static getRoleFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.role || decoded?.rol || null;
  }
  
  /**
   * Extrae el userId del token
   */
  static getUserIdFromToken(token: string): number | null {
    const decoded = this.decodeToken(token);
    return decoded?.sub || decoded?.id || decoded?.userId || null;
  }
  
  /**
   * Verifica si el token está expirado
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }
}