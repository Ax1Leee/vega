<script setup>
import {computed, onMounted, ref} from "vue";
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
const count = ref(0);
const loading = ref(false);

// Computed
const disabled = computed(() => {
    return fetching.value || loading.value || !(count.value < total.value);
});

// Methods
const fetchData = async () => {
    try {
        count.value = 10;
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
const loadData = async () => {
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
}

// Mounted
onMounted(() => {
    fetchData();
});
</script>

<template>
    <el-descriptions :column="4" direction="vertical" title="Movie Info" v-loading="fetching">
        <el-descriptions-item label="Cover" :rowspan="4" :span="2">
            <el-avatar :size="100" shape="square" :src="movie.cover" />
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
            <el-statistic class="movie-critic-rating" :value="movie.criticRating" suffix="/10" title="Critic Rating" />
            <el-statistic class="movie-user-rating" :value="movie.userRating" suffix="/10" title="User Rating" />
        </el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <ul class="user-reviews" v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled">
        <movie-review v-for="reviewId in reviews" :key="reviewId" :review-id="reviewId" />
    </ul>
    <p v-if="loading">Loading...</p>
</template>

<style scoped>

</style>