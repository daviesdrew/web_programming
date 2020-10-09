import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import BrowseView from '../Browse/';
import About from '../About/';
import Collaborate from '../Collaborate/';
import Contact from '../Contact/';
import SearchView from '../Search/';
import Admin from '../Admin/';
import * as ENV from '../config/literals';
import './index.css';
import logo from '../media/university_logo.png';
import admin_icon from '../media/admin_icon.png';

// may want to store cache, previous results, etc
class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.getCurrentTab(),
      activeBrowseTab: '',
      activeSearchTab: '',
      activeUserTab: '',
      accessToken: '',
      user: ''
    };
    this.changeActiveTab = this.changeActiveTab.bind(this);
    this.getCurrentTab = this.getCurrentTab.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
  }

  // Set the current highlighted tab
  changeActiveTab(tab) {
    this.setState({
      activeTab: tab
    });
  }

  // Used to grab the current active path when refreshing the page
  getCurrentTab() {
    return window.location.pathname.split('/')[2];
  }

  // Handle a login change (from the Admin & Login components)
  handleLoginChange(token, user) {
    this.setState({
      accessToken: token,
      user: user
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className='top-menu'>
          <img src={logo} className='top-menu--logo' alt='Logo'></img>
          <div className={'top-menu--item' + (this.state.activeTab === ENV.IDEN_ABOUT ? '--active' : '')}
            onClick={() => this.changeActiveTab(ENV.IDEN_ABOUT)} >
            <Link to={ENV.ROUTE_ABOUT}>About</Link>
          </div>
          <div className='top-menu--dropdown'>
            <div className={'top-menu--dropdown-button' + (this.state.activeTab === ENV.IDEN_BROWSE ? '--active' : '')} >
              Browse
            </div>
            <div className='top-menu--dropdown-content'>
              <Link to={ENV.ROUTE_BROWSE} onClick={() => this.setState({
                activeTab: ENV.IDEN_BROWSE,
                activeBrowseTab: ENV.IDEN_MANUSCRIPT
              })}>Manuscripts</Link>
              {/*<Link to={ENV.ROUTE_BROWSE} onClick={() => this.setState({
                activeTab: ENV.IDEN_BROWSE,
                activeBrowseTab: ENV.IDEN_CONTENT
              })}>Manuscript Contents</Link> */}
              <Link to={ENV.ROUTE_BROWSE} onClick={() => this.setState({
                activeTab: ENV.IDEN_BROWSE,
                activeBrowseTab: ENV.IDEN_APOCRYPHA
              })}>Apocryphon</Link>
              <Link to={ENV.ROUTE_BROWSE} onClick={() => this.setState({
                activeTab: ENV.IDEN_BROWSE,
                activeBrowseTab: ENV.IDEN_BIBLIO
              })}>Bibliographies</Link>
            </div>
          </div>
          <div className='top-menu--dropdown'>
            <div className={'top-menu--dropdown-button' + (this.state.activeTab === ENV.IDEN_SEARCH ? '--active' : '')} >
              Search
            </div>
            <div className='top-menu--dropdown-content'>
              <Link to={ENV.ROUTE_SEARCH} onClick={() => this.setState({
                activeTab: ENV.IDEN_SEARCH,
                activeSearchTab: ENV.IDEN_MANUSCRIPT
              })}>Manuscripts</Link>
              {/*}
              <Link to={ENV.ROUTE_SEARCH} onClick={() => this.setState({
                activeTab: ENV.IDEN_SEARCH,
                activeSearchTab: ENV.IDEN_CONTENT
              })}>Manuscript Contents</Link> */}
              <Link to={ENV.ROUTE_SEARCH} onClick={() => this.setState({
                activeTab: ENV.IDEN_SEARCH,
                activeSearchTab: ENV.IDEN_APOCRYPHA
              })}>Apocryphon</Link>
              <Link to={ENV.ROUTE_SEARCH} onClick={() => this.setState({
                activeTab: ENV.IDEN_SEARCH,
                activeSearchTab: ENV.IDEN_BIBLIO
              })}>Bibliographies</Link>
            </div>
          </div>
          <div className='hidden'>
            <div className={'top-menu--item' + (this.state.activeTab === ENV.IDEN_COLLAB ? '--active' : '')}
              onClick={() => this.changeActiveTab(ENV.IDEN_COLLAB)} >
              <Link to={ENV.ROUTE_COLLAB}>Collaborate</Link>
            </div>
          </div>
          <div className={'top-menu--item' + (this.state.activeTab === ENV.IDEN_CONTACT ? '--active' : '')}
            onClick={() => this.changeActiveTab(ENV.IDEN_CONTACT)} >
            <Link to={ENV.ROUTE_CONTACT}>Contact</Link>
          </div>
          <div className={'top-menu--admin-icon' + (this.state.activeTab === ENV.IDEN_ADMIN ? '--active' : '')}
            onClick={() => this.changeActiveTab(ENV.IDEN_ADMIN)} >
            <Link to={ENV.ROUTE_ADMIN}>
              <img src={admin_icon} alt='Admin'></img>
            </Link>
          </div>
          {this.state.user &&
              <div className='logged-in-as--display'> Logged in as: <b>{this.state.user}</b></div>}
        </div>
        <Route
          exact
          path='/'>
          <Redirect to={ENV.ROUTE_ABOUT} />
        </Route>
        <Route
          exact
          path='/gospel/'>
          <Redirect to={ENV.ROUTE_ABOUT} />
        </Route>
        <Route
          path={ENV.ROUTE_ABOUT}>
          <About />
        </Route>
        <Route
          path={ENV.ROUTE_BROWSE}>
          <BrowseView isBrowsing={this.state.activeBrowseTab} />
        </Route>
        <Route
          path={ENV.ROUTE_SEARCH}>
          <SearchView isSearching={this.state.activeSearchTab} />
        </Route>
        <Route
          path={ENV.ROUTE_COLLAB}>
          <Collaborate />
        </Route>
        <Route
          path={ENV.ROUTE_CONTACT}>
          <Contact />
        </Route>
        <Route
          path={ENV.ROUTE_ADMIN}
          render={props => (
            <Admin
              accessToken={this.state.accessToken}
              user={this.state.user}
              handleLoginChange={this.handleLoginChange} />
          )}
        />
      </BrowserRouter >
    );
  }
}

export default TopMenu;