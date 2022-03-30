<template>
	<!-- 关注用户组件 -->
	<!-- <div class="follow-user"> -->
	<van-button
		v-if="isFollowed"
		type="info"
		color="#3296fa"
		round
		size="small"
		icon="plus"
		@click="onFollow"
		:loading="followLoading"
		>关注
	</van-button>
	<van-button
		v-else
		round
		size="small"
		@click="onFollow"
		:loading="followLoading"
		>已关注</van-button
	>
	<!-- </div> -->
</template>
<script>
	import { addFollow, deleteFollow } from "@/api/user"
	export default {
		name: 'FollowUser',
		components: {
		},
		// 父子组件通信
		// 自定义 v-model 的数据名称
		model: {
			prop: 'isFollowed',// 默认是 value
			event: 'updateFollowed'// 默认是 input
		},
		props: {
			// articleDetail: {
			// 	type: Object,
			// 	required: true
			// }
			userId: {
				type: [Number, String, Object],
				required: true
			},
			isFollowed: {
				type: Boolean,
				required: true
			}
		},
		data() {
			return {
				followLoading: false  //关注按钮的按钮的 loading 状态
			}
		},
		computed: {},
		watch: {},
		created() { },
		mounted() { },
		methods: {
			// 3.关注用户
			async onFollow() {
				// 开启按钮的loading状态
				this.followLoading = true
				try {
					const authorId = this.userId//用户id
					const isFollowedZ = this.isFollowed//是否已关注该用户

					if (isFollowedZ) {
						// 1）已关注：调用deleteFollow接口，取消关注
						await deleteFollow(authorId)

					} else {
						// 2）未关注：调用addFollow接口，添加关注
						await addFollow(authorId)
					}
					// 更新关注状态
					// 操作父组件中的字段,自定义事件
					this.$emit('updateFollowed', !isFollowedZ)

					// isFollowedZ = !isFollowedZ

				} catch (error) {
					console.log(error)
					let message = '操作失败,请重试！'

					// 自己不能关注自己，会报400
					if (error.response && error.response.status === 400) {
						message = '你不能关注/或取消关注你自己'
					}

					this.$toast.fail(message)
					// this.$toast(message)
				}
				// 关闭按钮的 loading 状态
				this.followLoading = false
			}
		}
	}
</script>

<style scoped lang="less">
</style>
