<template>
	<div class="article-container">
		<!-- 导航栏 -->
		<van-nav-bar
			class="page-nav-bar"
			left-arrow
			title="黑马头条"
			@click-left="$router.back()"
		></van-nav-bar>

		<div class="main-wrap">
			<!-- 加载中 -->
			<div v-if="loading" class="loading-wrap">
				<van-loading color="#3296fa" vertical>加载中</van-loading>
			</div>
			<!-- /加载中 -->

			<!-- 加载完成-文章详情 -->
			<div v-else-if="articleDetail.title" class="article-detail">
				<!-- 文章标题 -->
				<h1 class="article-title">
					{{ this.articleDetail.title }}
				</h1>

				<!-- 用户信息 -->
				<van-cell class="user-info" center :border="false">
					<van-image
						class="avatar"
						slot="icon"
						round
						fit="cover"
						:src="articleDetail.aut_photo"
					/>
					<div slot="title" class="user-name">{{ articleDetail.aut_name }}</div>
					<div slot="label" class="publish-date">
						{{ articleDetail.pubdate | relativeTime }}
					</div>

					<!-- 关注 -->
					<!-- :isFollowed="articleDetail.is_followed" -->
					<!-- @updateFollowed="articleDetail.is_followed = $event" -->
					<follow-user
						:userId="articleDetail.aut_id"
						v-model="articleDetail.is_followed"
						class="follow-btn"
					/>
					<!-- <van-button
						v-if="articleDetail.is_followed"
						class="follow-btn"
						type="info"
						color="#3296fa"
						round
						size="small"
						icon="plus"
						@click="onFollow"
						:loading="followLoading"
						>关注</van-button
					>
					<van-button
						v-else
						class="follow-btn"
						round
						size="small"
						@click="onFollow"
						:loading="followLoading"
						>已关注</van-button
					> -->
				</van-cell>

				<!-- 文章内容 -->
				<div
					class="article-content markdown-body"
					v-html="articleDetail.content"
					ref="article-content"
				></div>
				<van-divider>正文结束</van-divider>

				<!-- 评论列表---------- -->
				<comment-list
					:source="articleDetail.art_id"
					:list="commentList"
					@onloadComments-success="totalCommentCount = $event"
					@reply-comment="onReplyClick"
				/>

				<!-- 底部区域 -->
				<div class="article-bottom">
					<!-- 评论-icon -->
					<van-button
						class="comment-btn"
						type="default"
						round
						size="small"
						@click="isPostShow = true"
						>写评论</van-button
					>

					<!-- 评论总数 -->
					<!-- :info="articleDetail.comm_count" -->
					<van-icon name="comment-o" :info="totalCommentCount" color="#777" />

					<!-- 收藏 -->
					<!-- <van-icon color="#777" name="star-o" /> -->
					<collect-article
						:articleId="articleDetail.art_id"
						v-model="articleDetail.is_collected"
						class="btn-item"
					/>

					<!-- 点赞 -->
					<!-- <van-icon color="#777" name="good-job-o" /> -->
					<like-article
						:articleId="articleDetail.art_id"
						v-model="articleDetail.attitude"
						class="btn-item"
					/>
					<van-icon name="share" color="#777777"></van-icon>
				</div>

				<!-- 发布评论-弹出层 -->
				<van-popup v-model="isPostShow" position="bottom">
					<comment-post
						:target="articleDetail.art_id"
						@post-success="onPostSuccess"
					/>
				</van-popup>
			</div>

			<!-- 加载失败：404 -->
			<div v-else-if="errStataus === 404" class="error-wrap">
				<van-icon name="failure" />
				<p class="text">该资源不存在或已删除！</p>
			</div>

			<!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
			<div v-else class="error-wrap">
				<van-icon name="failure" />
				<p class="text">内容加载失败！</p>
				<van-button class="retry-btn" @click="loadArticleDetail"
					>点击重试</van-button
				>
			</div>
		</div>

		<!-- 注意：每次点击评论的回复，会出现不刷新的问题。
		原因：弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示和隐藏
		解决：通过v-if条件，控制元素（弹出层）的渲染，不渲染就移除DOM
		-->
		<!-- 评论回复-popup -->
		<van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
			<!-- 评论回复弹层内容部分--子组件 -->
			<comment-reply
				v-if="isReplyShow"
				@close="isReplyShow = false"
				:comment="currentComment"
			/>
		</van-popup>

		<!-- 底部区域(应该等api调用完成之后，再显示，所以挪到“ 加载完成-文章详情”内了) -->
	</div>
</template>
<script>
	// 引入接口方法
	import { getArticleById } from "@/api/article"

	// 引入子组件--”关注用户“组件
	import FollowUser from '@/components/follow-user'
	// 引入子组件--”收藏“组件
	import CollectArticle from '@/components/collect-article'
	// 引入子组件--”点赞“组件
	import LikeArticle from '@/components/like-article'
	// 引入子组件--”评论列表“组件
	import CommentList from './components/comment-list.vue'
	import CommentPost from './components/comment-post.vue'
	// 引入子组件--”评论回复“组件
	import CommentReply from './components/comment-reply.vue'

	// 从vant中引入ImagePreview方法，用于图片预览
	import { ImagePreview } from 'vant'

	export default {
		name: "ArticlePage",
		components: {
			FollowUser,
			CollectArticle,
			LikeArticle,
			CommentList,
			CommentPost,
			CommentReply
		},
		// 给所有的后代组件提供数据
		// 注意：不要滥用
		provide: function () {
			return {
				articleId: this.articleId
			}
		},
		props: {
			articleId: {
				type: [Number, String, Object],
				required: true,
			},
		},
		data() {
			return {
				articleDetail: {}, // 文章详情
				loading: true, // 加载中的 loading 状态
				errStataus: 0, //接口失败状态码,默认0，可能是404，500
				isPostShow: false,//是否显示 发布评论popup
				isReplyShow: false,//是否显示 评论回复-popup
				// 评论列表相关
				commentList: [],
				totalCommentCount: 0,//当前文章总评论数
				currentComment: {}// 当前点击回复的评论项
			}
		},
		computed: {},
		watch: {},
		created() {
			this.loadArticleDetail()
		},
		mounted() { },
		methods: {
			// 1.调用接口，获取文章详情数据
			async loadArticleDetail() {
				this.loading = true
				try {
					const { data } = await getArticleById(this.articleId)

					// 异常测试
					// if (Math.random() > 0.5) {
					// 	JSON.parse('dsankljdnskaljndlkjsa')
					// }
					this.articleDetail = data.data
					/**
					 * 数据驱动视图：
					 * 如果直接调用，代码运行到这里时，DOM 还没加载完，所以会undefined，
					 * 解决办法：使用setTimeout(),浏览器会在0秒后（即：立即插入队列），
					 * 但不是立即执行，等待前面代码执行完毕。
					 * 初始化图片点击预览
					 * **/
					setTimeout(() => {
						this.previewImage()
					}, 0)

					// console.log(data)
				} catch (error) {
					console.log(error)
					if (error.response && error.response.status === 404) {
						this.errStatus = 404//用于控制“加载失败：404 ”的显示
					}
				}
				this.loading = false//接口调用完，关闭loading
			},

			// 2.文章详情中，图片点击预览
			previewImage() {
				// 1)获得所有img DOM节点
				const articleContents = this.$refs['article-content']
				// console.log(articleContents, "dom")

				// querySelectorAll(),返回NodeList类型的集合，包含所有img DOM对象
				const imgs = articleContents.querySelectorAll('img')
				// console.log(imgs, "图片")

				// 2）获取所有img 的src地址
				const images = []  //用于存储所有图片的src地址
				imgs.forEach((img, index) => {
					images.push(img.src)

					// 3）给每个img注册点击事件，在处理函数中调用预览
					img.onclick = () => {
						// 调用vant自待的方法ImagePreview()
						ImagePreview({
							images,//存储 预览图片地址的数组
							startPosition: index// 起始位置，从 0 开始
						})
					}
				})
			},

			// 3.发布文章评论相关
			onPostSuccess(dataObj) {
				// 1)关闭 添加评论popup
				this.isPostShow = false
				// 2)将添加评论 接口返回的最新数据,添加到评论列表顶部
				this.commentList.unshift(dataObj.new_obj)
				// 将 底部 总的评论数加1
				this.totalCommentCount++
			},

			// 4.发布回复评论相关
			onReplyClick(comment) {
				this.currentComment = comment
				// 1. 显示评论回复弹出层
				this.isReplyShow = true
			}
		},
	};
</script>

<style scoped lang="less">
	@import "./github-markdown.css";

	.article-container {
		.main-wrap {
			position: fixed;
			left: 0;
			right: 0;
			top: 92px;
			bottom: 88px;
			overflow-y: scroll;
			background-color: #fff;
		}
		.article-detail {
			.article-title {
				font-size: 40px;
				padding: 50px 32px;
				margin: 0;
				color: #3a3a3a;
			}

			.user-info {
				padding: 0 32px;
				.avatar {
					width: 70px;
					height: 70px;
					margin-right: 17px;
				}
				.van-cell__label {
					margin-top: 0;
				}
				.user-name {
					font-size: 24px;
					color: #3a3a3a;
				}
				.publish-date {
					font-size: 23px;
					color: #b7b7b7;
				}
				.follow-btn {
					width: 170px;
					height: 58px;
				}
			}

			.article-content {
				padding: 55px 32px;
				/deep/ p {
					text-align: justify;
				}
			}
		}

		.loading-wrap {
			padding: 200px 32px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
		}

		.error-wrap {
			padding: 200px 32px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			.van-icon {
				font-size: 122px;
				color: #b4b4b4;
			}
			.text {
				font-size: 30px;
				color: #666666;
				margin: 33px 0 46px;
			}
			.retry-btn {
				width: 280px;
				height: 70px;
				line-height: 70px;
				border: 1px solid #c3c3c3;
				font-size: 30px;
				color: #666666;
			}
		}

		.article-bottom {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			justify-content: space-around;
			align-items: center;
			box-sizing: border-box;
			height: 88px;
			border-top: 1px solid #d8d8d8;
			background-color: #fff;
			.comment-btn {
				width: 282px;
				height: 46px;
				border: 2px solid #eeeeee;
				font-size: 30px;
				line-height: 46px;
				color: #a7a7a7;
			}
			.van-icon {
				font-size: 40px;
				.van-info {
					font-size: 16px;
					background-color: #e22829;
				}
			}
			// 点赞，收藏
			/deep/.btn-item {
				border: none;
				padding: 0;
				height: 40px;
				line-height: 40px;
				color: #777777;
			}
			.collect-btn--collected {
				color: #ffa500;
			}
			.like-btn--liked {
				color: #e5645f;
			}
		}
	}
</style>
