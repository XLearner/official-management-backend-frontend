<template>
	<div class="editor-component">
		<!-- <div v-if="!content.ifModify" @click="modifyMess">start {{ content.html }}</div> -->
		<div class="mgb20" ref="editor"></div>
		<el-button type="primary" @click="syncHTML" v-if="content.ifModify">确认</el-button>
	</div>
</template>

<script setup lang="ts" name="editor">
import WangEditor from 'wangeditor';
import { ref, reactive, onMounted, onBeforeUnmount, defineProps, defineExpose } from 'vue';

const props = defineProps(['value']);
const editor = ref(null);
const content = reactive({
	html: '',
	text: '',
	ifModify: false,
});
let instance: any;
onMounted(() => {
	instance = new WangEditor(editor.value);
	instance.config.zIndex = 1;
	const ins = instance.create();
});
onBeforeUnmount(() => {
	instance.destroy();
	instance = null;
});
const syncHTML = () => {
	content.html = instance.txt.html();
	console.log(content.html);
	content.ifModify = false;
};
const modifyMess = () => {
	content.ifModify = true;
};

const setHtml = (html: any) => {
	instance.txt.html(html)
}
const getHtml = () => {
	return instance.txt.html();
}
const clear = () => {
	instance.txt.html('');
}

defineExpose({ setHtml, getHtml, clear })
</script>