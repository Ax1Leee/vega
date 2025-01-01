<script setup>
import {onMounted, ref} from "vue";
import service from "@/api/axios";
import {ElNotification} from "element-plus";
import MovieItem from "@/components/MovieItem.vue";
import MovieList from "@/components/MovieList.vue";

// Data
const movies = ref(null);
const fetching = ref(true);
const genres = [];
const categories = [];
const movieListDialogVisible = ref(false);

// Methods
const fetchData = async () => {
    try {
        const response = await service.get('/movie/cinema');
        if (response['code'] === 200) {
            movies.value = response.data['movies'];
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

// Mounted
onMounted(() => {
    fetchData();
});
</script>

<template>
    <div id="home-view">
        <el-menu default-active="/" mode="horizontal" router>
            <el-menu-item index="/">Home</el-menu-item>
            <el-menu-item index="/recommendation">Recommendation</el-menu-item>
            <el-menu-item index="/user">User</el-menu-item>
        </el-menu>
        <el-carousel type="card" height="200px" :interval="4000">
            <el-carousel-item v-for="movieId in movies" :key="movieId">
                <movie-item movie-id="movieId" />
            </el-carousel-item>
        </el-carousel>
        <el-row v-for="(genre, index) in genres" :key="index" justify="space-around">
            <el-col v-for="(category, index) in categories" :key="index" :span="6">
                <movie-list :genre="genre" :category="category" @click="handleClick(genre, category)" />
            </el-col>
        </el-row>
        <el-dialog v-model="movieListDialogVisible" title="Movie List" center>

        </el-dialog>
    </div>
</template>

<style scoped>

</style>