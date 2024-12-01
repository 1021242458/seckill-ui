<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//用户搜索参数
const keyword = ref('')
const minPrice = ref('')
const maxPrice = ref('')

//文章列表数据模型
const products = ref([
    {
        "id": 1,
        "name": "静态商品名称1",
        "title": "静态商品标题1",
        "img": "https://static1.png",
        "detail": "静态商品详情描述1",
        "price": 10,
        "stock": 1,
    },
    {
        "id": 2,
        "name": "静态商品名称2",
        "title": "静态商品标题2",
        "img": "https://static2.png",
        "detail": "静态商品详情描述2",
        "price": 20,
        "stock": 2,
    },
    {
        "id": 3,
        "name": "静态商品名称3",
        "title": "静态商品标题3",
        "img": "https://static3.png",
        "detail": "静态商品详情描述3",
        "price": 30,
        "stock": 3,
    },
    {
        "id": 4,
        "name": "静态商品名称4",
        "title": "静态商品标题4",
        "img": "https://static4.png",
        "detail": "静态商品详情描述4",
        "price": 40,
        "stock": 4,
    }
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    productList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    productList()
}

import { productListService } from '@/api/product.js'

//获取商品列表数据
const productList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        keyword: keyword.value ? keyword.value : null,
        minPrice: minPrice.value ? minPrice.value : null,
        maxPrice: maxPrice.value ? maxPrice.value : null
    }
    let result = await productListService(params);

    //渲染视图
    total.value = result.data.total;
    products.value = result.data.items;
}

productList();

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'

//导入token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

//控制抽屉是否显示
const visibleDrawer = ref(false)
const selectedProduct = ref({
    id: 1,
    name: "静态商品名称1",
    title: "静态商品标题1",
    img: "https://static1.png",
    detail: "静态商品详情描述1",
    price: 10,
    stock: 1,
});

const showProductDetails = (row) => {
    // 当点击商品详情按钮时，将当前商品的信息存储到 selectedProduct
    selectedProduct.value = row;
    visibleDrawer.value = true; // 显示 Drawer
};

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header" style="justify-content: center;">
                <span>商品列表</span>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="搜索关键词：">
                <el-input placeholder="请输入关键词" v-model="keyword"></el-input>
            </el-form-item>

            <el-form-item label="最小价格：">
                <el-input placeholder="请输入最小价格" v-model="minPrice"></el-input>
            </el-form-item>

            <el-form-item label="最大价格：">
                <el-input placeholder="请输入最大价格" v-model="maxPrice"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="productList">搜索</el-button>
                <el-button @click="keyword = ''; minPrice = ''; maxPrice = ''">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 商品列表 -->
        <el-table :data="products" style="width: 100%">
            <el-table-column label="商品id" width="400" prop="id"></el-table-column>
            <el-table-column label="商品名称" prop="name"></el-table-column>
            <el-table-column label="商品价格" prop="price"></el-table-column>
            <el-table-column label="商品库存" prop="stock"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button type="primary" :icon="Search" @click="showProductDetails(row)">商品详情</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="商品详情" direction="rtl" size="50%">
            <div v-if="selectedProduct">
                <p><strong>商品ID：</strong>{{ selectedProduct.id }}</p>
                <p><strong>商品名称：</strong>{{ selectedProduct.name }}</p>
                <p><strong>商品标题：</strong>{{ selectedProduct.title }}</p>
                <img v-if="imgUrl" :src="selectedProduct.img" class="avatar" />
                <img v-else src="@/assets/product_example.jpg" width="278" />
                <p><strong>商品详情：</strong>{{ selectedProduct.detail }}</p>
                <p><strong>商品价格：</strong>{{ selectedProduct.price }}</p>
                <p><strong>商品库存：</strong>{{ selectedProduct.stock }}</p>
            </div>
        </el-drawer>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>