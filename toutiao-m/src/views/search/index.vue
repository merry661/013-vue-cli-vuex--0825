<template>
	<!-- 搜索页面 -->
	<div class="search-container">
		<!-- 搜索栏: 在 van-search 外层增加 form 标签，
        且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
		<form action="/" class="search-form">
			<van-search
				v-model="searchText"
				show-action
				placeholder="请输入搜索关键词"
				@search="onSearch"
				@cancel="onCancel"
				@focus="isResultShow = false"
				background="#3296fa"
			/>
		</form>
		<!-- 三个子组件的显示规则:
        1)搜索结果,当 "onSearch()函数被触发" 时,显示该组件;(isResultShow=true)
        2)搜索历史记录,当 "输入框获得焦点,且没有任何内容" 时,显示该组件;(onfocus() && isResultShow=false && searchText=" ")
        3)联想建议,当"输入框获得焦点,且有内容"时,显示该组件;(onfocus() && isResultShow=false && searchText !="")
        -->

		<!-- 搜索结果-->
		<search-result v-if="isResultShow" :searchTx="searchText" />
		<!-- 联想建议 -->
		<search-suggestion
			v-else-if="searchText"
			:searchTx="searchText"
			@search="onSearch"
		/>
		<!-- 搜索历史记录 -->
		<search-history
			v-else
			:searchHistories="searchHistories"
			@clearSearchHistory="searchHistories = []"
			@search="onSearch"
		/>
	</div>
</template>
<script>
	// 引入子组件
	import SearchHistory from "./components/search-history.vue";
	import SearchResult from "./components/search-result.vue";
	import SearchSuggestion from "./components/search-suggestion.vue";

	// 引入utils中的工具函数
	import { setItem, getItem } from "@/utils/storage";

	export default {
		name: "SearchPage",
		components: {
			SearchResult,
			SearchHistory,
			SearchSuggestion,
		},
		props: {},
		data() {
			return {
				searchText: "", //输入框的输入内容
				isResultShow: false, //控制搜索结果的显示
				searchHistories: getItem("TOUTIAO_SEARCH_HISTORIES") || [], // 搜索的历史记录数据
			};
		},
		computed: {},
		watch: {
			//1 .数据持久化
			// 利用 watch 监视统一存储数据:如果搜索记录数据有变化,将新的value覆盖存储到loacalStorage中
			//在onSearch()中为searchHistories赋值
			searchHistories(value) {
				// console.log(value,"参数就是searchHistories数组自己");
				setItem("TOUTIAO_SEARCH_HISTORIES", value);
			},
		},
		created() {},
		mounted() {},
		methods: {
			// 当点击"回车键"或"手机端搜索按钮"时,触发onSearch()方法
			// 参数:搜索框中 用户输入的文字
			onSearch(val) {
				//1. 更新文本框内容
				this.searchText = val;

				// 2.存储搜索历史记录,(不要有重复历史记录、最新的排在最前面)
				/**
				 * searchHistories,初始值为[],
				 * 判断该数组是否包含"文本框输入值",
				 * 包含,说明重复,删除 那个旧有重复项;
				 * 不包含,将val添加到数组的最前面
				 * ***/
				const index = this.searchHistories.indexOf(val);
				if (index !== -1) {
					this.searchHistories.splice(index, 1);
				}
				this.searchHistories.unshift(val); //添加历史记录

				//3. 渲染搜索结果
				this.isResultShow = true;
			},

			// 点击取消按钮
			onCancel() {
				this.$router.back();
			},
		},
	};
</script>

<style scoped lang="less">
	.search-container {
		padding-top: 112px;
		.search-form {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: 3;
			.van-search__action {
				color: #fff;
			}
		}
	}
</style>
