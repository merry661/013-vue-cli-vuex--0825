<template>
	<!-- 频道编辑组件 -->
	<div class="channel-edit">
		<!-- 我的频道 -->
		<van-cell class="title" title="我的频道">
			<!-- 编辑按钮 -->
			<van-button
				class="edit-btn"
				type="danger"
				size="mini"
				round
				plain
				@click="isEdit = !isEdit"
				>{{ isEdit ? "完成" : "编辑" }}</van-button
			>
		</van-cell>

		<!-- item项目:渲染 userChannels -->
		<van-grid class="my-grid" :gutter="10">
			<van-grid-item
				class="grid-item"
				v-for="(channelItem, index) in userChannels"
				:key="index"
				@click="onUserChannelClick(channelItem, index)"
			>
				<!-- 如果当前channel项的索引=父组件传进来的active值,则class="activeChannel" -->
				<!-- 文字 -->
				<span
					slot="text"
					class="text01"
					:class="{ activeChannel: index === active }"
					>{{ channelItem.name }}</span
				>

				<!-- 关闭按钮 -->
				<van-icon
					v-show="isEdit && !fiexdChannels.includes(channelItem.id)"
					slot="icon"
					name="close"
				/>
			</van-grid-item>
		</van-grid>

		<!-- 频道推荐 -->
		<van-cell class="title" title="频道推荐" />

		<!-- item项目:渲染 推荐频道 (= allChannels 减去 userChannels) -->
		<van-grid class="recommend-grid" :gutter="10">
			<van-grid-item
				class="grid-item"
				v-for="(recommendChannel, index) in recommendChannels"
				:key="index"
				icon="plus"
				:text="recommendChannel.name"
				@click="onAddChannels(recommendChannel)"
			/>
		</van-grid>
	</div>
</template>
<script>
	// 导入接口请求
	import {
		getAllChannels,
		addUserChannels,
		deleteUserChannel,
	} from "@/api/channels";

	// 引入vuex的mapState
	import { mapState } from "vuex";

	// 引入公共工具setItem
	import { setItem } from "@/utils/storage";

	export default {
		name: "ChannelEdit",
		components: {},
		props: {
			userChannels: {
				//用户频道数据
				type: Array,
				required: true,
			},
			active: {
				//当前父组件tab项 被选中的那一项
				type: Number,
				required: true,
			},
		},
		data() {
			return {
				allChannels: [], // 所有频道
				isEdit: false, //控制编辑状态(关闭按钮)的显示
				fiexdChannels: [0], // 固定频道，不允许删除
			};
		},
		computed: {
			//计算属性:推荐频道channels = allChannels 减去 userChannels
			//依赖监听--实时变化
			recommendChannels() {
				// recommendChannels()方法的返回值
				return this.allChannels.filter((channel) => {
					// filter:符合条件的元素存储到新数组中并返回
					return !this.userChannels.find((item) => {
						// find返回 符合条件的第1个元素,(筛出:allChannels数据中等于userChannels的项)
						return item.id === channel.id;
					});
				});
			},
			...mapState(["userInfo"]),
		},
		watch: {},
		created() {
			this.loadAllChannels();
		},
		mounted() {},
		methods: {
			//1. 加载"所有频道信息"
			async loadAllChannels() {
				try {
					const { data } = await getAllChannels();
					this.allChannels = data.data.channels;
				} catch (error) {
					this.$toast("频道信息获取失败");
				}
			},

			// 2.点击"推荐频道" 项, 向"我的频道"添加数据
			/**
			 * 推荐频道 通过"计算属性"获取,只要"我的频道"中的数据发生变化，
			 * 计算属性就会重新运算,获取最新数据
			 * 频道编辑:无论是否登录,用户都可进行编辑(add,delete)
			 * 所以要-------------- 数据持久化处理:
			 *
			 * 1)未登录:数据存储在本地,不支持同步功能
			 * 2)已登录:数据存储在线上后台服务器,不同设备可同步数据
			 * **/
			async onAddChannels(reChannel) {
				this.userChannels.push(reChannel);
				// 1.数据持久化处理--添加操作
				if (this.userInfo) {
					//已登录,调用接口
					try {
						await addUserChannels({
							id: reChannel.id, // 频道ID
							seq: this.userChannels.length, // 序号
						});
					} catch (error) {
                        console.log(error)
						this.$toast("保存失败,请重试!");
					}
				} else {
					//未登录,存在loacalStorage里
					setItem("TOUTIAO_CHANNELS", this.userChannels);
				}
			},

			// 3.点击"我的频道" 项,从"我的频道"删除项
			// 或 跳转到该项tab页
			onUserChannelClick(userChannelItem, index) {
				if (this.isEdit) {
					// 编辑状态
					// 1) "我的频道"中的固定频道,不做删除
					if (this.fiexdChannels.includes(userChannelItem.id)) {
						return;
					}

					// 2) 编辑状态，执行删除频道操作
					this.userChannels.splice(index, 1);
					// 数据持久化处理--删除操作
					//参数:当前被点击的 频道项
					this.deleteUChannel(userChannelItem);

					//3) "被点击项"的索引 < 当前"被激活项"的索引,重新更新激活的频道项
					if (index <= this.active) {
						// 参数1：要删除的元素的开始索引（包括）
						// 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
						this.$emit("undate-active", this.active - 1, true);
					}
				} else {
					// 4) 非编辑状态，执行切换频道操作
					//首页的Tab项,由active控制,子组件修改父组件字段值
					this.$emit("undate-active", index, false);
				}
			},

			// 4. 数据持久化处理---封装删除频道 功能
			async deleteUChannel(userChannelItem) {
				try {
					if (this.userInfo) {
						// 已登录，则将数据更新到线上
						await deleteUserChannel(userChannelItem.id);
					} else {
						// 未登录，将数据更新到本地
						console.log("未登录删除");
						setItem("TOUTIAO_CHANNELS", this.userChannels);
					}
				} catch (error) {
                    console.log(error)
					this.$toast("操作失败,请稍后重试!");
				}
			},
		},
	};
</script>

<style scoped lang="less">
	.channel-edit {
		// 标题
		.title {
			font-size: 32px;
			color: #333333;
		}
		// 编辑按钮
		.edit-btn {
			width: 104px;
			height: 48px;
			font-size: 26px;
			color: #f85959;
			border: 1px solid #f85959;
		}

		// item项
		/deep/.grid-item {
			width: 160px;
			height: 86px;
			.van-grid-item__content {
				white-space: nowrap; // 不允许文字换行
				background-color: #f3f5f5;
				.van-grid-item__text,
				.text01 {
					font-size: 28px;
					color: #222;
					margin-top: unset;
				}
			}
		}

		// 关闭按钮
		.my-grid {
			.van-icon-close {
				position: absolute;
				top: -35px;
				right: -93px;
				font-size: 30px;
				color: #cacaca;
				z-index: 3;
			}
			.activeChannel {
				color: red !important;
			}
		}
		// 频道推荐
		/deep/.recommend-grid {
			.grid-item {
				.van-grid-item__content {
					flex-direction: row;
					.van-icon-plus {
						font-size: 28px;
						margin-right: 6px;
					}
				}
			}
		}
	}
</style>
