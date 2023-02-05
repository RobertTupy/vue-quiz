<template>
  <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
    <template v-if="!started">
      <h2>
        Quiz: {{ quiz.title
        }}<span v-if="quiz.author"> by {{ quiz.author }}</span>
      </h2>
      <div>{{ quiz.preamble }}</div>
    </template>
    <a-button v-if="!started && !finished" type="primary" @click="start"
      >Start quiz</a-button
    >
    <QuizQuestion
      key="{{currentQuestion.id}}"
      ref="CurrentQuestion"
      :id="currentQuestion.id"
      :question="currentQuestion.question"
      :answers="currentQuestion.answers"
      :submit-handler="answerQuestion"
      :is-final="isFinal"
      v-if="started && !finished"
    />
    <template v-if="started && !finished">
      <a-row type="flex">
        <a-col :flex="1" style="text-align: center">
          {{ qCounter + 1 }}/{{ total }}
        </a-col>
        <a-col :flex="11">
          <a-progress
            :percent="percentCompleted"
            status="active"
            :show-info="false"
          />
        </a-col>
      </a-row>
    </template>
    <template v-if="result">
      <div>{{ result }}</div>
      <a-button v-if="result" type="primary" @click="restart">Restart</a-button>
    </template>
  </div>
</template>

<script>
import { toRaw } from "vue";
import md5 from "md5";
import * as humanizeDuration from "humanize-duration";
import _ from "underscore";
import QuizQuestion from "../components/QuizQuestion.vue";

const q = {
  title: "Quiz title",
  preamble: "something to say before quiz start",
  author: "my name",
  questions: [
    {
      question: "anything to ask?",
      answers: [
        {
          value: "blah",
          correct: false,
        },
        {
          value: "yes",
          correct: true,
        },
        {
          value: "also yes",
          correct: true,
        },
      ],
    },
    {
      question: "question without option should not crash app",
      answers: [
        {
          value: "it doesn't",
          correct: true,
        },
      ],
    },
    {
      question: "q3",
      answers: [
        {
          value: "wrong",
          correct: false,
        },
        {
          value: "false",
          correct: false,
        },
      ],
    },
  ],
};
const rtf = humanizeDuration.humanizer({
  language: "en",
  units: ["h", "m", "s"],
});

export default {
  components: { QuizQuestion },
  data() {
    return {
      started: null,
      finished: null,
      result: null,
      qCounter: 0,
      answered: {},
      quiz: {
        ...q,
        id: q.id ?? md5(JSON.stringify(q)),
        questions: q.questions.map(function (question) {
          return {
            ...question,
            id: question.id ?? md5(JSON.stringify(question)),
          };
        }),
      },
    };
  },
  methods: {
    restart() {
      this.started = null;
      this.finished = null;
      this.result = null;
      this.qCounter = 0;
      this.answered = {};
      this.shuffle();
      this.start();
    },
    shuffle() {
      const q = toRaw(this.quiz);
      this.quiz = {
        ...q,
        questions: _.shuffle(q.questions),
      };
    },
    start() {
      this.started = Date.now();
    },
    finish() {
      this.finished = Date.now() - this.started;
      let score = 0;
      for (let i = 0; i < this.quiz.questions.length; i++) {
        const answered = this.answered[this.quiz.questions[i].id];
        const correctAnswers = this.quiz.questions[i].answers
          .filter(function (answer) {
            return answer.correct === true;
          })
          .map(function (answer) {
            return answer.value;
          });
        if (_.isEqual(correctAnswers, answered)) {
          score++;
        }
      }
      this.started = null;
      this.result = `you have completed quiz in ${rtf(
        toRaw(this.finished)
      )} with score ${score}`;
    },
    answerQuestion(answer, questionId) {
      this.answered = {
        ...toRaw(this.answered),
        [toRaw(questionId)]: toRaw(answer),
      };
      if (this.qCounter + 1 < this.quiz.questions.length) {
        this.qCounter++;
      } else {
        this.finish();
      }
      this.$refs.CurrentQuestion.resetSelected(); // this is ugly two-way binding, should be unnecessary
    },
  },
  computed: {
    total() {
      return this.quiz.questions.length;
    },
    currentQuestion() {
      return {
        ...this.quiz.questions[this.qCounter],
        answers: this.quiz.questions[this.qCounter].answers.map(function (ans) {
          return {
            ...ans,
            label: ans.label ?? ans.value,
          };
        }),
      };
    },
    percentCompleted() {
      const p = Math.ceil(
        (toRaw(this.qCounter) / this.quiz.questions.length) * 100
      );
      console.log(this.qCounter, this.quiz.questions.length, p);
      return p;
    },
    isFinal() {
      return this.qCounter + 1 >= this.quiz.questions.length;
    },
  },
};
</script>
