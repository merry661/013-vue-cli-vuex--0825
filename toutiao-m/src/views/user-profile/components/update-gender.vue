<template>
	<!-- 更新性别--组件 -->
	<div class="update-gender">
		<van-picker
			show-toolbar
			:columns="columns"
			:default-index="value"
			@confirm="onConfirm"
			@cancel="$emit('close')"
			@change="onChange"
		/>
	</div>
</template>
<script>
	import { updateUserProfile } from '@/api/user'
	export default {
		name: 'UpdateGender',
		components: {
		},
		props: {
			value: {
				type: Number,
				required: true
			}
		},
		data() {
			return {
				columns: ['男', '女'],
				localGender: this.value//性别对应的数值
			}
		},
		computed: {},
		watch: {},
		created() { },
		mounted() { },
		methods: {

			// 1.点击确定按钮--更新用户信息
			async onConfirm() {
				// loading效果
				this.$toast.loading({
					message: '保存中...',
					forbidClick: true, // 禁止背景点击
					duration: 0 // 持续展示
				})

				const localGender = this.localGender
				// 调用接口，更新数据
				try {
					await updateUserProfile({
						gender: localGender
					})

					// 更新视图
					this.$emit('input', localGender)

					// 告诉父组件，关闭弹层
					this.$emit('close')

					this.$toast.success('更新成功')
				} catch (error) {
					console.log(error)
					this.$toast.fail('更新失败')
				}
			},
			// 2.当picker发生滚动改变的时候会触发change事件
			onChange(picker, value, index) {
				this.localGender = index
			},
		}
	}
</script>

<style scoped>
</style>
