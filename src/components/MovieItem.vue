<script setup>
import {defineProps, onMounted, ref} from "vue";
import service from "@/api/axios";
import {ElNotification} from "element-plus";
import { useRoute } from 'vue-router';

// Route
const route = useRoute();

// Props
const props = defineProps({
    movieId: {
        type: Number,
        required: true,
        default: 0
    }
});

// Data
const movie = ref(null);
const fetching = ref(true);

// Methods
const fetchData = async () => {
    try {
        const response = await service.get('/movie/item', {
            params: {
                movieId: props.movieId
            }
        });
        if (response['code'] === 200) {
            movie.value = response.data['movie'];
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
const handleClick = () => {
    route.push({
        name: "movie",
        params: {
            movieId: props.movieId
        }
    })
};

// Mounted
onMounted(() => {
    fetchData();
});
</script>

<template>
    <el-card id="movie-item" style="max-width: 400px;" shadow="hover" @click="handleClick">
        <el-container>
            <el-aside>
                <el-image :src="movie.cover" fit="cover" />
            </el-aside>
            <el-container>
                <el-header>
                    {{ movie.title }}
                </el-header>
                <el-main>
                    <p>{{ movie.date }} / {{ movie.location }}</p>
                    <el-row justify="space-around">
                        <el-col :span="8">
                            <el-statistic title="Critic Rating" :value="movie.criticRating" suffix="/10" />
                        </el-col>
                        <el-col :span="8">
                            <el-statistic title="User Rating" :value="movie.userRating" suffix="/10" />
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
        </el-container>
    </el-card>
</template>

<style scoped>

</style>