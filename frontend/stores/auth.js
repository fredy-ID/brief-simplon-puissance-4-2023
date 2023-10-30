import { defineStore } from 'pinia'
import axiosApiIntance from "@/services/axiosApiIntance"

export const useAuthStore = defineStore('auth', {
  state: () => ({ 
    token: localStorage.getItem('token'),
    name: localStorage.getItem('name'),
    player: localStorage.getItem('player'),
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async logout() {
      const email = this.email
      await axiosApiIntance
        .post('auth/logout')
        .then((response) => {
          localStorage.removeItem('token')
          localStorage.removeItem('name')
          localStorage.removeItem('player')
          console.log(response)

          this.token = null;
          this.name = null;
          this.player = null;
        
        })
        .catch((error) => {
          console.log(error)
        })
    },
    setUser(data, auth_token=true) {
      if(auth_token) {
        if (data.token == null || data.player == null || data.name == null) {
          return
        }
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.name)
        localStorage.setItem('player', data.player)
      }
    },

    getUser() {
      return { token: this.token, name: this.name, player: this.player}
    },

    clearToken() {
      this.token = null
    }
  }
})
