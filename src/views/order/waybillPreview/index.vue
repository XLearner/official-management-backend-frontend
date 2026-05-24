<template>
    <el-dialog
        v-model="visible"
        title="面单预览"
        width="600px"
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <div class="waybill-toolbar">
            <el-checkbox
                v-if="goodsCount > 1"
                v-model="selectAll"
                :indeterminate="isIndeterminate"
                @change="handleSelectAll"
            >
                全选 ({{ selectedIndices.length }}/{{ goodsCount }})
            </el-checkbox>
            <span v-if="goodsCount > 1" class="goods-tip">勾选要生成的包裹（默认全部）</span>
            <div class="watermark-toggle">
                <el-switch v-model="showWatermark" active-text="水印" />
            </div>
            <el-button type="primary" size="small" @click="reGenerate">重新生成</el-button>
            <el-button type="success" size="small" :disabled="waybills.length === 0" @click="downloadSelected">
                下载选中 ({{ selectedIndices.length }})
            </el-button>
            <el-button type="success" size="small" plain :disabled="waybills.length === 0" @click="downloadAll">
                全部下载
            </el-button>
        </div>

        <div v-if="goodsCount > 1 && !selectAll" class="goods-select-grid">
            <el-checkbox
                v-for="i in goodsCount"
                :key="i"
                v-model="selectedIndices"
                :label="i"
                :value="i"
                @change="handleIndexChange"
            >
                第 {{ i }} 件
            </el-checkbox>
        </div>

        <div v-loading="loading" class="waybill-list">
            <div v-if="!loading && waybills.length === 0" class="empty-state">
                点击「重新生成」生成面单
            </div>
            <div
                v-for="(wb, idx) in waybills"
                :key="idx"
                class="waybill-item"
                :class="{ selected: selectedIndices.includes(wb.index) }"
                @click="toggleSelect(wb.index)"
            >
                <el-image :src="wb.image" fit="contain" class="waybill-img" />
                <div class="waybill-label">第 {{ wb.index }} 件 / 共 {{ wb.total }} 件</div>
                <el-checkbox
                    :model-value="selectedIndices.includes(wb.index)"
                    class="waybill-check"
                    @click.stop
                    @change="toggleSelect(wb.index)"
                />
            </div>
        </div>

        <template #footer>
            <el-button @click="handleClose">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import { apiGenerateWaybill } from '../../api/index';

const props = defineProps<{
    modelValue: boolean;
    orderId: string;
    goodsCount: number;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void;
}>();

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const loading = ref(false);
const showWatermark = ref(false);
const waybills = ref<any[]>([]);
const selectedIndices = ref<number[]>([]);
const selectAll = ref(true);
const isIndeterminate = ref(false);

const initState = () => {
    selectedIndices.value = Array.from({ length: props.goodsCount }, (_, i) => i + 1);
    selectAll.value = true;
    isIndeterminate.value = false;
    showWatermark.value = false;
};

const handleSelectAll = (val: boolean) => {
    if (val) {
        selectedIndices.value = Array.from({ length: props.goodsCount }, (_, i) => i + 1);
        isIndeterminate.value = false;
    } else {
        selectedIndices.value = [];
        isIndeterminate.value = false;
    }
};

const handleIndexChange = () => {
    if (selectedIndices.value.length === 0) {
        selectAll.value = false;
        isIndeterminate.value = false;
    } else if (selectedIndices.value.length === props.goodsCount) {
        selectAll.value = true;
        isIndeterminate.value = false;
    } else {
        selectAll.value = false;
        isIndeterminate.value = true;
    }
};

const toggleSelect = (idx: number) => {
    const pos = selectedIndices.value.indexOf(idx);
    if (pos >= 0) {
        selectedIndices.value.splice(pos, 1);
    } else {
        selectedIndices.value.push(idx);
        selectedIndices.value.sort((a, b) => a - b);
    }
    handleIndexChange();
};

const generateWaybill = (indices?: number[]) => {
    if (!props.orderId) return;
    loading.value = true;
    waybills.value = [];

    const params: any = {
        orderId: props.orderId,
        watermark: showWatermark.value,
    };
    if (indices && indices.length > 0 && indices.length < props.goodsCount) {
        params.goodsIndices = indices;
    }

    apiGenerateWaybill(props.orderId, params.goodsIndices, params.watermark)
        .then((res: any) => {
            if (res.code >= 0 && res.data && res.data.waybills) {
                waybills.value = res.data.waybills;
                if (!indices || indices.length === 0) {
                    selectedIndices.value = Array.from({ length: props.goodsCount }, (_, i) => i + 1);
                }
            } else {
                ElMessage.error(res.msg || '生成面单失败');
            }
        })
        .finally(() => {
            loading.value = false;
        });
};

const reGenerate = () => {
    const indices = selectAll.value ? undefined : selectedIndices.value;
    generateWaybill(indices);
};

const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadSelected = () => {
    const selected = waybills.value.filter(wb => selectedIndices.value.includes(wb.index));
    selected.forEach((wb, i) => {
        setTimeout(() => {
            downloadImage(wb.image, `面单_${props.orderId}_${wb.index}-${wb.total}.png`);
        }, i * 300);
    });
    ElMessage.success(`开始下载 ${selected.length} 张面单`);
};

const downloadAll = () => {
    waybills.value.forEach((wb, i) => {
        setTimeout(() => {
            downloadImage(wb.image, `面单_${props.orderId}_${wb.index}-${wb.total}.png`);
        }, i * 300);
    });
    ElMessage.success(`开始下载 ${waybills.value.length} 张面单`);
};

const handleClose = () => {
    visible.value = false;
};

watch(() => props.modelValue, (val) => {
    if (val) {
        initState();
        generateWaybill();
    }
});

watch(showWatermark, () => {
    if (visible.value && waybills.value.length > 0) {
        reGenerate();
    }
});
</script>

<style scoped>
.waybill-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
}

.goods-tip {
    font-size: 12px;
    color: #999;
}

.watermark-toggle {
    margin-left: auto;
}

.goods-select-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 12px;
}

.waybill-list {
    max-height: 500px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 4px;
}

.empty-state {
    width: 100%;
    text-align: center;
    padding: 40px;
    color: #999;
}

.waybill-item {
    position: relative;
    border: 2px solid transparent;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s;
}

.waybill-item.selected {
    border-color: #409eff;
}

.waybill-img {
    display: block;
    width: 240px;
    height: auto;
    max-height: 200px;
}

.waybill-label {
    text-align: center;
    font-size: 12px;
    color: #666;
    padding: 4px 0;
    background: #f5f5f5;
}

.waybill-check {
    position: absolute;
    top: 6px;
    right: 6px;
}
</style>