import React, { Component } from 'react';
import { FormControl, Table, ButtonGroup, Button } from 'react-bootstrap';
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
		};
		this.getArticles('', 1, Config.RESULTS_PER_PAGE);
	}
	
	render() {
		let indexOfFirstArticle = this.getIndexOfFirstArticle(this.state.page);
		return(
			<div id="app">
				<h1 id="title">Wikipedia Incremental Search</h1>
				<div id="search-control">
					<FormControl
						id="search-form"
						type="text"
						placeholder="Search by keywords"
						onChange={this.onFormChange.bind(this)}
					/>
					<span id="counter">Showing: {indexOfFirstArticle} - {indexOfFirstArticle + Config.RESULTS_PER_PAGE - 1} / {this.state.total}</span>
					<ButtonGroup id="pagination-button-group">
						<Button onClick={this.moveToPreviousPage.bind(this)}>{'<'}</Button>
						<Button onClick={this.moveToNextPage.bind(this)}>{'>'}</Button>
					</ButtonGroup>
					<ArticleTable articles={this.state.articles}
						indexOfFirstArticle={indexOfFirstArticle}/>
				</div>
			</div>
		);
	}

	onFormChange(e) {
		this.state.keyword = e.target.value;
		this.state.page = 1;
		this.getArticles(this.state.keyword, 1, Config.RESULTS_PER_PAGE);
	}

	getIndexOfFirstArticle(page) {
		return (page - 1) * Config.RESULTS_PER_PAGE + 1;
	}

	getArticles(keyword='', page=1, RESULTS_PER_PAGE=10) {
		let params = {
			params: {
				keyword: keyword,
				page: page,
				results_per_page: RESULTS_PER_PAGE,
			}
		};
		axios.get(`${Config.API_ENDPOINT}/articles/search`, params).then((res) => {
			console.log(res)
			this.setState({
				articles: res.data.articles,
				total: res.data.total,
			});
		}).catch((err) => {
			console.log(err);
		});
	}

	moveToNextPage() {
		let lastPage = Math.ceil(this.state.total / Config.RESULTS_PER_PAGE);
		if (this.state.page + 1 <= lastPage) {
			this.state.page += 1;
			this.getArticles(this.state.keyword, this.state.page);
		}
	}

	moveToPreviousPage() {
		if (this.state.page - 1 >= 1) {
			this.state.page -= 1;
			this.getArticles(this.state.keyword, this.state.page);
		}
	}
}

class ArticleTable extends Component {
	render() {
		let articleTableRows = this.props.articles.map((article, index) => {
			return (
				<tr key={index}>
					<td>{this.props.indexOfFirstArticle+index}.</td>
					<td>
						<a href={article.url} target="_blank">{article.title}</a>
						<p>{article.abstract}</p>
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