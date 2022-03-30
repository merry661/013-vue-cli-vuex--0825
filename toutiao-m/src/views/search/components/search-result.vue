<template>
	<!-- 搜索结果-组件 -->
	<div class="search-result">
		<!-- 使用List组件 -->
		<van-list
			v-model="loading"
			:finished="finished"
			finished-text="没有更多了"
			:error.sync="error"
			error-text="请求失败，点击重新加载!"
			@load="onLoad"
		>
			<van-cell
				v-for="(item, index) in resultList"
				:key="index"
				:title="item.title"
			/>
		</van-list>
	</div>
</template>
<script>
	// 1.引入接口方法
	import { getSearchResults } from "@/api/search";

	export default {
		name: "SearchResult",
		components: {},
		props: {
			searchTx: {
				type: String,
				required: true,
			},
		},
		data() {
			return {
				resultList: [], //搜索结果数据
				loading: false, //加载状态
				finished: false, //是否全部加载完成
				page: 1, //当前被加载分页的页码,默认为1
				perPage: 10, //每页条目数，不传每页数量由后端决定
				error: false, //是否 展示加载失败的提示信息
			};
		},
		computed: {},
		watch: {},
		created() {},
		mounted() {},
		methods: {
			async onLoad() {
				try {
					// 1. 请求获取数据
					// 参数:页码,每页加载条目数,搜索关键词
					const { data } = await getSearchResults({
						page: this.page,
						per_page: this.perPage,
						q: this.searchTx,
					});

					// 测试------------------------------
					// if (Math.random() > 0.5) {
					// 	JSON.parse("dsnajndjsa");
					// }
					// 2. 将数据添加到数组列表中
					const { results } = data.data;
					// this.resultList = results;
					this.resultList.push(...results);

					// 3. 将本次加载中的 loading 关闭
					this.loading = false;

					// 4. 判断是否还有数据
					//有,更新页码值,作为下一次接口的传参
					//无,则将加载状态 finished 设置为结束
					if (results.length) {
						this.page++;
					} else {
						this.finished = true;
					}
				} catch (error) {
					// onLoad()错误处理
					this.error = true; //展示加载失败的提示信息
					this.loading = false; //将本次加载中的 loading 关闭

					console.log(error);
				}
			},
		},
	};
</script>

<style scoped lang="less"></style>
