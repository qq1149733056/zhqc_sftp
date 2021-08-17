import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState, createSharedMutations } from 'vuex-electron';

import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    createSharedMutations(),
  ],
  strict: process.env.NODE_ENV !== 'production',
  state: {
	  flg: 1,
	  guide: 1,
	  readflg:1,
  },
  mutations: {
    increment(state) {
	      state.flg++;
	    },
    guideincrement(state) {
	      state.guide++;
	    },
	getReadflg(state){
		state.readflg++;
	}	
  },
  actions: {
    increments({ commit }) {
      commit('increment');
    },
    guideincrement({ commit }) {
      commit('guideincrement');
    },
	getReadflgs({ commit }) {
	  commit('getReadflg');
	},
  },

});
