import React from 'react';
import Debug from 'debug'
import { Divider, Drawer, IconButton, IconMenu, FontIcon, MenuItem } from 'material-ui';
import { Styles } from '../styles';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

let debug = Debug('lodge:app:common:components:mainMenu'); 

		
export default class mainMenu extends React.Component {
	constructor(props) {
		super(props)
		this.displayName = 'mainMenu Component'	
		this.state = {
			page: props.page,
			leftNav: props.leftNav
		};
		this._update = true;
	}
	
	componentWillReceiveProps(props) {
		debug("## componentWillReceiveProps ## mainMenu WillReceiveProps", props.leftNav !== this.state.leftNav, props.update, this.state.page !== props.page);
		if(props.leftNav !== this.state.leftNav || props.update || this.state.page !== props.page) {
			this._update = true;
			this.setState({
				page: props.page,
				leftNav: props.leftNav
			});
			return;
		}
		
	}
	
	shouldComponentUpdate() {
		debug('## shouldComponentUpdate ## mainMenu should update? ', this._update);
		if(this._update) {
			this._update = false;
			return true;
		}
		return false;
	}
	
	toggleDrawer() {
		
	}
	
	setGame(gameLink) {
		debug(' ## setGame ##',  gameLink);
		this.props.goTo({ 
			page: `${gameLink.visitor} vs. ${gameLink.home}`, 
			path: '/gameday/games/' + gameLink.gid + '/' + (this.props.params.page || '') +  (this.props.params.inning ? '/' + this.props.params.inning : '')}, 
			{ game: {} }, 
			() => { 
				this.toggleDrawer(false, false)
			} 
		);
	}
	
	render() {
		debug('## RENDER ## mainMenu render', this.props);
		
		let page = this.props.anchor || this.props.page;
		
		let menuItems = []; 

        let LeftDrawer = (
			<Drawer 
				zDepth={5}
				docked={this.props.docked}
				open={this.state.leftNav}
				
				openSecondary={this.props.secondary}
				width={255}
				onRequestChange={open => {
					debug('## RENDER ## mainMenu request change', open, this.props);
					this._update = true;
					this.props.appState({ leftNav: open });
				}}
			>
				<div className="menu" style={{
					height: this.props.window.height - 65,
					width: '100%',
					overflow: 'auto',
					marginTop: 0,
				}} >
					
					<div style={{float:'left',width:'33%', textAlign: 'center'}}>
						<IconButton 
							onClick={(e)=>{
								e.preventDefault();
								this.props.goTo({page: snowUI.name, path: snowUI.homepage});
							}} 
						>
							<FontIcon 
								className="material-icons" 
								hoverColor={Styles.Colors.limeA400} 
								color={this.props.theme.appBar.buttonColor || 'initial'} 
							> 
								home
							</FontIcon>
						</IconButton>
					</div>
					<div style={{float:'left',width:'33%', textAlign: 'center'}}>
						<IconButton onClick={(e)=>{e.preventDefault();this.props.goTo('status');}} ><FontIcon className="material-icons" hoverColor={Styles.Colors.limeA400} style={{fontSize:'20px'}}  color={this.props.theme.appBar.buttonColor || 'initial'} >router</FontIcon></IconButton>
					</div>
					<div style={{float:'left',width:'34%', textAlign: 'center', paddingTop: 12}}>
						<IconMenu
							iconButtonElement={<FontIcon className="material-icons" hoverColor={Styles.Colors.limeA400} color={this.props.theme.appBar.buttonColor || 'initial'} style={{cursor:'pointer'}}>invert_colors</FontIcon>}
							onItemTouchTap={(e, val) => {
								debug('clecked switch theme link', e, val);
								this.props.switchTheme(val.props.value, true, false, true); // this.props.handleLeftNav,
							}}
							useLayerForClickAway={true}
							menuStyle={{}}
						>
						  <MenuItem style={{lineHeight: 2}} primaryText="Default" value="reset" />
						  <MenuItem style={{lineHeight: 2}} primaryText="Rommie" value="roms"/>
						  <MenuItem style={{lineHeight: 2}} primaryText="Graphite" value="graphite"/>
						  <MenuItem style={{lineHeight: 2}} primaryText="Night" value="night"/>
						  <MenuItem style={{lineHeight: 2}} primaryText="Nite Lite" value="nitelite"/>
						  <MenuItem style={{lineHeight: 2}} primaryText="Nite Lite 2" value="nitelite2"/>
						  <MenuItem style={{lineHeight: 2}} primaryText="Nite Blue" value="nitelite3"/>
						   <MenuItem style={{lineHeight: 2}} primaryText="Nite Blue 2" value="nitelite4"/>
						  <MenuItem style={{lineHeight: 2}} primaryText="Wacky Blue" value="blue"/>
						  <MenuItem style={{lineHeight: 2}} primaryText="Alternate Blue" value="alternate blue"/>
						  <MenuItem style={{lineHeight: 2}} primaryText="White" value="light" />
						  <MenuItem style={{lineHeight: 2}} primaryText="Light" value="cream" />
						  <MenuItem style={{lineHeight: 2}} primaryText="MUI Dark" value="dark" />
						  <MenuItem style={{lineHeight: 2}} primaryText="MUI Light" value="default" />
						</IconMenu>
					</div>
					
					<div className="clearfix" />
					
					
					<MenuItem
						primaryText="Channels"
						rightIcon={<ArrowDropRight />}
						leftIcon={<FontIcon className="material-icons">live_tv</FontIcon>} 
						menuItems={[
							<MenuItem 
								primaryText="View Channels" 
								leftIcon={<FontIcon className="material-icons">dvr</FontIcon>} 
								onClick={(e) => {
									e.preventDefault(e);
									this.props.goTo({
										page: 'Channels',
										path: '/library/channels',
									}, {}, () => { this.toggleDrawer(false, false) });
								}}
								style={{}}
								href="/noscript/library/channels"
							/>,
							<MenuItem 
								primaryText="Create Channel" 
								leftIcon={<FontIcon className="material-icons">add_to_queue</FontIcon>} 
								onClick={(e) => {
									e.preventDefault(e);
									this.props.goTo({
										page: 'Create Channel',
										path: '/library/channels/add',
									}, {}, () => { this.toggleDrawer(false, false) });
								}}
								style={{}}
								href="/noscript/library/channels/add"
							/>,
						]}
					/>
					<MenuItem
						primaryText="TV Shows"
						rightIcon={<ArrowDropRight />}
						leftIcon={<FontIcon className="material-icons">tv</FontIcon>} 
						menuItems={[
							<MenuItem 
								primaryText="Recent Shows" 
								leftIcon={<FontIcon className="material-icons">slow_motion_video</FontIcon>} 
								onClick={(e) => {
									e.preventDefault(e);
									this.props.goTo({
										page: 'Recent TV',
										path: '/library/tv/recent',
									}, {}, () => { this.toggleDrawer(false, false) });
								}}
								style={{}}
								href="/noscript/library/tv/recent"
							/>,
							<MenuItem 
								primaryText="All Shows" 
								leftIcon={<FontIcon className="material-icons">view_list</FontIcon>} 
								onClick={(e) => {
									e.preventDefault(e);
									this.props.goTo({
										page: 'TV Shows',
										path: '/library/tv',
									}, {}, () => { this.toggleDrawer(false, false) });
								}}
								style={{}}
								href="/noscript/library/tv"
							/>,
						]}
					/>
					
					<MenuItem
						primaryText="Movies"
						rightIcon={<ArrowDropRight />}
						leftIcon={<FontIcon className="material-icons">movie</FontIcon>} 
						menuItems={[
							<MenuItem 
								primaryText="Recent Movies" 
								leftIcon={<FontIcon className="material-icons">slow_motion_video</FontIcon>} 
								onClick={(e) => {
									e.preventDefault(e);
									this.props.goTo({
										page: 'Recent TV',
										path: '/library/movies/recent',
									}, {}, () => { this.toggleDrawer(false, false) });
								}}
								style={{}}
								href="/noscript/library/movies/recent"
							/>,
							<MenuItem 
								primaryText="All Movies" 
								leftIcon={<FontIcon className="material-icons">local_movies</FontIcon>} 
								onClick={(e) => {
									e.preventDefault(e);
									this.props.goTo({
										page: 'Movies',
										path: '/library/movies',
									}, {}, () => { this.toggleDrawer(false, false) });
								}}
								style={{}}
								href="/noscript/library/movies"
							/>,
						]}
					/>
					<Divider />
					<MenuItem 
						leftIcon={<FontIcon className="material-icons">polymer</FontIcon>}
						onClick={(e) => {
							e.preventDefault(e);
							this.props.goTo({
								page: 'Programs',
								path: '/programs',
							}, {}, () => { this.toggleDrawer(false, false) });
						}}
						style={{}}
						href="/noscript/programs"
						children="Programs"
					/>							
				</div>
			</Drawer>
		);
		
		if(this.props.drawer) {
			return (LeftDrawer);
		} else {
			return (<div></div>);
		} 	
	}
}

mainMenu.defaultProps = {
	games: [],
	game: {}
}
