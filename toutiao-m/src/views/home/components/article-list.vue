<template>
	<!-- 文章列表组件 -->
	<div class="article-list">
		<!-- 下拉刷新：将需要被刷新的部分包裹住 -->
		<van-pull-refresh
			v-model="isreFreshLoading"
			:success-text="refreshText"
			:success-duration="1000"
			@refresh="onRefresh"
		>
			<!-- 使用List组件 -->
			<van-list
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				:error.sync="error"
				error-text="请求失败，点击重新加载!"
				@load="onLoad"
			>
				<!-- <van-cell
					v-for="(articleItem, index) in list"
					:key="index"
					:title="articleItem.title"
				/> -->
				<article-item
					v-for="(articleItem, index) in list"
					:key="index"
					:title="articleItem.title"
					:articleItem="articleItem"
				/>
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
	// 引入接口
	import { getArticles } from "@/api/article";
	//引入子组件--注册使用文章列表项组件
	import ArticleItem from "@/components/article-item";

	export default {
		name: "ArticleList",
		components: {
			ArticleItem,
		},
		props: {
			// 子组件接收父组件的传值
			channels: {
				type: Object,
				required: true,
			},
		},
		data() {
			return {
				/**
				 *list组件
				 *list: [],         存储列表数据的数组
				 *loading: false,   控制加载中loading状态
				 *finished: false,  控制数据加载结束的状态
				 *timestamp  请求获取下一页数据的时间戳
				 *error:false,  加载失败
				 *isreFreshLoading // 控制下拉刷新的 loading 状态
				 *refreshText:"刷新成功啦"  下拉刷新成功提示文本
				 */
				list: [],
				loading: false,
				finished: false,
				timestamp: null,
				error: false,
				isreFreshLoading: false,
				refreshText: "刷新成功啦",
			};
		},
		computed: {},
		watch: {},
		created() {},
		mounted() {},
		methods: {
			//1. 每次下拉刷新页面/每次点击tab项 都会触发onLoad()方法(被多次触发)
			async onLoad() {
				try {
					//1. 请求获取数据
					//接口参数：频道ID，时间戳整数，是否包含置文章（0或1）
					const { data } = await getArticles({
						channel_id: this.channels.id,
						timestamp: this.timestamp || Date.now(),
						with_top: 1,
					});
					
					// // 模拟随机失败的情况
					// if (Math.random() > 0.5) {
					//   JSON.parse('dsnajndjsa')
					// }

					// 2. 把请求结果数据放到 list 数组中
					const { results } = data.data;
					// console.log(results);

					//每次滚动--动态往list数组内追加data,每次追加10条
					//数组的展开操作符，它会把数组元素一个一个拿出来，逐个追加而不是整体覆盖
					this.list.push(...results);

					// 3. 本次数据加载结束后---把加载状态置为结束（false）
					this.loading = false;

					// 4. 判断数据是否全部加载完成
					if (results.length) {
						this.timestamp = data.data.pre_timestamp; //更新获取下一页数据的时间戳
					} else {
						// 没有数据了，将 finished 设置为 true，不再 load 加载更多了
						this.finished = true;
					}
				} catch (error) {
					// 获取数据失败
					this.loading = false; // 关闭 loading 效果
					this.error = true; // 开启错误提示
				}
			},

			// 2. 注册下拉刷新事件（组件）的处理函数
			async onRefresh() {
				try {
					//1）发送请求获取文章列表数据
					const { data } = await getArticles({
						channel_id: this.channel.id, // 频道ID
						timestamp: Date.now(), // 下拉刷线，每次请求获取最新数据，所以传递当前最新时间戳
						with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
					});

					// // 模拟随机失败的情况
					// if (Math.random() > 0.2) {
					//   JSON.parse('dsnajndjsa')
					// }

					//2）将数据追加到列表的”顶部“
					const { results } = data.data;
					this.list.unshift(...results);

					this.isreFreshLoading = false; //3）关闭下拉刷新的 loading 状态

					//4）提示用户刷新成功！
					this.refreshText = `刷新成功，更新了${results.length}条数据`;
				} catch (error) {
					// 下拉刷新失败
					this.isreFreshLoading = false; // 关闭下拉刷新的 loading 状态
					// 提示用户刷新失败！
					this.refreshText = "刷新失败啦！";
				}
			},
		},
	};
</script>

<style scoped lang="less">
	// 记住列表的滚动位置：让每一个文章列表产生自己的滚动容器。（之前是：统一把dody设为滚动容器）
	.article-list {
		// 百分比单位是相对于父元素的
		// height: 100%;
		// 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
		// 1vw = 视口宽度的百分之一
		// 1vh = 视口高度的百分之一
		height: 79vh;
		overflow-y: auto;
	}
</style>
