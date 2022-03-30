<template>
	<!-- 收藏组件 -->
	<van-button
		:icon="value ? 'star' : 'star-o'"
		:class="{
			collected: value,
		}"
		@click="onCollect"
		:loading="loading"
	>
		<!-- {{ this.value }} -->
	</van-button>
</template>
<script>
	// 引入接口方法
	import { addCollect, deleteCollect } from '@/api/article'
	export default {
		name: 'CollectArticle',
		components: {
		},
		props: {
			value: {
				type: Boolean,
				required: true
			},
			articleId: {
				type: [Number, String, Object],
				required: true,
			},
		},
		data() {
			return {
				loading: false
			}
		},
		computed: {},
		watch: {},
		created() { },
		mounted() { },
		methods: {
			//给收藏按钮注册点击事件
			async onCollect() {
				//1. 一触发就显示loading
				this.loading = true

				const articleId = this.articleId//文章Id
				try {
					//value:父组件传来的is_collect字段值,true:已收藏，false:未收藏
					if (this.value) {					
						//3. 如果已经收藏了，则取消收藏
						await deleteCollect(articleId)

					} else {
						//2. 如果没有收藏，则添加收藏
						await addCollect(this.articleId)
					}

					// 更新视图
					//4.自定义事件 修改数据并不是立即的
					this.$emit('input', !this.value)

					// 5.提示操作成功
					this.$toast.success(!this.value ? '收藏成功' : '取消收藏')

				} catch (err) {
					console.log(err)
					this.$toast.fail('操作失败，请重试！')
				}
				this.loading = false
			}
		}
	}
</script>

<style scoped lang="less">
	.collected {
		.van-icon {
			color: #ffa500;
		}
	}
</style>
