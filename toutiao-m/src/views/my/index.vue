<template>
	<div class="my-container">
		<!-- 已登录头部状态 -->
		<div v-if="userInfo" class="header user-login">
			<div class="base-info">
				<div class="left">
					<van-image class="avatar" fit="cover" round :src="userInfor1.photo" />
					<span class="name">{{ userInfor1.name }}</span>
				</div>
				<div class="right">
					<van-button round size="mini" to="/user/profile">编辑资料</van-button>
				</div>
			</div>

			<!-- 数据统计 -->
			<div class="data-stats">
				<div class="data-item">
					<span class="count">{{ userInfor1.art_count }}</span>
					<span class="text">头条</span>
				</div>
				<div class="data-item">
					<span class="count">{{ userInfor1.follow_count }}</span>
					<span class="text">关注</span>
				</div>
				<div class="data-item">
					<span class="count">{{ userInfor1.fans_count }}</span>
					<span class="text">粉丝</span>
				</div>
				<div class="data-item">
					<span class="count">{{ userInfor1.like_count }}</span>
					<span class="text">获赞</span>
				</div>
			</div>
		</div>

		<!-- 未登录头部状态 -->
		<div v-else class="header not-login" @click="$router.push('/login')">
			<img src="~@/assets/mobile.png" class="mobile-img" />
			<span class="text">登录 / 注册</span>
		</div>

		<!-- 宫格导航 -->
		<van-grid :column-num="2" clickable class="grid-nav">
			<van-grid-item icon="photo-o" text="收藏" class="grid-item">
				<i slot="icon" class="iconfont icon-shoucang"></i>
			</van-grid-item>

			<van-grid-item icon="photo-o" text="历史" class="grid-item">
				<i slot="icon" class="iconfont icon-lishi"></i>
			</van-grid-item>
		</van-grid>

		<!-- 消息通知 -->
		<van-cell title="消息通知" is-link url="" />
		<!-- <van-cell title="实名认证" is-link url="" />
		<van-cell title="用户反馈" is-link url="" /> -->
		<van-cell title="小智同学" is-link url="" />
		<!-- <van-cell title="系统设置" is-link url="" /> -->

		<!-- 退出登录 -->
		<van-cell
			v-if="userInfo"
			title="退出登录"
			clickable
			class="logout-cell mt-9"
			@click="onLogout"
		/>
	</div>
</template>
<script>
	// 导入user.js
	import { getUserInfo } from "@/api/user"

	// 从store--index.js中导出user信息
	import { mapState } from "vuex"

	export default {
		name: "MyPage",
		components: {},
		props: {},
		data() {
			return {
				// 用户信息
				userInfor1: {},
			}
		},
		computed: {
			...mapState(["userInfo"]),
			// 或者
			//  ...mapState({
			//     userInfo:state => state.userInfo//使用ES6的箭头函数来给count赋值
			// })
		},
		watch: {},

		/*
			created(): 是vue的个生命周期钩子函数，在实例刚刚创建完成后被立即调用。
			每一个阶段都会有一个钩子函数，方便开发者在不同阶段处理不同逻辑.
			可以在created函数中调用ajax获取页面初始化所需的数据.
		*/
		created() {
			// 只有用户登陆后，才能成功请求加载用户信息，不然报错401
			if (this.userInfo) {
				this.loadUserInfo()
			}
		},
		mounted() { },
		methods: {
			// 获取用户信息
			async loadUserInfo() {
				try {
					const { data } = await getUserInfo()
					this.userInfor1 = data.data
				} catch (err) {
					this.$toast("获取数据失败，请重试")
				}
			},

			// 退出登录
			onLogout() {
				// 弹框--确认
				this.$dialog
					.confirm({
						title: "退出提示",
						message: "确认退出吗？",
					})
					.then(() => {
						// on confirm，清除登录状态（store中的user，及本地存储中的user）
						this.$store.commit("setUser", null)
					})
					.catch(() => {
						// on cancel
						console.log('取消执行这里')
					})
			},
		},
	};
</script>

<style scoped lang="less">
	.my-container {
		.header {
			height: 361px;
			background: url("~@/assets/banner.png") no-repeat;
			background: cover;
		}
		.not-login {
			// 子元素
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// 图片
			.mobile-img {
				width: 132px;
				height: 132px;
			}
			.text {
				color: #fff;
				font-size: 25px;
				margin-top: 25px;
			}
		}

		.user-login {
			.base-info {
				height: 231px;
				padding: 76px 32px 23px;
				box-sizing: border-box; //创建一个流式布局，而不用担心额外的边框以及内边距
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					display: flex;
					align-items: center;
					// 头像
					.avatar {
						width: 132px;
						height: 132px;
						margin-right: 23px;
						border: 4px solid #fff;
					}
					// 用户名
					.name {
						color: #fff;
						font-size: 31px;
					}
				}
			}
			// 数据统计
			.data-stats {
				display: flex;
				.data-item {
					height: 130px;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					color: #fff;
					.count {
						font-size: 36px;
					}
					.text {
						font-size: 23px;
					}
				}
			}
		}
		// 宫格导航
		.grid-nav {
			margin-bottom: 10px;
			.grid-item {
				font-size: 25px;
				line-height: 45px;
				i.iconfont {
					font-size: 45px;
				}
				i.icon-shoucang {
					color: #eb5253;
				}
				i.icon-lishi {
					color: #ffa631;
				}
				span.text {
					font-size: 28px;
				}
			}
		}

		// 退出登录
		.logout-cell {
			text-align: center;
			color: #d86262;
		}
		.mt-9 {
			margin-top: 9px;
		}
	}
</style>
