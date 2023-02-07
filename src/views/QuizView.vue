<template>
  <a-layout v-if="!started">
    <a-layout-content :style="{ padding: '5px 24px' }">
      <h2>
        Quiz: {{ quiz.title
        }}<span v-if="quiz.author"> by {{ quiz.author }}</span>
      </h2>
      <div>{{ quiz.preamble }}</div>
    </a-layout-content>
    <a-layout-footer v-if="!finished">
      <a-button type="primary" @click="start">Start quiz</a-button>
    </a-layout-footer>
  </a-layout>
  <a-layout v-if="started && !finished">
    <a-layout-content :style="{ padding: '5px 24px' }">
      <QuizQuestion
        key="{{currentQuestion.id}}"
        ref="CurrentQuestion"
        :id="currentQuestion.id"
        :question="currentQuestion.question"
        :answers="currentQuestion.answers"
        :submit-handler="answerQuestion"
        :is-final="isFinal"
      />
    </a-layout-content>
    <a-layout-footer :style="{ padding: '5px 24px' }">
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
    </a-layout-footer>
  </a-layout>
  <a-layout v-if="result" :style="{ padding: '5px 24px' }">
    <a-layout-content>
      <a-layout>
        <a-layout-content>
          <QuizResult
            v-if="result"
            v-bind="result"
            key="[{{result.quizId}}+{{result.finishedAt}}]"
          />
        </a-layout-content>
        <a-layout-sider
          v-if="leaderBoard"
          :width="300"
          :style="{ background: 'transparent' }"
        >
          <QuizLeaderBoard :leaderboard="leaderBoard" />
        </a-layout-sider>
      </a-layout>
    </a-layout-content>
    <a-layout-footer>
      <a-button type="primary" @click="restart">Restart</a-button>
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { toRaw } from "vue";
import md5 from "md5";
import _ from "underscore";
import QuizQuestion from "../components/quiz/QuizQuestion.vue";
import QuizResult from "../components/quiz/QuizResult.vue";
import QuizLeaderBoard from "../components/quiz/QuizLeaderboard.vue";

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

function percent(actual, total) {
  return Math.round((actual / total) * 100);
}

export default {
  components: { QuizLeaderBoard, QuizResult, QuizQuestion },
  data() {
    return {
      started: null,
      finished: null,
      result: null,
      leaderBoard: [],
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
      const finishedAt = Date.now();
      const answersNr = toRaw(this.total);
      const duration = finishedAt - this.started;
      let correctAnswerNr = 0;
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
          correctAnswerNr++;
        }
      }
      this.started = null;
      const currentResult = {
        quizId: toRaw(this.quiz.id),
        finishedAt: finishedAt,
        duration: duration,
        correct: correctAnswerNr,
        incorrect: answersNr - correctAnswerNr,
        score: percent(correctAnswerNr, answersNr),
      };
      this.finished = duration;
      this.result = currentResult;
      this.addLeaderboardResult(currentResult);
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
      this.$refs.CurrentQuestion.resetSelected();
    },
    addLeaderboardResult(result) {
      this.leaderBoard.push(result);
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
      return percent(toRaw(this.qCounter), this.quiz.questions.length);
    },
    isFinal() {
      return this.qCounter + 1 >= this.quiz.questions.length;
    },
  },
};
</script>
