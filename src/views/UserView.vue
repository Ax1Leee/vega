<script setup>
import {computed, onMounted, ref} from "vue";
import service from "@/api/axios";
import {ElNotification} from "element-plus";
import UserReview from "@/components/UserReview.vue";

// Data
const user = ref(null);
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
        const response = await service.get('/user/reviews', {
            params: {
                count: count.value
            }
        });
        if (response['code'] === 200) {
            user.value = response.data['user'];
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
        const response = await service.get('/user/reviews', {
            params: {
                count: count.value
            }
        });
        if (response['code'] === 200) {
            user.value = response.data['user'];
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
    <el-descriptions :column="4" direction="vertical" title="User Info" v-loading="fetching">
        <el-descriptions-item label="Avatar" :rowspan="2" :span="2">
            <el-avatar :size="100" shape="square" :src="user.avatar" />
        </el-descriptions-item>
        <el-descriptions-item label="Name">{{ user.name }}</el-descriptions-item>
        <el-descriptions-item label="Gender">{{ user.gender }}</el-descriptions-item>
        <el-descriptions-item label="Birth Date">{{ user.date }}</el-descriptions-item>
        <el-descriptions-item label="Location">{{ user.location }}</el-descriptions-item>
        <el-descriptions-item label="Bio" :span="4">{{ user.bio }}</el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <ul class="user-reviews" v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled">
        <user-review v-for="reviewId in reviews" :key="reviewId" :review-id="reviewId" />
    </ul>
    <p v-if="loading">Loading...</p>
</template>

<style scoped>

</style>