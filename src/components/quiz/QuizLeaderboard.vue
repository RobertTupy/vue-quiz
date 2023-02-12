<template>
  <a-card key="{{quizId}}" title="Leaderboard" hoverable>
    <a-row v-if="sortedResults.length > 0">
      <a-col :span="4">Score</a-col>
      <a-col :span="6">Duration</a-col>
      <a-col :span="12">Finished at</a-col>
    </a-row>
    <a-row v-for="result of sortedResults" :key="result.finishedAt">
      <a-col :span="4">{{ result.score }}</a-col>
      <a-col :span="6">{{ rtf(result.duration) }}</a-col>
      <a-col :span="12">{{ formatDate(result.finishedAt) }}</a-col>
    </a-row>
    <template #actions v-if="sortedResults.length > 0">
      <a-button type="primary" danger @click="purgeResults">clear</a-button>
    </template>
  </a-card>
</template>

<script>
import * as humanizeDuration from "humanize-duration";
import { toRaw } from "vue";
import { useLeaderBoardStore } from "../../stores/leaderboard";

const { getResultsByQuiz, clear } = useLeaderBoardStore();

const formatDuration = humanizeDuration.humanizer({
  language: "en",
  units: ["h", "m", "s"],
});

function compareResults(a, b) {
  if (a.score < b.score) {
    return 1;
  }
  if (a.score > b.score) {
    return -1;
  }
  if (a.duration < b.duration) {
    return 1;
  }
  if (a.duration > b.duration) {
    return -1;
  }
  return 0;
}

export default {
  props: ["quizId"],
  data() {
    return {
      showResults: 5,
      leaderboard: getResultsByQuiz(this.quizId),
    };
  },
  methods: {
    rtf(duration) {
      return formatDuration(duration);
    },
    formatDate(date) {
      return new Date(date).toLocaleTimeString();
    },
    purgeResults() {
      clear(this.quizId);
      this.leaderboard = getResultsByQuiz(this.quizId);
    },
  },
  computed: {
    steps() {
      return Math.min(this.correct + this.incorrect, 5);
    },
    sortedResults() {
      const results = toRaw(this.leaderboard);
      return results.sort(compareResults).slice(0, this.showResults);
    },
  },
};
</script>

<style>
.ant-descriptions-item-container {
  align-items: center;
}
</style>
