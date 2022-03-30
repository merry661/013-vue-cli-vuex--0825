<template>
	<!-- 更新昵称-组件 -->
	<div class="update-name">
		<!-- 导航栏 -->
		<van-nav-bar
			class="UN-nav-bar"
			title="昵称"
			left-text="取消"
			right-text="完成"
			@click-right="onConfirm"
			@click-left="$emit('close-update-name')"
		/>

		<!-- 输入框 -->
		<van-field
			v-model.trim="localName"
			rows="2"
			autosize
			type="textarea"
			maxlength="7"
			placeholder="请输入昵称"
			show-word-limit
		/>
	</div>
</template>
<script>
	import { updateUserProfile } from '@/api/user'
	export default {
		name: 'UpdateName',
		components: {
		},
		props: {
			value: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				localName: this.value//用户昵称
			}
		},
		computed: {},
		watch: {},
		created() { },
		mounted() { },
		methods: {
			// 点击完成按钮--更新用户信息
			async onConfirm() {
				// loading效果
				this.$toast.loading({
					message: '保存中...',
					forbidClick: true, // 禁止背景点击
					duration: 0 // 持续展示
				})

				// 校验当前昵称是否未空
				const localName = this.localName
				if (!localName.length) {
					this.$toast('昵称不能为空')
					return
				}
				// 调用接口，更新数据
				try {
					await updateUserProfile({
						name: localName
					})

					// 更新视图
					this.$emit('input', localName)

					// 告诉父组件，关闭弹层
					this.$emit('close-update-name')

					this.$toast.success('更新成功')
				} catch (error) {
					console.log(error)
					this.$toast.fail('更新失败')
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.update-name {
		.UN-nav-bar {
			margin-bottom: 15px;
			/deep/.van-nav-bar__text {
				color: #1989fa;
			}
		}
	}
</style>
