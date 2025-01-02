<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import service from "@/api/axios";
import {ElNotification} from "element-plus";
import MovieReview from "@/components/MovieReview.vue";
import { useRoute } from 'vue-router';

// Route
const route = useRoute();

// Data
const movie = ref(null);
const reviews = ref(null);
const total = ref(null);
const fetching = ref(true);
const count = ref(10);
const loading = ref(false);
const review = ref(null);
const reviewFormData = reactive({
    rating: 0,
    content: ""
});
const reviewFormRef = ref(null);
const reviewDialogVisible = ref(false);

// Computed
const disabled = computed(() => {
    return fetching.value || loading.value || !(count.value < total.value);
});

// Methods
const fetchMovieData = async () => {
    try {
        const response = await service.get('/movie/reviews', {
            params: {
                movieId: route.params.movieId,
                count: count.value
            }
        });
        if (response['code'] === 200) {
            movie.value = response.data['movie'];
            reviews.value = response.data['reviews'];
            total.value = response.data['total'];
        } else {
            ElNotification({
                title: "Error",
                message: response['message'],
                type: "error"
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        fetching.value = false;
    }
};
const fetchReviewData = async () => {
    try {
        const response = await service.get('/movie/review', {
            params: {
                movieId: route.params.movieId
            }
        });
        if (response['code'] === 200) {
            review.value = response.data['review'];
            reviewFormData.rating = review.value.rating;
            reviewFormData.content = review.value.content;
        }
    } catch (error) {
        console.log(error);
    }
};
const loadReviews = async () => {
    try {
        loading.value = true;
        count.value += 10;
        const response = await service.get('/movie/reviews', {
            params: {
                movieId: route.params.movieId,
                count: count.value
            }
        });
        if (response['code'] === 200) {
            movie.value = response.data['movie'];
            reviews.value = response.data['reviews'];
            total.value = response.data['total'];
        } else {
            ElNotification({
                title: "Error",
                message: response['message'],
                type: "error"
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
const submitForm = async () => {
    try {
        const response = await service.post('/movie/review', reviewFormData);
        if (response['code'] === 200) {
            review.value = response.data['review'];
        } else {
            ElNotification({
                title: "Error",
                message: response['message'],
                type: "error"
            });
        }
    } catch (error) {
        console.log(error);
    }
};
const resetForm = () => {
    reviewFormData.rating = review.value.rating;
    reviewFormData.content = review.value.content;
};

// Mounted
onMounted(() => {
    fetchMovieData();
    fetchReviewData();
});
</script>

<template>
    <main>
        <el-descriptions :column="4" direction="vertical" title="Movie Info" v-loading="fetching">
            <el-descriptions-item label="Cover" :rowspan="4" :span="2">
                <el-image :src="movie.cover" fit="cover" />
            </el-descriptions-item>
            <el-descriptions-item label="Title">{{ movie.title }}</el-descriptions-item>
            <el-descriptions-item label="Genres">
                <el-tag v-for="(genre, index) in movie.genres" :key="index" type="primary" >{{ genre }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Release Date">{{ movie.date }}</el-descriptions-item>
            <el-descriptions-item label="Country/Countries of Origin">{{ movie.location }}</el-descriptions-item>
            <el-descriptions-item label="Director">{{ movie.director}}</el-descriptions-item>
            <el-descriptions-item label="Stars">{{ movie.stars}}</el-descriptions-item>
            <el-descriptions-item label="Runtime">{{ movie.runtime }}</el-descriptions-item>
            <el-descriptions-item label="Language/Languages">{{ movie.language }}</el-descriptions-item>
            <el-descriptions-item label="Storyline" :span="4">{{ movie.storyline }}</el-descriptions-item>
            <el-descriptions-item label="Rating" :span="4">
                <el-row justify="space-around">
                    <el-col :span="6">
                        <el-text type="info">Critic Rating</el-text>
                        <el-statistic :value="movie.criticRating" suffix="/10" />
                    </el-col>
                    <el-col :span="6">
                        <el-text type="info">User Rating</el-text>
                        <el-statistic :value="movie.userRating" suffix="/10" />
                    </el-col>
                    <el-col :span="6">
                        <el-text type="info">Your Review</el-text>
                        <el-empty v-if="review === null" description="Sign In" />
                        <el-button v-else type="primary" @click="reviewDialogVisible = true">View Your Review</el-button>
                    </el-col>
                </el-row>
            </el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <ul v-infinite-scroll="loadReviews" :infinite-scroll-disabled="disabled">
            <movie-review v-for="reviewId in reviews" :key="reviewId" :review-id="reviewId" />
        </ul>
        <p v-if="loading">Loading...</p>
    </main>
    <el-dialog v-model="reviewDialogVisible" title="Your Review" center>
        <el-form :model="reviewFormData" label-width="auto" ref="reviewFormRef">
            <el-form-item label="Rating">
                <el-rate v-model="reviewFormData.rating" />
            </el-form-item>
            <el-form-item label="Content">
                <el-input v-model="reviewFormData.content" type="textarea" rows="4" maxlength="200" show-word-limit />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="resetForm">Reset</el-button>
            <el-button type="primary" @click="submitForm">Review</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>