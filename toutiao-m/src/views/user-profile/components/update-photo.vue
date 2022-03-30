<template>
	<!-- 更新头像--组件 -->
	<div class="update-photo">
		<!-- 图片 -->
		<img class="updateImage" :src="imgPath" ref="updateImg" />

		<!-- 底部button -->
		<div class="toolbar">
			<div class="cancel" @click="$emit('close')">取消</div>
			<div class="confirm" @click="onConfirm">完成</div>
		</div>
	</div>
</template>
<script>
	import 'cropperjs/dist/cropper.css'
	import Cropper from 'cropperjs'
	import { updateUserPhoto } from '@/api/user'

	export default {
		name: 'UpdatePhoto',
		components: {
		},
		props: {
			imgPath: {
				type: [String, Object],
				required: true
			}
		},
		data() {
			return {}
		},
		computed: {},
		watch: {},
		created() { },
		mounted() {
			// 在mounted中处理 图片的裁剪
			const image = this.$refs.updateImg
			console.log(image)//img DOM 元素

			this.cropper = new Cropper(image, {
				viewMode: 1,
				dragMode: 'move',
				aspectRatio: 1,
				autoCropArea: 1,
				cropBoxMovable: false,
				cropBoxResizable: false,
				background: false
			})
		},
		methods: {
			// 将裁剪图片的信息提交给接口
			onConfirm() {
				//1.基于服务端的裁切使用 getData 方法获取裁切参数
				// console.log(this.cropper.getData())

				//2.纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
				this.cropper.getCroppedCanvas().toBlob((blob) => {
					this.updateUserPhoto(blob)
				})
			},
			async updateUserPhoto(blob) {
				this.$toast.loading({
					message: '保存中...',
					forbidClick: true, // 禁止背景点击
					duration: 0 // 持续展示
				})

				try {
					// 错误的用法
					// 如果接口要求 Content-Type 是 application/json
					// 则传递普通 JavaScript 对象
					// updateUserPhoto({
					//   photo: blob
					// })

					// 如果接口要求 Content-Type 是 multipart/form-data
					// 则你必须传递 FormData 对象
					const formData = new FormData()
					formData.append('photo', blob)//将blob转化为表单数据

					const { data } = await updateUserPhoto(formData)
					console.log(data)

					// 关闭弹出层
					this.$emit('close')
					// 更新视图
					this.$emit('update-photo', data.data.photo)
					// 提示成功
					this.$toast.success('更新成功')

				} catch (error) {
					console.log(error, "修改头像")
					this.$toast.fail('更新失败')
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.update-photo {
		background-color: #000;
		height: 100%;
		.toolbar {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			justify-content: space-between;
			.cancel,
			.confirm {
				width: 90px;
				height: 90px;
				font-size: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;
			}
		}
		.update-image {
			display: block;
			max-width: 100%;
		}
	}
</style>
