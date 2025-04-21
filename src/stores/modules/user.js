import { defineStore } from 'pinia'

export const useUserStore = defineStore('big-user', {
  state: () => ({
    token: '',
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken
    },
    getToken() {
      this.token = ''
    },
  },
})
