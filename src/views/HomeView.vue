<script setup>
import {onMounted, ref} from "vue";
import service from "@/api/axios";
import {ElNotification} from "element-plus";
import MovieItem from "@/components/MovieItem.vue";
import MovieList from "@/components/MovieList.vue";

// Data
const hotMovies = ref(null);
const fetching = ref(true);
const genres = [];
const categories = [];
const movies = ref(null);
const moviesDialogVisible = ref(false);

// Methods
const fetchData = async () => {
    try {
        const response = await service.get('/movie/cinema/now-playing');
        if (response['code'] === 200) {
            hotMovies.value = response.data['hot-movies'];
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
const handleClick = async (genre, category) => {
    try {
        const response = await service.get('/movie/list', {
            params: {
                genre: genre,
                category: category
            }
        });
        if (response['code'] === 200) {
            movies.value = response.data['movies'];
            moviesDialogVisible.value = true;
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

// Mounted
onMounted(() => {
    fetchData();
});
</script>

<template>
    <el-menu default-active="/" mode="horizontal" router>
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/recommendation">Recommendation</el-menu-item>
        <el-menu-item index="/user">User</el-menu-item>
    </el-menu>
    <main>
        <el-carousel type="card" height="200px" :interval="4000">
            <el-carousel-item v-for="(movieId, index) in hotMovies" :key="index">
                <movie-item :movie-id="movieId" />
            </el-carousel-item>
        </el-carousel>
        <el-row v-for="(genre, index) in genres" :key="index" justify="space-around">
            <el-col v-for="(category, index) in categories" :key="index" :span="6">
                <movie-list :genre="genre" :category="category" @click="handleClick(genre, category)" />
            </el-col>
        </el-row>
        <el-dialog v-model="moviesDialogVisible" title="Movie List" center>
            <el-scrollbar height="800px">
                <el-row v-for="(movieId, index) in movies" :key="movieId">
                    <el-col :span="4">
                        <el-text type="primary">{{ index + 1 }}</el-text>
                    </el-col>
                    <el-col :span="20">
                        <movie-item :movie-id="movieId" />
                    </el-col>
                </el-row>
            </el-scrollbar>
        </el-dialog>
    </main>
</template>

<style scoped>

</style>