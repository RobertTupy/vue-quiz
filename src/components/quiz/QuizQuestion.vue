<template>
  <h2>{{ question }}</h2>
  <a-row :gutter="[0, 24]">
    <a-checkbox-group v-model:value="selectedAnswers" :options="answers" />
  </a-row>
  <a-row :gutter="[0, 24]">
    <a-checkbox v-model:checked="joker"
      >nothing from given is correct</a-checkbox
    >
  </a-row>
  <a-row :gutter="[0, 32]">
    <a-button
      type="primary"
      @click.prevent="nextQuestion"
      :disabled="disableNextButton"
      :style="{ marginTop: '15px' }"
    >
      <span v-if="isFinal">Finish quiz</span>
      <span v-else>Next question</span>
    </a-button>
  </a-row>
</template>

<script>
import _ from "underscore";
import { toRaw } from "vue";
export default {
  props: ["id", "question", "answers", "isFinal", "submitHandler"],
  data() {
    return {
      selectedAnswers: [],
      joker: false,
    };
  },
  methods: {
    nextQuestion: function () {
      this.submitHandler(this.selectedAnswers, this.id);
    },
    resetSelected: function () {
      this.selectedAnswers = [];
      this.joker = false;
    },
    shuffle: function (answers) {
      return _.shuffle(answers);
    },
  },
  watch: {
    joker(newJoker) {
      if (toRaw(newJoker) === true) {
        this.selectedAnswers = [];
      }
    },
    selectedAnswers(newAnswer) {
      if (toRaw(newAnswer).length > 0 && toRaw(this.joker)) {
        this.joker = false;
      }
    },
  },
  computed: {
    disableNextButton() {
      return this.selectedAnswers.length <= 0 && toRaw(this.joker) === false;
    },
  },
};
</script>

<style>
.ant-checkbox-wrapper {
  display: flex;
}
</style>
