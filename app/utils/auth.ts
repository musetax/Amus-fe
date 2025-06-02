// app/utils/auth.ts

export function isAuthenticated() {
    if (typeof window === "undefined") {
      // localStorage only exists in the browser, so return false on server
      return false;
    }
    
    const token = localStorage.getItem("token");
    return Boolean(token);
  }
  