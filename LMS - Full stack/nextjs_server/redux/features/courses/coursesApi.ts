import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    // Apply Coupon 
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: "create-order-by-coupon",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-admin-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getUsersAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseDetails: builder.query({
      query: (id: any) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseContent: builder.query({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getAllTask: builder.query({
      query: () => ({
        url: `get-all-tasks`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getAllTaskResult: builder.query({
      query: () => ({
        url: `get-all-task-result`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getAllUsersResults: builder.query({
      query: () => ({
        url: `get-users-result`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getAllQuiz: builder.query({
      query: () => ({
        url: `get-all-quiz`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCurrentCourseProgress : builder.query({
      query: ({userId, courseId}) => ({
        url: `course-progress?userId=${userId}&courseId=${courseId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCertificate : builder.mutation({
      query: ({courseName,userName,userEmail}) => ({
        url: `get-certificate?courseName=${courseName}&userName=${userName}&userEmail=${userEmail}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateProgress : builder.mutation({
      query: ({ userId, courseId, completedSections, totalSections, tags }) => ({
        url: "update-progress",
        body: {
          userId,
          courseId,
          completedSections,
          totalSections,
          tags
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    updateQuizAndTask : builder.mutation({
      query: ({ userId, courseId, quizId, answers }) => ({
        url: "quiz-result",
        body: {
          userId,
          courseId,
          quizId,
          answers
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    addTask : builder.mutation({
      query: ({ courseId, taskTitle }) => ({
        url: "add-task",
        body: {
          courseId,
          taskTitle
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    updateTask : builder.mutation({
      query: ({ courseId, taskTitle }) => ({
        url: "update-task",
        body: {
          courseId,
          taskTitle
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: "add-question",
        body: {
          question,
          courseId,
          contentId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: "add-answer",
        body: {
          answer,
          courseId,
          contentId,
          questionId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }: any) => ({
        url: `add-review/${courseId}`,
        body: {
          review,
          rating,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addReplyInReview: builder.mutation({
      query: ({ comment, courseId, reviewId }: any) => ({
        url: `add-reply`,
        body: {
          comment, courseId, reviewId
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    taskUpload: builder.mutation({
      query: ({ userId, courseId, fileName, fileType, fileBase64 }: any) => ({
        url: `upload-task-file`,
        body: {
          userId, courseId, fileName, fileType, fileBase64
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    changeTaskResultStatus: builder.mutation({
      query: ({ taskResultId, pass  }) => ({
        url: `update-task-result-status`,
        body: {
          taskResultId, 
          pass
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
    addQuiz: builder.mutation({
      query: ({ courseId, title, description, questions  }) => ({
        url: `create-quiz`,
        body: {
          courseId, title, description, questions
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    updateQuiz: builder.mutation({
      query: ({ quizId, courseId, title, description, questions  }) => ({
        url: `update-quiz`,
        body: {
          quizId,courseId, title, description, questions
        },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    
    progressDetailsByUser :  builder.mutation({
      query : ({ userId, tag, courseId }) => ({
        url: `User-progress?userId=${userId}&tag=${tag ? tag : ""}&courseId=${courseId ? courseId : ""}`,
        method: "GET",
        credentials: "include" as const,
      })
    }),

    courseEnrollByTag :  builder.mutation({
      query : ({ tag }) => ({
        url: `enroll?tag=${tag ? tag : ""}`,
        method: "POST",
        credentials: "include" as const,
      })
    })

  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetUsersAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
  useApplyCouponMutation,
  useUpdateProgressMutation,
  useUpdateQuizAndTaskMutation,
  useGetCurrentCourseProgressQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useGetAllTaskQuery,
  useTaskUploadMutation,
  useChangeTaskResultStatusMutation,
  useGetAllTaskResultQuery,
  useGetAllQuizQuery,
  useAddQuizMutation,
  useUpdateQuizMutation,
  useGetAllUsersResultsQuery,
  useGetCertificateMutation,
  useProgressDetailsByUserMutation,
  useCourseEnrollByTagMutation
} = coursesApi;
