import { defineStore } from "pinia";

export const useLeaderBoardStore = defineStore("quizLeaderboard", {
  state: () => ({
    leaderboard: [],
  }),
  getters: {
    getResultsByQuiz(state) {
      return (quizId) =>
        state.leaderboard.filter((quizResult) => quizResult.quizId === quizId);
    },
  },
  actions: {
    addResult(result) {
      this.leaderboard.push(result);
    },
    clear(quizId) {
      this.leaderboard = this.leaderboard.filter(
        (quizResult) => quizResult.quizId !== quizId
      );
    },
  },
  persist: {
    enabled: true,
    strategies: [],
  },
});
