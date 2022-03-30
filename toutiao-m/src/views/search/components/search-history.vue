<template>
	<!-- 搜索历史-组件 -->
	<div class="search-history">
		<van-cell title="搜索历史">
			<div class="text-btn" v-if="isDeleteShow">
				<span @click="$emit('clearSearchHistory')">全部删除</span>
				&nbsp;
				<span @click="isDeleteShow = false">完成</span>
			</div>

			<van-icon v-else name="delete-o" @click="isDeleteShow = true" />
		</van-cell>
		<van-cell
			v-for="(item, index) in searchHistories"
			:key="index"
			:title="item"
			@click="onSearchItemClick(item, index)"
		>
			<van-icon v-show="isDeleteShow" name="close" />
		</van-cell>
	</div>
</template>
<script>
	export default {
		name: "SearchHistory",
		components: {},
		props: {
			searchHistories: {
				type: Array,
				required: true,
			},
		},
		data() {
			return {
				isDeleteShow: false, // 是否是删除状态
			};
		},
		computed: {},
		watch: {},
		created() {},
		mounted() {},
		methods: {
			// 当"发生搜索"的时候(即:触发了onSearch()事件),我们才需要记录历史记录
			// searchHistories:在父组件中监听,并存储,然后传给子组件,渲染template
			// 1.删除历史记录
			onSearchItemClick(item, index) {
				
				if (this.isDeleteShow) {
					this.searchHistories.splice(index, 1);// 如果是删除状态，则执行删除操作
				} else {
					// 否则执行搜索操作
					//search--->1) 为输入框重新赋值;2)展示所有搜索结果
					this.$emit('search',item)
				}
			},
			
		},
	};
</script>

<style scoped lang="less"></style>
