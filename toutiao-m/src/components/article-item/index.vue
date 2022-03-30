<template>
	<!-- 文章列表项组件 -->

	<!-- - 使用 Cell 单元格组件 - 展示标题 - 展示底部信息 -->
	<van-cell
		class="article-item"
		:to="{
			name: 'article', //路由名称进行跳转
			params: {// 传递路由动态参数,给子组件
				articleId: articleItem.art_id, // 属性名：路由路径中设计的动态参数名称
			},
		}"
	>
		<!-- 左侧标题 ,van-multi-ellipsis--l2:将标题改成最多显示2行，加省略号-->
		<div slot="title" class="title van-multi-ellipsis--l2">
			{{ articleItem.title }}
		</div>

		<!-- 标题底部信息 -->
		<div slot="label">
			<!-- 图片 -->
			<div class="label-image-wrap" v-if="articleItem.cover.type === 3">
				<div
					class="cover-item"
					v-for="(img, index) in articleItem.cover.images"
					:key="index"
				>
					<van-image class="cover-item-img" fit="cover" :src="img" />
				</div>
			</div>

			<!-- 底部文字 -->
			<div class="label-info-wrap">
				<span>{{ articleItem.aut_name }}</span>
				<span>{{ articleItem.comm_count }}评论</span>
				<span>{{ articleItem.pubdate | relativeTime }}</span>
			</div>
		</div>

		<!-- 右侧图片 -->
		<van-image
			class="right-cover"
			v-if="articleItem.cover.type === 1"
			slot="default"
			:src="articleItem.cover.images[0]"
		/>
	</van-cell>
</template>
<script>
	export default {
		name: "ArticleItem",
		components: {},
		props: {
			// 子组件接收父组件的传值
			articleItem: {
				type: Object,
				required: true,
			},
		},
		data() {
			return {};
		},
		computed: {},
		watch: {},
		created() {},
		mounted() {},
		methods: {},
	};
</script>

<style scoped lang="less">
	.article-item {
		// 标题
		.title {
			font-size: 32px;
			color: #3a3a3a;
		}
		.van-cell__title {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		// 标题底部内容
		// 图片
		.label-image-wrap {
			display: flex;
			padding: 30px 0;
			.cover-item {
				flex: 1;
				height: 146px;
				&:not(:last-child) {
					padding-right: 4px;
				}
				.cover-item-img {
					width: 100%;
					height: 146px;
				}
			}
		}
		// 文字
		.label-info-wrap {
			font-size: 22px;
			color: #b4b4b4;
			span {
				margin-right: 25px;
			}
		}

		// 右侧图片
		.van-cell__value {
			flex: unset; //不参与平分父空间
			// flex-shrink: 0;//指定flex元素的收缩规则
			width: 232px;
			height: 146px;
			padding-left: 25px;
		}
		.right-cover {
			width: 100%;
			height: 146px;
		}
	}
</style>
