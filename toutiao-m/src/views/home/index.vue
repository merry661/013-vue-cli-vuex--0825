<template>
	<!--首页 -->

	<div class="home-container">
		<!-- 搜索栏 -->
		<van-nav-bar class="page-nav-bar" fixed>
			<van-button
				class="search-btn"
				slot="title"
				type="info"
				size="small"
				round
				icon="search"
				to="/search"
			>
				搜索
			</van-button>
		</van-nav-bar>

		<!-- 频道列表 -->
		<van-tabs class="channel-tabs" v-model="active" animated swipeable>
			<!-- 遍历数组channelsInfor -->
			<van-tab
				v-for="channel in channelsInfor"
				:key="channel.id"
				:title="channel.name"
			>
				<!-- 子组件--文章列表 :channels="channel"父组件向子组件传值-->
				<article-list :channels="channel" />
			</van-tab>

			<!-- 占位div -->
			<div slot="nav-right" class="placeholder"></div>

			<!-- 汉堡按钮 -->
			<div slot="nav-right" class="hanburger-btn" @click="showChannelEditPopup">
				<i class="iconfont icon-gengduo"></i>
			</div>
		</van-tabs>

		<!--频道编辑弹出层popup -->
		<van-popup
			class="edit-channel-popup"
			v-model="isChannelEditShow"
			:style="{ height: '100%' }"
			position="bottom"
			closeable
			close-icon-position="top-left"
		>
			<!-- 子组件--频道编辑组件 -->
			<channel-edit
				:userChannels="channelsInfor"
				:active="active"
				@undate-active="onUpdateActive"
			/>
		</van-popup>
	</div>
</template>
<script>
	// 引入接口方法
	import { getUserChannels } from "@/api/user";
	// 引入子组件
	import ArticleList from "./components/article-list.vue";
	import ChannelEdit from "./components/channel-edit.vue";

	import { mapState } from "vuex";
	import { getItem } from "@/utils/storage";

	export default {
		name: "HomePage",
		components: {
			// 注册子组件
			ArticleList,
			ChannelEdit,
		},
		props: {},
		data() {
			return {
				active: 0,
				channelsInfor: [], // 频道列表
				isChannelEditShow: false, //控制”频道编辑弹出层的显隐“
			};
		},
		computed: {
			...mapState(["userInfo"]),
		},
		watch: {},
		created() {
			// created中调用methods中的方法
			this.loadChannels();
		},
		mounted() {},
		methods: {
			// 1.展示频道列表(只会被触发一次)
			async loadChannels() {
				try {
					// const { data } = await getUserChannels()
					// this.channels = data.data.channels
					let channels = [];

					if (this.userInfo) {
						console.log(this.userInfo);
						// 已登录，请求获取用户频道列表
						const { data } = await getUserChannels();
						channels = data.data.channels;
					} else {
						console.log("未登录");
						// 未登录，判断是否有本地的频道列表数据
						const localChannels = getItem("TOUTIAO_CHANNELS");
						//    有，拿来使用
						if (localChannels) {
							channels = localChannels;
						} else {
							//    没有，请求获取默认频道列表
							const { data } = await getUserChannels();
							channels = data.data.channels;
						}
					}
					this.channelsInfor = channels;
				} catch (err) {
					console.log(err);
					this.$toast("获取频道数据失败");
				}
			},

			// 2.显示弹出层
			showChannelEditPopup() {
				this.isChannelEditShow = true;
			},

			// 3.在父组件 中监听处理 子组件自定义事件
			// 参数:子组件传来的数据.参数1:被点击的频道的索引值,参数1:是否隐藏popup,(默认不隐藏)
			onUpdateActive(index, isChannelEditShow = true) {
				this.active = index; //更新激活频道
				this.isChannelEditShow = isChannelEditShow; // 关闭编辑频道弹层
			},
		},
	};
</script>

<style scoped lang="less">
	.home-container {
		padding-top: 174px;
		padding-bottom: 100px;
		// 搜索栏
		/deep/.van-nav-bar__title {
			max-width: unset;
		}
		.search-btn {
			width: 555px;
			height: 64px;
			background-color: #5babfb;
			border: none;
			font-size: 28px;
			.van-icon {
				font-size: 32px;
			}
		}
		// 频道列表
		/deep/.channel-tabs {
			.van-tabs__wrap {
				position: fixed;
				top: 92px;
				z-index: 1;
				left: 0;
				right: 0;
				height: 82px;
			}

			.van-tab {
				border-right: 1px solid #edeff3;
				min-width: 200px;
				font-size: 30px;
				color: #777777;
			}
			.van-tab--active {
				color: #333333;
			}
			.van-tabs__nav {
				padding-bottom: 0;
			}
			.van-tabs__line {
				width: 31px;
				height: 6px;
				background-color: #3296fa;
				bottom: 8px;
			}
			.hanburger-btn {
				position: fixed;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 66px;
				height: 82px;
				background-color: rgba(255, 255, 255, 0.902);
				i.iconfont {
					font-size: 33px;
				}
				// & 是指“当前层级的引用”，即 .hanburger-btn:before,在hanburger-btn内容的前面添加
				&:before {
					content: "";
					width: 1px;
					height: 58px;
					background-image: url(~@/assets/gradient-gray-line.png);
					background-size: contain; //背景填充效果
					position: absolute;
					left: 0;
				}
			}
			.placeholder {
				flex-shrink: 0; //不参与父元素空间的平分
				width: 66px;
				height: 82px;
			}
		}
		// 弹出层popup
		.edit-channel-popup {
			box-sizing: border-box;
			padding-top: 100px;
		}
	}
</style>
