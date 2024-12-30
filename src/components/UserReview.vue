<script setup>
import {defineProps, onMounted, ref} from "vue";
import service from "@/api/axios";
import {ElNotification} from "element-plus";

// Props
const props = defineProps({
    reviewId: {
        type: Number,
        required: true,
        default: 0,
    }
})

// Data
const movie = ref(null);
const review = ref(null);
const fetching = ref(true);

// Methods
const fetchData = async () => {
    try {
        const response = await service.get('user/review', {
            params: {
                reviewId: props.reviewId
            }
        });
        if (response['code'] === 200) {
            movie.value = response.data['movie'];
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
    <el-card id="user-review" style="max-width: 800px;">
        <template #header>
            <el-container>
                <el-aside>
                    <el-image :src="movie.cover" fit="cover" />
                </el-aside>
                <el-container>
                    <el-header>
                        {{ movie.title }}
                    </el-header>
                    <el-main>
                        {{ movie.date }} {{ movie.region }}
                    </el-main>
                    <el-footer>
                        <el-statistic class="movie-critic-rating" :value="movie.criticRating" suffix="/10" title="Critic Rating" />
                        <el-statistic class="movie-user-rating" :value="movie.userRating" suffix="/10" title="User Rating" />
                    </el-footer>
                </el-container>
            </el-container>
        </template>
        <el-row>
            <el-rate v-model="review.rating" :max="10" disabled/> {{ review.date }}
        </el-row>
        <el-row>
            {{ review.content }}
        </el-row>
    </el-card>
</template>

<style scoped>

</style>