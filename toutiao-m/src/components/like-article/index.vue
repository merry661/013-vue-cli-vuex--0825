<template>
	<!-- 点赞组件 -->
	<van-button
		:icon="value === 1 ? 'good-job' : 'good-job-o'"
		:class="{
			liked: value === 1,
		}"
		@click="onLike"
		:loading="loading"
	>
		点赞
	</van-button>
</template>
<script>
	// 引入接口方法
	import { addLike, deleteLike } from '@/api/article'
	export default {
		name: 'LikeArticle',
		components: {
		},
		props: {
			value: {
				type: Number,
				required: true
			},
			articleId: {
				type: [Number, String, Object],
				required: true
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
			async onLike() {
				this.loading = true
				try {
					let attribute = this.value
					const arId = this.articleId
					/**
					 * attribute:表示用户对文章的态度
					 * attribute = 1，已点赞；
					 * attribute = -1，无态度；
					 * attribute =  0，不喜欢
					 * **/
					if (attribute === 1) {
						console.log(attribute, "点赞了")
						await deleteLike(arId)
						/**
						 * 运行到这里，attribute在页面中的值还是1（接口里的值已经改变，
						 * 但我们不是时时获取接口的），所以需要手动改值，并传给父组件，
						 * 让父组件时时影响子组件（点赞组件）
						 * **/
						attribute = -1
					} else {
						console.log(attribute, "取消点赞了")
						await addLike(arId)
						attribute = 1
					}

					// 更新视图
					this.$emit('input', attribute)
					this.$toast.success(attribute === 1 ? '点赞成功' : '取消点赞')
				} catch (error) {
					console.log(error)
					this.$toast.fail('操作失败，请重试！')
				}
				this.loading = false
			}
		}
	}
</script>

<style scoped lang="less">
	.liked {
		.van-icon {
			color: #e5645f;
		}
	}
</style>
