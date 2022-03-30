<template>
	<div class="comment-reply">
		<!-- 顶部导航栏 -->
		<van-nav-bar
			:title="
				comment.reply_count > 0 ? `${comment.reply_count}条回复` : '0条回复'
			"
			class="comment-reply-nav"
		>
			<!-- 左侧关闭按钮 -->
			<van-icon slot="left" name="cross" @click="$emit('close')"></van-icon>
		</van-nav-bar>
		<!-- 评论区 -->
		<div class="scroll-wrap">
			<!-- 当前评论项 -->
			<comment-item :comment="comment" :isShowCommentBtn="false" />

			<!-- 当前评论项的--评论列表 -->
			<van-cell title="全部回复" />
			<comment-list
				:source="comment.com_id"
				:list="commentList"
				commentType="c"
				@reply-comment="showPostPopUp"
			/>

			<!-- 底部-写评论 -->
			<div class="reply-bottom">
				<van-button
					class="write-btn"
					size="small"
					round
					@click="isPostShow = true"
					>写评论</van-button
				>
			</div>
		</div>

		<!-- 发布评论popup -->
		<van-popup v-model="isPostShow" position="bottom">
			<comment-post :target="comment.com_id" @post-success="onPostSuccess" />
		</van-popup>
	</div>
</template>
<script>
	// 引入评论列表，评论项，发布评论组件
	import CommentList from './comment-list.vue'
	import CommentPost from './comment-post.vue'
	import CommentItem from './comment-item.vue'
	export default {
		name: 'CommentReply',
		components: {
			CommentList,
			CommentPost,
			CommentItem
		},
		props: {
			comment: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				isPostShow: false,///是否显示 发布评论popup
				commentList: [],
				type: 'c',
				thirdCommentCotent: ''
			}
		},
		computed: {},
		watch: {},
		created() { },
		mounted() { },
		methods: {
			// 1.,点击发布后，调用接口，发布评论
			onPostSuccess(dataObj) {
				console.log(dataObj.new_obj)
				this.comment.reply_count++//评论项的回复数加1

				// 1)关闭 添加评论popup
				this.isPostShow = false

				// 如果是 ”评论项3级回复“，content形式是：content+this.comment.name+this.comment.content
				dataObj.new_obj.content = `${dataObj.new_obj.content}//@${this.thirdCommentCotent}`
				// 2)将添加评论 接口返回的最新数据,添加到评论列表顶部
				this.commentList.unshift(dataObj.new_obj)
			},

			showPostPopUp(comment) {
				// console.log(comment)
				this.isPostShow = true
				this.thirdCommentCotent = `${comment.aut_name}:${comment.content}`
				console.log(this.thirdCommentCotent)
			}
		}
	}
</script>

<style scoped lang="less">
	.comment-reply {
		.comment-reply-nav {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
		}
		.scroll-wrap {
			position: fixed;
			top: 92px;
			left: 0;
			right: 0;
			bottom: 88px;
			overflow-y: auto;
		}

		.reply-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 88px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			border-top: 1px solid #d8d8d8;
			.write-btn {
				width: 60%;
			}
		}
	}
</style>