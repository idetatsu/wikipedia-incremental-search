import React, { Component } from 'react';
import { FormControl, Table, ButtonGroup, Button } from 'react-bootstrap';
import axios from 'axios';

import config from './config.js';
import '../css/app.css';

export default class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			keyword: '',
			pageNum: 1,
			total: 0,
			allResults: [],
			shownResults: [],
		};

		axios.get(`${config.apiEndpoint}/articles`).then((res) => {
			this.setAllResults(res.data);
			this.updateShownPage(1);
		}).catch((err) => {
			console.log(err);
		});
	}
	
	render() {
		let indexOfFirstArticle = this.getIndexOfFirstArticle(this.state.pageNum);
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
					<span id="counter">Showing: {indexOfFirstArticle} - {indexOfFirstArticle + config.resultsPerPage - 1} / {this.state.total}</span>
					<ButtonGroup id="pagination-button-group">
						<Button onClick={this.moveToPreviousPage.bind(this)}>{'<'}</Button>
						<Button onClick={this.moveToNextPage.bind(this)}>{'>'}</Button>
					</ButtonGroup>
					<ArticleTable articles={this.state.shownResults} pageNum={this.state.pageNum}
						indexOfFirstArticle={indexOfFirstArticle} keywordToHighlight={this.state.keyword}/>
				</div>
			</div>
		);
	}

	onFormChange(e) {
		this.state.keyword = e.target.value;
		axios.get(`${config.apiEndpoint}/articles/search`,
			{params: {keyword: this.state.keyword}}).then((res) => {
			this.setAllResults(res.data);
			this.updateShownPage(1);			
		}).catch((err) => {
			console.log(err);
		});
	}

	getIndexOfFirstArticle(pageNum) {
		return (pageNum - 1) * config.resultsPerPage + 1;
	}

	getResultsForCurrentPage(pageNum) {
		let indexOfFirstArticle = this.getIndexOfFirstArticle(pageNum);
		return this.state.allResults.slice(indexOfFirstArticle, indexOfFirstArticle + config.resultsPerPage);
	}

	setAllResults(allResults) {
		this.state.allResults = allResults;
		this.state.total = allResults.length;
	}

	updateShownPage(pageNum) {
		this.setState({
			pageNum: pageNum,
			shownResults: this.getResultsForCurrentPage(pageNum),
		});
	}

	moveToNextPage() {
		let lastPage = Math.ceil(this.state.total / config.resultsPerPage);
		if (this.state.pageNum + 1 <= lastPage) {
			this.updateShownPage(this.state.pageNum+1);
		}
	}

	moveToPreviousPage() {
		if (this.state.pageNum - 1 >= 1) {
			this.updateShownPage(this.state.pageNum-1);
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