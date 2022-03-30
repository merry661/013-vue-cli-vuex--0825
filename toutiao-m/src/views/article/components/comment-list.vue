<template>
	<!-- 评论列表组件 -->
	<!-- :immediate-check="false" : 为了避免文章评论列表多次调接口，导致重复数据出现 -->
	<div class="comment-list">
		<van-list
			v-model="loading"
			:finished="finished"
			finished-text="已显示全部评论"
			:error="error"
			error-text="加载失败，请点击重试"
			:immediate-check="false"
			@load="onLoad"
		>
			<!-- 评论项组件 -->
			<comment-item
				class="comment-info"
				v-for="(item, index) in list"
				:key="index"
				:comment="item"
				@reply-comment="$emit('reply-comment', $event)"
			/>
		</van-list>
	</div>
</template>
<script>
	// 引入接口方法
	import { getComments } from "@/api/comment"
	import CommentItem from './comment-item.vue'

	export default {
		name: 'CommentList',
		components: {
			CommentItem
		},
		props: {
			source: {
				type: [Number, String, Object],
				required: true
			},
			// 父组件更新后的评论列表
			list: {
				type: Array,
				default: () => []
			},
			// 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
			commentType: {
				type: String,
				// 自定义 Prop 数据验证
				validator(value) {
					return ['a', 'c'].includes(value)
				},
				default: 'a'
			}
		},
		data() {
			return {
				// list: [],有了父组件传来的list,这里就不需要初始化了
				loading: false,
				finished: false,
				error: false,
				// 评论请求 相关
				// type: 'a',
				// 获取评论数据的偏移量.值为评论id:表示从此id的数据向后取;
				// 不传:表示从第一页开始读取数据
				offset: null,
				limit: 10,
			}
		},
		computed: {},
		watch: {},
		created() {
			// 当你手动初始 onLoad 的话，它不会自动开始初始的 loading
			// 所以我们要手动的开启初始 loading
			this.loading = true
			this.onLoad()
		},
		mounted() { },
		methods: {
			async onLoad() {

				try {
					// 1、请求评论列表数据
					const { data } = await getComments({
						type: this.commentType, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
						source: this.source.toString(),// 源id，文章id或评论id
						offset: this.offset,
						limit: this.limit// 每页条目数
					})
					// 2、将数据添加到列表中
					const { results, total_count: totalCount } = data.data
					this.list.push(...results)

					// 6.把当前文章的总评论数,传到父组件
					this.$emit('onloadComments-success', totalCount)

					// 4、判断是否还有数据，无，则finished设为false
					if (results.length) {
						// 有就更新获取下一页的数据页码
						this.offset = data.data.last_id
					} else {
						// 没有就将 finished 设置结束
						this.finished = true
					}
				} catch (err) {
					this.error = true
				}
				// 3、loading设为false
				this.loading = false
			}
		}
	}
</script>

<style scoped lang="less">
	.comment-list {
		.van-list {
			margin-bottom: 100px;
			.comment-info {
				.portrait {
					width: 50px;
					height: 50px;
					margin-right: 20px;
				}
			}
		}

		.publish-wrap {
			position: fixed;
			left: 0;
			bottom: 90px;
			width: 100%;
		}
	}
</style>
