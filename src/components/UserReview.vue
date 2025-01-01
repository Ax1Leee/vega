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
    <el-card id="user-review" style="max-width: 400px;">
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
                        <p>{{ movie.date }} / {{ movie.location }}</p>
                        <el-row justify="space-around">
                            <el-col :span="8">
                                Critic Rating
                                <el-statistic :value="movie.criticRating" suffix="/10" />
                            </el-col>
                            <el-col :span="8">
                                User Rating
                                <el-statistic :value="movie.userRating" suffix="/10" />
                            </el-col>
                        </el-row>
                    </el-main>
                </el-container>
            </el-container>
        </template>
        <p>
            <el-rate v-model="review.rating" :max="10" disabled/> {{ review.date }}
        </p>
        <p>{{ review.content }}</p>
    </el-card>
</template>

<style scoped>

</style>