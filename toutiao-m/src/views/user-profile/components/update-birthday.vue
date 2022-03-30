<template>
	<!-- 更新生日--组件 -->
	<div class="update-birthday">
		<!--
            currentDate 双向绑定了日期选择器
              设置日期选择器的默认值
              同步日期选择器选择的日期
            min-date: 可选的最小日期
            max-date: 可选的最大日期
        -->
		<van-datetime-picker
			v-model="currentDate"
			type="date"
			title="选择年月日"
			:min-date="minDate"
			:max-date="maxDate"
			:default-index="value"
			@confirm="onConfirm"
			@cancel="$emit('close')"
		/>
	</div>
</template>
<script>
	import { updateUserProfile } from '@/api/user'
	import dayjs from 'dayjs'
	export default {
		name: 'UpdateBirthday',
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
				minDate: new Date(1970, 0, 1),
				maxDate: new Date(),
				currentDate: new Date(this.value),
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

				//console.log(this.currentDate)//Thu Nov 20 1997 00:00:00 GMT+0800 (中国标准时间)
				// 传给接口之前，要转化this.currentDate，为 格式'2018-12-20'
				
    
				// 调用接口，更新数据
				try {
                    const birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
                    
					await updateUserProfile({
						birthday: birthday
					})

					// 更新视图
					this.$emit('input', birthday)

					// 告诉父组件，关闭弹层
					this.$emit('close')

					this.$toast.success('更新成功')
				} catch (error) {
					console.log(error)
					this.$toast.fail('更新失败')
				}
			},
		}
	}
</script>

<style scoped>
</style>
