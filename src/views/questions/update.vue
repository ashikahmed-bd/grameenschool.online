<script setup>
import Default from "@/layouts/Default.vue";
import { useQuizStore } from "@/stores/quiz.js";
import { reactive, ref, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import BaseButton from "@/components/BaseButton.vue";

const route = useRoute();
const quizStore = useQuizStore();
const { quiz } = storeToRefs(quizStore);

const questions = ref([]);

// Create new blank question
const createNewQuestion = () => {
  const newQ = reactive({
    question: "",
    type: "mcq",
    mark: 1,
    correctIndex: 0,
    options: [
      { text: "" },
      { text: "" },
      { text: "" },
      { text: "" },
    ],
  });

  watchEffect(() => {
    if (newQ.type === "true_false") {
      newQ.options = [
        { text: "True" },
        { text: "False" },
      ];
      newQ.correctIndex = 0;
    } else if (newQ.type === "mcq" && newQ.options.length !== 4) {
      newQ.options = [
        { text: "" },
        { text: "" },
        { text: "" },
        { text: "" },
      ];
      newQ.correctIndex = 0;
    }
  });

  questions.value.push(newQ);
};

const removeQuestion = (index) => {
  questions.value.splice(index, 1);
};

const addOption = (question) => {
  question.options.push({ text: "" });
};

const removeOption = (question, index) => {
  if (question.options.length > 2) {
    question.options.splice(index, 1);
    if (question.correctIndex === index) {
      question.correctIndex = 0;
    }
  }
};

const submit = () => {
  const payload = questions.value.map((question) => ({
    question: question.question,
    type: question.type,
    mark: question.mark,
    options: question.options.map((option, idx) => ({
      option: option.option,
      correct: idx === question.correctIndex,
    })),
  }));

  quizStore.questions(route.params.course, route.params.quiz, payload);
};

const loadQuiz = async () => {
  const response = await quizStore.show(route.params.course, route.params.quiz);
  questions.value = response.data.questions.map(q => ({
    question: q.question,
    type: q.type,
    mark: q.mark,
    correctIndex: q.options.findIndex(o => o.correct),
    options: q.options.map(opt => ({
      option: opt.option,
    }))
  }));
};

onMounted(() => {
  loadQuiz();
  createNewQuestion();
});
</script>

<template>
  <Default>
    <div class="bg-white rounded-xl">
      <div class="flex items-center justify-between border-b border-border px-6 py-4">
        <div class="flex-grow">
          <h3 class="text-xl font-bold">Quiz: {{ quiz.data?.title }}</h3>
          <p class="text-gray-600">{{ quiz.data?.instructions }}</p>
        </div>

        <div class="flex-none bg-white space-y-2">
          <div class="flex items-center gap-6 text-gray-700 text-sm">
            <div>
              <span class="font-semibold">Total Marks: </span>
              <span>{{ quiz.data?.total_marks }}</span>
            </div>
            <div>
              <span class="font-semibold">Pass Marks: </span>
              <span>{{ quiz.data?.pass_marks }}</span>
            </div>
          </div>
          <div class="text-gray-600 text-xs">
            <span class="font-semibold">Duration:</span>
            <span>{{ quiz.data?.duration }} minutes</span>
          </div>
        </div>


      </div>

      <div class="card__body space-y-8 px-6 pb-6">
        <div
            v-for="(question, index) in questions"
            :key="index"
            class="border border-border rounded-xl p-4 space-y-6"
        >
          <div class="flex justify-between items-center">
            <h4 class="text-lg font-semibold">Question: {{ index + 1 }}</h4>
            <button
                @click="removeQuestion(index)"
                v-if="questions.length > 1"
                class="text-red-600 hover:underline text-sm"
            >
              Remove
            </button>
          </div>

          <div class="flex items-center gap-4">
            <label class="flex-grow">
              <span class="text-sm font-medium">Question</span>
              <input
                  v-model="question.question"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </label>
            <label class="w-24">
              <span class="text-sm font-medium">Mark</span>
              <input
                  v-model="question.mark"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </label>
          </div>

          <!-- Options -->
          <div v-if="question.options.length" class="space-y-2">
            <div
                v-for="(choice, optIndex) in question.options"
                :key="optIndex"
                class="flex items-center space-x-3"
            >
              <input
                  type="radio"
                  :value="optIndex"
                  v-model="question.correctIndex"
                  class="form-radio"
              />
              <input
                  v-model="choice.option"
                  type="text"
                  class="flex-1 border border-gray-300 rounded px-3 py-2"
                  :readonly="question.type === 'true_false'"
                  :placeholder="`Choice ${optIndex + 1}`"
              />
              <button
                  v-if="question.type === 'mcq'"
                  @click="removeOption(question, optIndex)"
                  class="text-gray-400 hover:text-red-600"
              >
                &times;
              </button>
            </div>

            <div class="flex items-center justify-between">
              <button @click="addOption(question)" class="text-blue-600 text-sm hover:underline mt-1">
                + Add Choice
              </button>

              <select v-model="question.type" class="px-4 py-1 border border-gray-300 rounded">
                <option value="mcq">Multiple Choice</option>
                <option value="true_false">True/False</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Add Question Button -->
        <div class="text-right">
          <button @click="createNewQuestion" class="base__button">
            + Add Question
          </button>
        </div>

        <!-- Submit Button -->
        <div class="text-left">
          <BaseButton @click="submit" :loading="quizStore.loading">Update</BaseButton>
        </div>
      </div>
    </div>
  </Default>
</template>
