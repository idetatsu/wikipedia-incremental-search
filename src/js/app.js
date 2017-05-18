import React, { Component } from 'react';
import { FormControl, Table, ButtonGroup, Button } from 'react-bootstrap';
import config from './config.js';
import '../css/app.css';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			pageNum: 1,
			total: 0,
			articles: [
				{
					title: "Article title",
					url: "https://google.com",
					abstract: "Lorem ipsum dolor sit amet.",
				},
				{
					title: "Article title",
					url: "https://google.com",
					abstract: "Lorem ipsum dolor sit amet.",
				},
				{
					title: "Article title",
					url: "https://google.com",
					abstract: "Lorem ipsum dolor sit amet.",
				},
				{
					title: "Article title",
					url: "https://google.com",
					abstract: "Lorem ipsum dolor sit amet.",
				},
				{
					title: "Article title",
					url: "https://google.com",
					abstract: "Lorem ipsum dolor sit amet.",
				},
			],
		};
	}

	onFormChange(e) {
		this.state.value = e.target.value;
	}
	
	render() {
		const indexOfFirstArticle = (this.state.pageNum-1) * config.resultsPerPage + 1;
		return(
			<div id="app">
				<h1>Wikipedia Incremental Search</h1>
				<FormControl
					id="search-form"
					type="text"
					placeholder="Search by keywords"
					onChange={this.onFormChange.bind(this)}
				/>
				<ButtonGroup>
					<Button>{'<'}</Button>
					<Button>{'>'}</Button>
				</ButtonGroup>
				<ArticleTable articles={this.state.articles} pageNum={this.state.pageNum} indexOfFirstArticle={indexOfFirstArticle}/>
			</div>
		);
	}
}

class ArticleTable extends Component {
	render() {
		const articleTableRows = this.props.articles.map((article, index) => {
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