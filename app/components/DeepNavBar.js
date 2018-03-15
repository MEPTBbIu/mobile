import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    BackHandler
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as navigationActions from '../actions/navigation_act';

import NavigationBar from 'react-native-navbar';

import base from '../themes/BaseStyles';
import Fonts from '../themes/Fonts';

import DeviceInfo from 'react-native-device-info';

import { Actions } from 'react-native-router-flux';

export const mapStateToProps = state => ({
    alpha: state.settingsState.alpha,
    mod: state.settingsState.mod,
    legend: state.settingsState.legend,
    secondLegend: state.settingsState.secondLegend,
    contextIdStackHome: state.navigationState.contextIdStackHome,
    contextIdStackFavourite: state.navigationState.contextIdStackFavourite,
    contextIdStackSearch: state.navigationState.contextIdStackSearch,
    parent: state.navigationState.parent
});

export const mapDispatchToProps = (dispatch) => ({
    navigationActions: bindActionCreators(navigationActions, dispatch)
});

class DeepNavBar extends Component {

    constructor(props) {
        super(props);
        this.backPressed = this.backPressed.bind(this);
    }

    backPressed() {
        if(this.props.parent == "Favourites") {
            this.props.navigationActions.popContextIdFavourite();
            this.props.navigationActions.changeContextId(this.props.contextIdStackFavourite[this.props.contextIdStackFavourite.length-2]);
        } else if (this.props.parent == "Search") {
            this.props.navigationActions.popContextIdSearch();
            this.props.navigationActions.changeContextId(this.props.contextIdStackSearch[this.props.contextIdStackSearch.length-2]);
        } else if (this.props.parent == "Home") {
            this.props.navigationActions.popContextIdHome();
            this.props.navigationActions.changeContextId(this.props.contextIdStackHome[this.props.contextIdStackHome.length-2]);
        }
        Actions.pop();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            try {
                if(this.props.parent == "Favourites") {
                    this.props.navigationActions.popContextIdFavourite();
                    this.props.navigationActions.changeContextId(this.props.contextIdStackFavourite[this.props.contextIdStackFavourite.length-1]);
                } else if (this.props.parent == "Search") {
                    this.props.navigationActions.popContextIdSearch();
                    this.props.navigationActions.changeContextId(this.props.contextIdStackSearch[this.props.contextIdStackSearch.length-1]);
                } else if (this.props.parent == "Home") {
                    this.props.navigationActions.popContextIdHome();
                    this.props.navigationActions.changeContextId(this.props.contextIdStackHome[this.props.contextIdStackHome.length-1]);
                }
                return false;
            } catch (err) {
                return false;
            }
        });
    }

    render() {
        let title = <Text style = {[styles.title, {color: this.props.secondLegend}]}>{this.props.title}</Text>

        var leftElements = (
            <View style = {styles.navItemView}>
                <TouchableOpacity onPress = {() => {this.backPressed()}}>
                    <View style = {styles.leftNavButtonView}>
                        <FontAwesome name = "chevron-left" size = {20} allowFontScaling = {false} color = {this.props.legend}/>
                    </View>
                </TouchableOpacity>
                {title}
            </View>
        )

        var rightElements = (
            <View />
        )

        var statusBarPadding;
        var navBarMargin;
        if(Platform.OS == "ios") {
            if(DeviceInfo.getModel() == "iPhone X") {
                statusBarPadding = <View style = {[styles.iPhoneXPadding, { backgroundColor: this.props.mod}]} />;
            } else {
                statusBarPadding = <View style={[styles.statusBarPadding, {backgroundColor: this.props.mod}]}/>;
            }
            navBarMargin = -20;
        } else {
            statusBarPadding = <View />;
            navBarMargin = 0;
        }

        return (
            <View style = {styles.navBarContainer}>
                <StatusBar
                    backgroundColor = {this.props.mod}
                    barStyle = "light-content"
                    />
                {statusBarPadding}
                <NavigationBar
                    style = {[styles.navBar, {backgroundColor: this.props.mod, marginTop: navBarMargin}]}
                    leftButton = {leftElements}
                    rightButton = {rightElements}
                    />
            </View>
        )
    }

}

const baseStyles = _.extend(base.general, {
    statusBarPadding: {
        height: 20
    },
    iPhoneXPadding: {
        height: 44
    },
    navBarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        alignSelf: 'stretch',
        flex: 1
    },
    navBar: {
        paddingLeft: 15,
        paddingRight: 15
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.base,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    navItemView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftNavButtonView: {
        paddingRight: 20,
        paddingTop: 8,
        paddingBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1
    }
});

const styles = StyleSheet.create(baseStyles);

export default connect(mapStateToProps, mapDispatchToProps)(DeepNavBar);
