import React from 'react';
import Debug from 'debug'
import { IconButton, IconMenu, FontIcon } from 'material-ui';
import { Styles } from '../styles';
import GameDay from 'app/lib/gameday/index';
import { ColorMe } from 'app/common/utils';

let debug = Debug('lodge:app:common:components:boxscore'); 
	
export default class Boxscore extends React.Component {
	constructor(props) {
		super(props)
		this.displayName = 'Boxscore Component'	
		this.state = { 
			game: props.game,
			boxscore: {},
			preed: false
		};
		this.getBoxscore(props);
		
		this.pre = this.pre.bind(this);
		this.getBoxscore = this.getBoxscore.bind(this);
		
		//update bit
		this._update = true;
	}
	
	componentWillReceiveProps(props) {
		if(props.force || props.game != this.state.game) {
			debug('## componentWillReceiveProps ## Boxscore props:', props);
			this.getBoxscore(props);
			this._update = true;
			this.setState({
				game: props.game,
				boxscore: {}
			});
		}
	}
	
	shouldComponentUpdate() {
		if(this._update || this.props.force) {
			debug('## shouldComponentUpdate Boxscore ## ', this._update);
			this._update = false;
			return true;
		}
		return false;
	}
	
	getBoxscore(props) {
		GameDay.boxscore('gid_' + props.gid)
			.then(data => {
				// Array of objects with data related to a single game
				debug('#### Boxscore Data', data);
				this._update = true;
				this.setState({ boxscore: data.data.boxscore, loading: false });
				
			})
			.catch(error => console.log('ERROR from listIDs', error));
	}
	
	boxscore() {
		return (<div>
			{this.pre(this.state.boxscore)}
		</div>);		
	}
	
	pre(data) {
		debug('## pre Boxscore ## ', data);
		if(this.state.preed) {
			return (<div>
				<a onClick={e => {
					e.preventDefault();
					this._update = true;
					this.setState({ preed: false });
				}} style={{
					borderRadius: 2,
					border: '1px solid #505050',
					borderColor: ColorMe(10, snowUI.__state.theme.baseTheme.palette.canvasColor).bgcolor,
					background: ColorMe(5, snowUI.__state.theme.baseTheme.palette.canvasColor).bgcolor,
					padding: 5,
					cursor: 'hand',
					textDecoration: 'none',
					color: ColorMe(10, snowUI.__state.theme.baseTheme.palette.canvasColor).color,
				}} > Hide Boxscore Data</a>
				<pre>{JSON.stringify(data, null, 4)}</pre>
			</div>);
		} else {
			return (<div>
				<a onClick={e => {
					e.preventDefault();
					this._update = true;
					this.setState({ preed: true });
				}} style={{
					borderRadius: 2,
					border: '1px solid #505050',
					borderColor: ColorMe(10, snowUI.__state.theme.baseTheme.palette.canvasColor).bgcolor,
					background: ColorMe(5, snowUI.__state.theme.baseTheme.palette.canvasColor).bgcolor,
					padding: 5,
					cursor: 'hand',
					textDecoration: 'none',
					color: ColorMe(10, snowUI.__state.theme.baseTheme.palette.canvasColor).color,
				}} > Show Boxscore Data</a>
			</div>);
		}
	}
	
	render() {
		debug('## RENDER ## Boxscore',  this.state, this.props);
						
		let board = this.boxscore();
		
		return (<div >
			<div className="boxscore">{board}</div>
		</div>);
	}
}

Boxscore.propTypes = {
	game: React.PropTypes.string
};

Boxscore.defaultProps = {
	game: false
};
