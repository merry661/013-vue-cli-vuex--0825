<template>
	<!-- 搜索联想-组件 -->
	<div class="search-suggestion">
		<van-cell
			icon="search"
			v-for="(item, index) in suggestions"
			:key="index"
			@click="$emit('search', item)"
		>
			<div slot="title" v-html="highlight(item)"></div>
		</van-cell>
	</div>
</template>
<script>
	// 1.引入接口方法
	import { getSearchSuggestions } from "@/api/search";
	// 2.防抖处理
	import { debounce } from "lodash";
	export default {
		name: "SearchSuggestion",
		components: {},
		props: {
			searchTx: {
				type: String,
				required: true,
			},
		},
		data() {
			return {
				suggestions: [], // 联想建议数据列表
			};
		},
		computed: {},
		watch: {
			// 监听父组件传来的searchText
			searchTx: {
				/**
				 * debounce(),第三方防抖函数
				 * 参数1:回调函数,参数2:延迟时间，单位是毫秒
				 * 返回值：防抖之后的函数
				 * 回调函数中的参数value:是被监听的searchText
				 * **/
				handler: debounce(function (value) {
					// 加载 搜索联想 数据
					this.loadSearchSuggestions(value);
				}, 200),
				immediate: true, // immediate属性让 debounce的回调函数在侦听开始后被立即调用
			},
		},
		created() {
			// this.loadSearchSuggestions(this.searchTx);
			// this.highlight("abcd")
		},
		mounted() {},
		methods: {
			// 调用接口,获取 "搜索联想 数据"
			async loadSearchSuggestions(q) {
				try {
					const { data } = await getSearchSuggestions(q);
					this.suggestions = data.data.options;
					console.log(this.suggestions);
				} catch (error) {
					this.$toast("数据获取失败，请稍后重试");
				}
			},

			// 3.搜索关键字高亮
			// 通过正则表达式 全局匹配,使用字符串的replace(textStr,b)实现"高亮替换"
			/**
			 * 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
			 *RegExp 正则表达式构造函数
			 *  参数1：匹配模式字符串，它会根据这个字符串创建正则对象
			 *  参数2：匹配模式，要写到字符串中
			 *reg 返回符合规则的 匹配结果
			 * ***/
			highlight(textStr) {
				if (textStr) {
					// 高亮部分
					const highlightStr = `<span class="active">${this.searchTx}</span>`;
					const reg = new RegExp(this.searchTx, "gi");
					//这里: 搜索联想 数据 textStr先执行了正则匹配,然后执行了replace()方法

					// console.log(textStr);
					return textStr.replace(reg, highlightStr);
				}
			},
		},
	};
</script>

<style scoped lang="less">
	.search-suggestion {
		/deep/ span.active {
			color: #3296fa;
		}
	}
</style>
