import React, { Component } from 'react';
import { FormControl, Table } from 'react-bootstrap';
import '../css/app.css';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			pageNum: 1,
			total: 0,
			articles: [],
		};
	}

	onFormChange(e) {
		this.state.value = e.target.value;
	}
	
	render() {
		const articleTableRows = this.state.articles.map((article, index) => {
			return(<ArticleTableRow key={index} num={index+1} article={article}/>);
		});
		return(
			<div id="app">
				<h1>Wikipedia Incremental Search</h1>
				<FormControl
					id="search-form"
					type="text"
					placeholder="Search by keywords"
					onChange={this.onFormChange.bind(this)}
				/>
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
			</div>
		);
	}
}

class ArticleTableRow extends Component {
	render() {
		return (
			<tr>
				<td>{this.props.num}.</td>
				<td>
					<a href={this.props.article.url} target="_blank">{this.props.article.title}</a>
					<p>{this.props.article.abstract}</p>
				</td>
			</tr>
		);
	}
}
