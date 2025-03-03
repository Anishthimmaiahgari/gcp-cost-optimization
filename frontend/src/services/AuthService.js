// AuthService.js
const AuthService = {
    isAuthenticated: false,
    
    login(email, password) {
      // In a real app, this would validate against a backend
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.email === email && user.password === password) {
          this.isAuthenticated = true;
          localStorage.setItem('isAuthenticated', 'true');
          return true;
        }
      }
      return false;
    },
    
    signup(name, email, password) {
      // In a real app, this would send data to a backend
      const user = { name, email, password };
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    },
    
    logout() {
      this.isAuthenticated = false;
      localStorage.removeItem('isAuthenticated');
    },
    
    checkAuth() {
      this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      return this.isAuthenticated;
    }
  };
  
  export default AuthService;