<template>
	<div class="login-container">
		<!-- 导航栏 -->
		<van-nav-bar class="page-nav-bar" title="登录">
			<van-icon slot="left" name="cross" @click="$router.back()" />
		</van-nav-bar>

		<!-- 登录表单 -->
		<van-form @submit="onLogin" ref="loginForm">
			<!-- 手机号 -->
			<van-field
				v-model="userInfo.mobile"
				name="mobile"
				placeholder="请输入手机号"
				:rules="userFormRules.mobile"
				type="number"
				maxlength="11"
			>
				<i slot="left-icon" class="iconfont icon-shouji login-icons"></i>
			</van-field>

			<!-- 验证码 -->
			<van-field
				v-model="userInfo.code"
				name="code"
				placeholder="请输入验证码"
				:rules="userFormRules.code"
				type="number"
				maxlength="6"
			>
				<i slot="left-icon" class="iconfont icon-yanzhengma login-icons"></i>
				<template #button>
					<!-- 倒计时 -->
					<van-count-down
						v-if="isCountDownShow"
						:time="1000 * 5"
						format="ss s"
						@finish="isCountDownShow = false"
					/>

					<van-button
						v-else
						round
						size="small"
						type="default"
						class="verification-code"
						native-type="button"
						@click="onSendSmsCode"
						>获取验证码</van-button
					>
				</template>
			</van-field>

			<!-- 提交按钮 -->
			<div style="margin: 16px">
				<van-button block type="info" native-type="submit">登录</van-button>
			</div>
		</van-form>
	</div>
</template>
<script>
	// 导入user.js
	import { login, getSmsCode } from "@/api/user.js";

	export default {
		name: "LoginIndex",
		data() {
			return {
				// 登录表单信息
				userInfo: {
					mobile: "13911111111", // 手机号
					code: "246810", // 验证码
				},

				//表单验证
				userFormRules: {
					mobile: [
						{
							required: true,
							// message:'手机号不能为空'
						},
						{
							pattern: /^1[3|5|8|7|9]\d{9}$/,
							message: "手机号格式错误",
						},
					],
					code: [
						{
							required: true,
							// message:'验证码不能为空'
						},
						{
							pattern: /^\d{6}$/,
							message: "验证码格式错误",
						},
					],
				},
				// 倒计时
				isCountDownShow: false,
			};
		},
		activated() {},
		watch: {},
		created() {},
		mounted() {},
		methods: {
			// 登录按钮注册点击事件
			async onLogin() {
				//1）获取表单数据
				const user = this.userInfo;

				//2）表单验证
				//3）提交表单，请求登录
				//4）根据请求响应结果处理后续操作
				this.$toast.loading({
					//4）提交提示效果
					message: "提交中...", //提示信息
					forbidClick: true, //禁止背景点击
					duration: 0, //展示效果的持续时间
				});

				try {
					const { data } = await login(user);

					/*登陆成功后，将后端返回的 token 相关数据存储到容器中.
					commit()调用mutation中的函数。
					参数：方法名，给方法传的参数
					*/
					this.$store.commit("setUser", data.data);
					this.$toast.success("登陆成功"); //5）成功提示效果
					// 登录成功，跳转回原来页面
					this.$router.back();
					//  this.$router.push('/home');

				} catch (err) {
					console.log(err)
					if (err.response.status === 400) {
						//6）失败提示效果
						this.$toast.fail("登录失败，手机号或验证码错误");
					} else {
						//6）失败提示效果
						this.$toast.fail("登录失败，请稍后再试");
					}
				}
			},
			// 验证码
			async onSendSmsCode() {
				// 1.校验手机号
				try {
					/*this.$refs.loginForm:得到表单组件的实例，然后调用validate方法，
									参数是带校验表单的name属性值；不传参数的话，会校验所有表单。
									*/
					await this.$refs.loginForm.validate("mobile"); //返回值是promise对象
				} catch (err) {
					return console.log("验证失败", err);
				}

				// 2.验证通过，显示倒计时
				this.isCountDownShow = "true";

				// 3.请求发送验证码
				try {
					await getSmsCode(this.userInfo.mobile);
					// 轻提示
					this.$toast("发送成功");
				} catch (err) {
					// 发送失败，关闭倒计时
					this.isCountDownShow = false;

					// 对错误码特殊处理
					if (err.response.status === "429") {
						this.$toast("发送太频繁了，请稍后重试");
					} else {
						this.$toast("发送失败，请稍后重试");
					}
				}
			},
		},
	};
</script>
<style lang="less" scoped>
	.login-container {
		.van-button--info {
			border: none;
			background-color: #6db4fa;
		}
		.login-icons {
			font-size: 37px;
		}
		.verification-code {
			background-color: #ececec;
			.van-button__text {
				color: "#656565";
			}
		}
	}
</style>
