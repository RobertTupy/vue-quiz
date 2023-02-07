<template>
  <h2>Results</h2>
  <a-descriptions>
    <a-descriptions-item label="Score">
      <a-progress :percent="this.score" :steps="this.steps" />
    </a-descriptions-item>
    <a-descriptions-item label="Correct">{{
      this.correct
    }}</a-descriptions-item>
    <a-descriptions-item label="Incorrect">{{
      this.incorrect
    }}</a-descriptions-item>
    <a-descriptions-item label="Duration">{{
      rtf(this.duration)
    }}</a-descriptions-item>
  </a-descriptions>
</template>

<script>
import * as humanizeDuration from "humanize-duration";

const formatDuration = humanizeDuration.humanizer({
  language: "en",
  units: ["h", "m", "s"],
});

export default {
  props: ["quizId", "finishedAt", "duration", "correct", "incorrect", "score"],
  methods: {
    rtf(duration) {
      return formatDuration(duration);
    },
  },
  computed: {
    steps() {
      return Math.min(this.correct + this.incorrect, 5);
    },
  },
};
</script>

<style>
.ant-descriptions-item-container {
  align-items: center;
}
</style>
