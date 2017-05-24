import React, { Component } from 'react';
import { FormControl, Table, ButtonGroup, Col,
	Button, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';

import * as Config from './config';
import '../css/app.css';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			keyword: '',
			page: 1,
			total: 0,
			articles: [],
			searches: [],
			updateSearchesIntervalId: null,
			createSearchTimeoutId: null,
		};
	}

	componentDidMount() {
		// asynchronous data fetching.
		this.searchArticles('', 1, Config.RESULTS_PER_PAGE);
		this.updateSearches();
		// activate polling.
		const intervalId = setInterval(this.updateSearches.bind(this), Config.UPDATE_SEARCHES_INTERVAL * 1000);
		this.setState({
			updateSearchesIntervalId: intervalId,
		});
	}

	componentWillUnmount() {
		// clear polling.
		clearInterval(this.state.updateSearchesIntervalId);
	}
	
	render() {
		const firstArticleIndex = (this.state.page - 1) * Config.RESULTS_PER_PAGE + 1;
		const lastArticleIndex = Math.min(firstArticleIndex + Config.RESULTS_PER_PAGE - 1, this.state.total);
		return(
			<div id="app">
				<Col sm={12} md={12} lg={12}>
					<h1 id="title">Wikipedia Incremental Search</h1>
				</Col>
				<Col sm={12} md={8} lg={8}>
					<div id="search-control">
						<FormControl
							id="search-form"
							value={this.state.keyword}
							type="text"
							placeholder="Search by keywords"
							onChange={this.onFormChange.bind(this)}
						/>
						<span id="counter">Showing: {firstArticleIndex} - {lastArticleIndex} / {this.state.total}</span>
						<ButtonGroup id="pagination-button-group">
							<Button onClick={this.goToPreviousPage.bind(this)}
								disabled={this.isAtFirstPage()}>{'<'}</Button>
							<Button onClick={this.goToNextPage.bind(this)}
								disabled={this.isAtLastPage()}>{'>'}</Button>
						</ButtonGroup>
						<ArticleTable articles={this.state.articles}
							firstArticleIndex={firstArticleIndex}/>
					</div>
				</Col>
				<Col sm={12} md={4} lg={4}>
					<SearchHistoryPanel searches={this.state.searches}
						onSearchHistoryClick={this.handleSearchHistoryClick.bind(this)}/>
				</Col>
				<Col sm={12} md={12} lg={12}>
					<hr />
					<span id="footer">Wikipedia Incremental Search</span>
				</Col>
			</div>
		);
	}

	onFormChange(e) {
		this.state.keyword = e.target.value;
		this.state.page = 1;

		if (this.state.createSearchTimeoutId != null) {
			clearTimeout(this.state.createSearchTimeoutId);
		}
		// If the keyword is not empty, set timeout for createSearch function.
		if (this.state.keyword != '') {
			const timeoutId = setTimeout(() => {
				this.createSearch(this.state.keyword);
			}, Config.CREATE_SEARCH_WAIT_THRESHOLD * 1000);
			this.setState({
				createSearchTimeoutId: timeoutId,
			});
		}

		this.searchArticles(this.state.keyword, 1, Config.RESULTS_PER_PAGE);
	}

	isAtFirstPage() {
		if (this.state.page == 1) {
			return true;
		}else{
			return false;
		}
	}

	isAtLastPage() {
		if (this.state.page * Config.RESULTS_PER_PAGE >= this.state.total) {
			return true;
		}else{
			return false;
		}
	}

	goToNextPage() {
		if (!this.isAtLastPage()) {
			this.state.page += 1;
			this.searchArticles(this.state.keyword, this.state.page);
		}
	}

	goToPreviousPage() {
		if (!this.isAtFirstPage()) {
			this.state.page -= 1;
			this.searchArticles(this.state.keyword, this.state.page);
		}
	}

	handleSearchHistoryClick(keyword) {
		this.searchArticles(keyword, 1, Config.RESULTS_PER_PAGE);
		this.createSearch(keyword);
	}

	searchArticles(keyword='', page=1, resultsPerPage=10) {
		const params = {
			params: {
				keyword: keyword,
				page: page,
				results_per_page: resultsPerPage,
			}
		};
		axios.get(`${Config.API_ENDPOINT}/articles/search`, params).then((res) => {
			console.log(res)
			this.setState({
				articles: res.data.articles,
				total: res.data.total,
				page: page,
				keyword: keyword,
			});
		}).catch((err) => {
			console.log(err);
		});
	}

	createSearch(keyword) {
		const params = {
			search: {
				keyword: keyword
			}
		};
		axios.post(`${Config.API_ENDPOINT}/searches`, params).then((res) => {
			// Successfully created a new search.
		}).catch((err) => {
			console.log(err);
		});
	}

	updateSearches() {
		axios.get(`${Config.API_ENDPOINT}/searches/latest`).then((res) => {
			console.log(res);
			this.setState({
				searches: res.data,
			});
		}).catch((err) => {
			console.log(err);
		});
	}
}

class SearchHistoryPanel extends Component {
	render() {
		const listGrounpItems = this.props.searches.map((search, index) => {
			return (
				<ListGroupItem key={index} onClick={() => {this.props.onSearchHistoryClick(search.keyword, 1);} }>
					{search.keyword} {search.frequency}
				</ListGroupItem>
			);
		});
		return(
			<div id="search-history-panel">
				<Panel header="Search History" bsStyle="primary">
					<ListGroup fill>
						{listGrounpItems}
					</ListGroup>
				</Panel>
			</div>
		);
	}
}

class ArticleTable extends Component {
	render() {
		const articleTableRows = this.props.articles.map((article, index) => {
			return (
				<tr key={index}>
					<td>{this.props.firstArticleIndex+index}.</td>
					<td>
						<a href={article.url} target="_blank" dangerouslySetInnerHTML={{__html: article.title}}/>
						<p dangerouslySetInnerHTML={{__html: article.abstract}}/>
					</td>
				</tr>
			);
		});

		return (
			<Table id="result-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Article</th>
					</tr>
				</thead>
				<tbody>
					{articleTableRows}
				</tbody>
			</Table>
		);
	}
}