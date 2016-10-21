import React from 'react';
import Debug from 'debug';
import Gab from '../common/gab';
import { Styles } from '../common/styles';
import { GridList, GridTile, Divider, FontIcon, CardText, Card, CardActions, CardHeader, CardMedia, CardTitle } from 'material-ui';

let debug = Debug('lodge:app:pages:status');
		
export default class Status extends React.Component {
	constructor(props) {
		super(props)
		this.displayName = 'Status Component'	
		this.state = {
			
		}
		this._update = false
	}
	
	componentWillReceiveProps(props) {
		debug('receiveProps');
		this._update = true;
	}
	componentDidUpdate() {
		snowUI.fadeIn();
		debug('didUpdate');
	}
	componentDidMount() {
		debug('did mount');
		snowUI.fadeIn();
	}
	render() {
		debug('status render', this.props);
		let status;
		if(this.props.sockets.connected.connected || !snowUI.usesockets) {
			let msg = !snowUI.usesockets ? '' : "The server is online and accepting page requests.";
			status =  (
				<CardHeader 
					title={"Welcome to the lodge.  Enjoy your time with us!"}
					subtitle={msg}
					avatar={<FontIcon style={{fontSize:'42px'}} className="material-icons" color={Styles.Colors.lightBlue700} hoverColor={Styles.Colors.lightBlue500} >speaker_phone</FontIcon>}

				/>
			);
		} else if(this.props.sockets && this.props.sockets.connected.firstRun) {
			status = (
				<CardHeader 
					title={"Client trying to initate connection"}
					subtitle={"The client is currently setting up communication with the agent."}
					avatar={<FontIcon style={{fontSize:'42px'}} className="material-icons" color={Styles.Colors.orangeA700} hoverColor={Styles.Colors.orangeA400} >speaker_phone</FontIcon>}

				/>
			);
		} else {
			status = (
				<CardHeader 
					title={"Server Connection Issues"}
					subtitle={"The agent is currently not responding to socket requests"}
					avatar={<FontIcon style={{fontSize:'42px'}} className="material-icons" color={Styles.Colors.red600} hoverColor={Styles.Colors.amber500} >cloud_off</FontIcon>}
					titleColor={Styles.Colors.red600}
					
				/>
			);
		}
		let ghpages = <span />;
		
		return (<div className="col-xs-12" style={{paddingRight:0, paddingLeft:0}}  >
			<Card style={{paddingRight:0, paddingLeft:0}} >
				{status}				
				<Card>
					<CardHeader 
						title={"About"}
						subtitle={"information"}
						avatar={<FontIcon style={{}} className="material-icons" color={Styles.Colors.blueGrey600} hoverColor={Styles.Colors.blueGrey600} >info_outline</FontIcon>}

						actAsExpander={true}
						showExpandableButton={true}
					/>
					<CardText expandable={true} >
						<h4>libraries</h4> 
						<GridList
							cellHeight={75}
							style={{ width:'100%' }}
							cols={3}
						>
							<GridTile 
								key="keystoneTime"
								title={<a style={{color: Styles.Colors.grey300, textDecoration: 'none'}} href="http://keystonejs.com/" target="_blank">Keystone</a>}
								style={{backgroundColor: '#2B4BA7'}}
							/>
							
							<GridTile 
								key="mongoTile"
								title={<a style={{color: Styles.Colors.grey300, textDecoration: 'none'}} href="http://mongoosejs.com/" target="_blank">Mongoose & MongoDB</a>}
								style={{backgroundColor: '#A76D2B'}}
							/>
							<GridTile 
								key="socketTile"
								title={<a style={{color: Styles.Colors.grey300, textDecoration: 'none'}} href="http://socket.io" target="_blank">Socket.io</a>}
								style={{backgroundColor: '#2D542D'}}
							/>
							<GridTile 
								key="system"
								title={<a style={{color: Styles.Colors.grey300, textDecoration: 'none'}} href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjd547O4LnNAhUD64MKHXecCAIQFggeMAA&url=https%3A%2F%2Fgithub.com%2Fsystemjs%2Fsystemjs&usg=AFQjCNEd2Qp35su4CrYsTWnZyZBGWloONg&sig2=cZkcWV4uO_3imicj8gpCsA" target="_blank">SystemJS</a>}
								style={{backgroundColor: '#DD620E'}}
							/>
							<GridTile 
								key="reactTile"
								title={<a style={{color: Styles.Colors.grey300, textDecoration: 'none'}} href="http://facebook.github.io/react/docs/thinking-in-react.html" target="_blank">React JS</a>}
								style={{backgroundColor: '#2B3D6D'}}
							/>
							<GridTile 
								key="matrerialTile"
								title={<a style={{color: Styles.Colors.grey300, textDecoration: 'none'}} href="http://material-ui.com/" target="_blank">Material-UI</a>}
								style={{backgroundColor: '#4EAEBB'}}
							/>
						</GridList>
					</CardText>
				</Card>
				<Card>
					<CardHeader 
						title={"Theme"}
						subtitle={"switch between the available themes"}
						avatar={<FontIcon style={{}} className="material-icons" color={Styles.Colors.blueGrey600} hoverColor={Styles.Colors.blueGrey600} >invert_colors</FontIcon>}

						actAsExpander={false}
						showExpandableButton={false}
					/>
				</Card>
				<GridList
					cellHeight={100}
					style={{width:'100%'}}
					cols={7}
					padding={0}
				>
					<GridTile 
						key="Materiallreste"
						title={"Default"}
						onClick={e => this.props.switchTheme('reset')}
						style={{backgroundColor: 'initial', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MaterialDLfdasightTheme"
						title={"Rommie"}
						onClick={e => this.props.switchTheme('roms')}
						style={{backgroundColor: '#303234', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MaterialDLightTheme"
						title={"Alt Blue"}
						onClick={e => this.props.switchTheme('alternate blue')}
						style={{backgroundColor: '#0C87C1', cursor: 'pointer'}}
					/>
					
					<GridTile 
						key="MaterialDLissghtTheme"
						title={"Blue"}
						onClick={e => this.props.switchTheme('blue')}
						style={{backgroundColor: '#283593', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MaterialTheme"
						title={"Graphite"}
						onClick={e => this.props.switchTheme('graphite')}
						style={{backgroundColor: '#303030', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MaterialDarkTheme"
						title={"Night"}
						onClick={e => this.props.switchTheme('night')}
						style={{backgroundColor: '#223E77', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MaterialDarknnTheme"
						title={"Nite Lite"}
						onClick={e => this.props.switchTheme('nitelite')}
						style={{backgroundColor: 'rgb(40, 53, 147)', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MaterialDarknn2Theme"
						title={"Nite Lite 2"}
						onClick={e => this.props.switchTheme('nitelite2')}
						style={{backgroundColor: '#F57C00', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MaterialDarknn3Theme"
						title={"Nite Lite 3"}
						onClick={e => this.props.switchTheme('nitelite3')}
						style={{backgroundColor: '#1A237E', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MaterialL7ightTheme"
						title={"Cream"}
						onClick={e => this.props.switchTheme('cream')}
						style={{backgroundColor: '#FFFCEF', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MaterialLightTheme"
						title={"Light"}
						onClick={e => this.props.switchTheme('light')}
						style={{backgroundColor: '#eeeeee', cursor: 'pointer'}}
					/> 
					<GridTile 
						key="MateriallDDarkTheme"
						title={"MUI Dark"}
						onClick={e => this.props.switchTheme('dark')}
						style={{backgroundColor: '#0097A7', cursor: 'pointer'}}
					/>
					<GridTile 
						key="MateriallDdefTheme"
						title={"MUI Light"}
						onClick={e => this.props.switchTheme('default')}
						style={{backgroundColor: '#fff', cursor: 'pointer'}}
					/>
				</GridList>
			</Card>
		</div>);	
	}
}

