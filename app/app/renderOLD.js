import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Path from 'path';
import wrapListeners from './listen';
import Debug from 'debug';
import Menu from './common/components/menu';
import Confirm from './common/components/confirm';
import routes from './routes';
import { Card, CardText, FontIcon, IconMenu, IconButton, AppBar, RaisedButton, LeftNav, MenuItem, Divider, List, ListItem } from 'material-ui';
import { Styles } from './common/styles';
import { defaultsDeep as deep } from 'lodash';

let debug = Debug('lodge:app:render');
debug('STYLES',Styles);
var merge = Object.assign;

var styles = {
	'cream': Styles.getMuiTheme(deep(Styles.CREAM,  snowUI.materialStyle.cream)),
	'blue': Styles.getMuiTheme(deep(Styles.BLUE,  snowUI.materialStyle.blue)),
	'dark': Styles.getMuiTheme(deep(Styles.DARK, snowUI.materialStyle.dark)),
	'default': Styles.getMuiTheme(deep(Styles.DEFAULT, snowUI.materialStyle.default )),
	'graphite': Styles.getMuiTheme(deep(Styles.GRAPHITE,  snowUI.materialStyle.graphite)),
	'light': Styles.getMuiTheme(deep(Styles.LIGHT,  snowUI.materialStyle.light)),
	'night': Styles.getMuiTheme(deep(Styles.NIGHT, snowUI.materialStyle.night)),
}

class Render extends Component {
	constructor(props) {
		// we get props from Listener
		super(props);
		
		this.displayName = 'Render';
		
		this._defaults = {
			leftNav: false,
			newalert: {},
			newconfirm: {
				open: false
			},
		}
		
		var state = Object.assign({
			currentTheme: snowUI.materialTheme,
			theme: styles[snowUI.materialTheme] || styles.blue,
			styles
		}, { ...this._defaults });
		this.state = Object.assign(state, props);
		
		debug('fresh state', this.state);
		
		this.handleLeftNav = this.handleLeftNav.bind(this);
		this.LeftNavClose = this.LeftNavClose.bind(this);
		this.goTo = this.goTo.bind(this);
		this.appState = this.appState.bind(this);
		this.answerConfirm = this.answerConfirm.bind(this);
		this.switchTheme = this.switchTheme.bind(this);
		this.searchToggle = this.searchToggle.bind(this);
		
		this.isConnectedIcon = this.isConnectedIcon.bind(this);
		this.confirmer = this.confirmer.bind(this);
		this.appBar = this.appBar.bind(this);
		this.appBarRightIcons = this.appBarRightIcons.bind(this);
	}
	
	componentDidMount() {
		this.switchTheme(this.props.currentTheme, false);
	}
	
	componentWillReceiveProps(props) {
		// update from listener
		var p = { ...props };
		debug('render props', p);
		this.setState(p);	
	}
	
	componentWillUnmount() {
		
	}
	
	switchTheme(theme = 'blue', update = true) {
		let style = this.state.styles[theme];
		if(!style) {
			style = this.state.styles.blue;
		} 
		if( theme == 'dark' ) {
			snowUI.setTheme('dark-theme');
			snowUI.shortenTitle = false;
		} else if( theme == 'graphite' ) {
			snowUI.setTheme('dark-theme graphite');
			snowUI.shortenTitle = true;
		} else if( theme == 'night' ) {
			snowUI.setTheme('dark-theme default');
			snowUI.shortenTitle = false;
		} else if( theme == 'default' ) {
			snowUI.setTheme('');
			snowUI.shortenTitle = false;
		} else if( theme == 'cream'  ) {
			snowUI.setTheme('');
			snowUI.shortenTitle = true;
		} else if( theme == 'light' ) {
			snowUI.setTheme('light-theme theme-light ');
			snowUI.shortenTitle = true;
		} else {
			snowUI.setTheme('light-theme blue');
			snowUI.shortenTitle = false;
		}
		if(update) {
			this.appState({
				theme: style,
				currentTheme: theme,
				forceUpdate: true
			}, function() {
			});
		}
	}
	
	getChildContext() {
		return {
			muiTheme: this.state.theme,
		};
	}
	
	handleLeftNav(e) {
		if(e && typeof e.preventDefault === 'function') {
			e.preventDefault();
		}
		debug('handleLeftNav', this.state);
		this.appState({leftNav: !this.state.leftNav});
	} 
	
	LeftNavClose () {
		this.appState({ leftNav: false });
	}
	
	searchToggle(e) { 
		let target = $(e.target).parent().prev();
		target.toggleClass('open');
		debug('searchToggle', target);
		let $input = target.find('input');
		$input.val('');
		$input.focus();
		$input.keypress((event) => {
			// keyboard Enter event
			if ( event.which == 13 ) {
				event.preventDefault();
				let state = {
					page: 'search::' + $input.val(),
					search:  $input.val()
				}
				
				this.appState(Object.assign({ ...this._defaults }, state), () => {
					this.state.history.push({
						pathname: 'search::',
						search: $input.val(),
					})
				});
			}
			
		});
	}
	
	goTo(state) {
		
		if(typeof state === 'string') {
			// accept strings for the page
			state = {
				page: state,
			}
		}
		
		debug('goTo state', state)
		
		// fade the content div before its replaced
		snowUI.fadeOut('slow', () => {
			var send = Object.assign({ 
				mode: 'cors',
				leftNav: false,
				currentTheme: this.state.currentTheme,
				theme: this.state.theme
			}, state);
			
			if(!send.path && send.page) {
				send.path = '/' + send.page;
			}
			if(send.slug) {
				send.path += '/' + send.slug;
			}
			
			if(!send.path) {
				send.path = '/500';
				send.error = 'Invalid page configuration';
				send.page = '500';
				send.FontIcon = {
					icon: 'help',
					Color: 'blue',
					HoverColor: 'cyan',
				};
				send.message = 'Bad Request';
			}
			
			debug('sendto', send);
			this.props.router.push({
				pathname: send.path,
				query: send.query,
				state: send
			});
			
		});
		
	}
	
	appState(newState, callback) {
		this.props.appState(newState, callback);
	}
	
	dismissConfirm() {
		this.appState({ 
			newconfirm: {
				show: false
			}
		});
	}
	
	answerConfirm(success) {
		if(success) {
			if(typeof this.state.newconfirm.answer === 'function') {
				this.state.newconfirm.answer(this.state.answerConfirm);
			} else if(typeof this[this.state.answerMethod] === 'function') {
				this[this.state.answerMethod](this.state.answerConfirm);
			}
		}
		this.appState({
			newconfirm: {
				open: false,
			},
			answerConfirm: false
		});
		
	}
	
	appBarRightIcons() {
		return (<span>
						
			<span style={{ cursor: 'pointer' }}>
				<IconMenu
					iconButtonElement={<FontIcon className="material-icons" hoverColor={Styles.Colors.lightBlueA700} color={this.state.theme.appBar.buttonColor || 'initial'} >invert_colors</FontIcon>}
					onItemTouchTap={(e, val) => {
						debug(e, val);
						if(val.props.value === 'boot') {
							return location.href = snowUI.path.bootstrap;
						}
						this.switchTheme(val.props.value);
						
					}}
				>
				  <MenuItem primaryText="mui default" value="default" />
				  <MenuItem primaryText="Cream" value="cream"/>
				  <MenuItem primaryText="Light" value="light" />
				  <MenuItem primaryText="Blue" value="blue"/>
				  <MenuItem primaryText="Graphite" value="graphite"/>
				  <MenuItem primaryText="Night" value="night"/>
				  <MenuItem primaryText="Dark (mui default)" value="dark" />
				</IconMenu>
			</span>
			
			{this.isConnectedIcon()}
			
			<IconButton onClick={this.handleLeftNav} ><FontIcon className="material-icons" hoverColor={Styles.Colors.lightBlueA700} color={this.state.theme.appBar.buttonColor || 'initial'}>menu</FontIcon></IconButton>
			
			<div style={{width:20,height:20,display:'inline-block'}} />
		</span>			
		);
	} 
	
	appBar() {
		
		let title = this.state.page;
		
		let appBarRightIcons = this.appBarRightIcons();
		
		return (<div id="appbar"> 
			<div style={{zIndex:1101, width: '100%', height: '64px' ,position: 'fixed', }} >
				<AppBar
					title={<div id="appbarTitle" >{title}</div>}
					iconElementRight={appBarRightIcons}
					style={{boxShadow: 'none'}}
					iconElementLeft={<span><IconButton onClick={(e)=>{e.preventDefault();this.goTo(snowUI.homepage);}} ><FontIcon className="material-icons" hoverColor={Styles.Colors.lightBlueA700} color={this.state.theme.appBar.buttonColor || 'initial'} >home</FontIcon></IconButton></span>}
				/>
			</div>
			<div style={{height:65,width:'100%'}} />
		</div>);
		
		
	}
	
	isConnectedIcon() {
		let isConnectedIcon = ( this.state.connected === true || !snowUI.usesockets )
			? 
				<IconButton onClick={(e)=>{e.preventDefault();this.goTo('status');}} ><FontIcon className="material-icons" hoverColor={Styles.Colors.lime500} style={{fontSize:'20px'}}  color={this.state.theme.appBar.buttonColor || 'initial'} >speaker_phone</FontIcon></IconButton>
			:
				(this.props.sockets.connected.firstRun) 
				?
					<span><IconButton onClick={(e)=>{e.preventDefault();this.goTo('status');}} ><FontIcon className="material-icons" style={{fontSize:'20px'}} color={Styles.Colors.lime500}  title="Connecting to server for the first time">speaker_phone</FontIcon></IconButton></span>
				:
					<span><IconButton onClick={(e)=>{e.preventDefault();this.goTo('status');}} ><FontIcon className="material-icons" style={{fontSize:'20px', backgroundColor: Styles.Colors.red900}} color={Styles.Colors.red900}  title="Connection to server lost">cloud_offline</FontIcon></IconButton></span>
		return isConnectedIcon;
		
	}
	
	confirmer() {
		return (
			<Confirm 
				html={this.state.newconfirm.html}
				title={this.state.newconfirm.title}
				answer={this.answerConfirm}
				open={this.state.newconfirm.open}
				yesText={this.state.newconfirm.yesText}
				noText={this.state.newconfirm.noText}
				theme={this.state.theme}
			/>
		);
	}
	
	menu() {
		return (
			<Menu docked={false} drawer={true} secondary={true} searchToggle={this.searchToggle}  goTo={this.goTo} handleLeftNav={this.LeftNavClose} { ...this.state } />
		);
	}
	
	contents() {
		return (<div>
			<div className="clearfix" />
			<div className="react-hot-reload-container" >
				<div style={{paddingRight:0, paddingLeft:0}} >
					<div id="content-fader">
						{this.props.children && React.cloneElement(this.props.children, Object.assign({ switchTheme: this.switchTheme }, this.state))}
					</div>
				</div>
			</div>
			<div className="clearfix" />
			<div className="simpledocs-footer" id="simpledocs-footer" >
				
			</div>
		</div>);	
	}
	
	render() {
		debug('render state', this.state);
			
		let appbar = this.appBar();
        
        let confirmer = this.confirmer();
        
        let menu = this.menu();
        
        let contents = this.contents();
        
		return (<div>
			{appbar}
			{menu}			
			{contents}
			{confirmer}
        </div>);

	}
}

Render.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export let myComponent =  wrapListeners(Render);

export default myComponent;
