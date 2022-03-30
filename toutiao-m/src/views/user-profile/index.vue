<template>
	<!-- 个人信息模块 -->
	<div class="user-profile">
		<!-- 导航栏 -->
		<van-nav-bar
			class="page-nav-bar"
			title="个人信息"
			right-text="保存"
			left-arrow
			@click-left="$router.back()"
		/>

		<!-- 个人信息 -->
		<van-cell-group>
			<!-- file类型的input 可以用来选取图片 -->
			<input type="file" hidden ref="userPhotoFile" @change="onFileChange" />
			<!-- @click="$$refs.file.click() 当点击<van-image的时候，
				实际触发file类型的input 的click事件-->
			<van-cell
				title="头像"
				center
				is-link
				@click="$refs.userPhotoFile.click()"
			>
				<van-image class="avator" round fit="cover" :src="userProfile.photo" />
			</van-cell>

			<van-cell
				title="昵称"
				is-link
				:value="userProfile.name"
				@click="isUpdateNameShow = true"
			/>

			<van-cell
				title="性别"
				is-link
				:value="userProfile.gender === 0 ? '男' : '女'"
				@click="isUpdateGenderShow = true"
			/>
			<van-cell
				title="生日"
				is-link
				:value="userProfile.birthday"
				@click="isUpdateBirthdayShow = true"
			/>
		</van-cell-group>

		<!-- 编辑个人资料 -->
		<!-- 编辑昵称 -->
		<van-popup
			v-model="isUpdateNameShow"
			position="bottom"
			style="height: 100%"
		>
			<update-name
				v-if="isUpdateNameShow"
				@close-update-name="isUpdateNameShow = false"
				v-model="userProfile.name"
			></update-name>
		</van-popup>

		<!-- 编辑性别 -->
		<van-popup
			v-model="isUpdateGenderShow"
			position="bottom"
			style="height: 40%"
		>
			<update-gender
				v-if="isUpdateGenderShow"
				@close="isUpdateGenderShow = false"
				v-model="userProfile.gender"
			></update-gender>
		</van-popup>

		<!-- 编辑生日-->
		<van-popup
			v-model="isUpdateBirthdayShow"
			position="bottom"
			style="height: 40%"
		>
			<update-birthday
				v-if="isUpdateBirthdayShow"
				@close="isUpdateBirthdayShow = false"
				v-model="userProfile.birthday"
			></update-birthday>
		</van-popup>

		<!-- 编辑头像-->
		<van-popup
			v-model="isUpdatePhotoShow"
			position="bottom"
			style="height: 100%"
		>
			<update-photo
				v-if="isUpdatePhotoShow"
				@close="isUpdatePhotoShow = false"
				:imgPath="img"
				@update-photo="userProfile.photo = $event"
			></update-photo>
		</van-popup>
	</div>
</template>
<script>
	import { getUserProfile } from '@/api/user'
	import UpdateName from './components/update-name.vue'
	import UpdateGender from './components/update-gender.vue'
	import UpdateBirthday from './components/update-birthday.vue'
	import UpdatePhoto from './components/update-photo.vue'

	export default {
		name: 'UserProfile',
		components: {
			UpdateName,
			UpdateGender,
			UpdateBirthday,
			UpdatePhoto
		},
		props: {},
		data() {
			return {
				userProfile: {},
				isUpdateNameShow: false,//是否显示更新昵称popup
				isUpdateGenderShow: false,//是否显示更新性别popup
				isUpdateBirthdayShow: false,//是否显示更新生日popup
				isUpdatePhotoShow: false,//是否显示更新头像popup
				img: null // 裁剪时 预览的图片
			}
		},
		computed: {},
		watch: {},
		created() {
			this.loadUserInfo()
		},
		mounted() { },
		methods: {
			async loadUserInfo() {
				try {
					const { data } = await getUserProfile()
					this.userProfile = data.data
					console.log(this.userProfile)
				} catch (error) {
					console.log(error)
					this.$toast.fail('获取用户信息失败，请重试')
				}
			},

			// 点击头像，触发file类型的inut,当选择图片文件的时候触发inout的change事件
			// 作用：获取文件对象，获得图片的地址
			onFileChange() {
				// 1.获取通过input选择的 文件对象
				const file = this.$refs.userPhotoFile.files[0]

				// console.log(file, "文件")

				// 2. 基于文件对象获取 它的 blob 数据
				this.img = window.URL.createObjectURL(file)
				// console.log(this.img,"图片")
				//输出结果为：  blob:http://localhost:8080/c88d99de-66a4-4116-9e05-b6719718db2f

				// 3.展示 预览图片弹出层
				this.isUpdatePhotoShow = true

				// 4.file-input 如果选了同一个文件不会触发 change 事件
				// 解决办法就是每次使用完毕，把它的 value 清空
				this.$refs.userPhotoFile.value = ''
			}
		}
	}
</script>

<style scoped lang="less">
	.user-profile {
		/deep/.van-nav-bar__text {
			color: #fff;
		}
		.avator {
			width: 55px;
			height: 55px;
		}
		.van-popup {
			background-color: #f5f7f9;
		}
	}
</style>
