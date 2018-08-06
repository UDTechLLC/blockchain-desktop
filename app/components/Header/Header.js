import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import UiNavLink from '../UI/NavLink/NavLink';
import Graph from '../Graph/Graph';
import Search from '../Search/Search';
import { bytes2HumanReadableSize } from '../../utils/utils';

import { logout, settings, wallet } from '../../assets/img/img';
import css from './Header.css';
import commonCss from './../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class Header extends Component {
  state = {
    unAuthorisedMenu: [
      { link: '/access', label: 'Access' },
      { link: '/register', label: 'Register' }
    ],
    authorisedMenu: [
      { link: '/drive', label: 'Drive' },
      { link: '/note', label: 'Note' }
    ],
    iconsMenu: [
      { link: '/wallet', label: wallet, alt: 'settings' },
      { link: '/account', label: settings, alt: 'settings' },
      { link: '/logout', label: logout, alt: 'logout' },
    ],
    userFilesSize: 340 * 1024 * 1024,
    userFilesLimit: 1024 * 1024 * 1024
  };
  render() {
    const leftMenu = this.props.isAuth
      ? this.state.authorisedMenu
      : this.state.unAuthorisedMenu;
    const rightMenu = this.props.isAuth
      ? this.state.iconsMenu
      : undefined;
    return (
      <div
        className={[
          styles.w100,
          styles.flexBetweenCenter,
          styles.paddingSmTop,
          styles.paddingMdRight,
          styles.paddingSmBottom,
          styles.paddingMdLeft,
          styles.Header
        ].join(' ')}
      >
        <div className={styles.flexAllCenter}>
          <div
            className={[
              styles.flexAlignCenter,
              styles.relative,
              styles.Logo
            ].join(' ')}
          >
            <h3>2SDS</h3>
            <div className={[styles.orangeBar, styles.Bar].join(' ')} />
          </div>
          <nav>
            <ul className={[styles.flex, styles.NavList].join(' ')}>
              {
                leftMenu.map((item, index) => (
                  <li key={index} className={styles.marginSmRight}>
                    <UiNavLink
                      link={item.link}
                      label={item.label}
                    />
                  </li>
                ))
              }
            </ul>
          </nav>
        </div>
        {
          rightMenu
            ? (
              <ul
                className={[
                  styles.flexBetweenCenter,
                  styles.IconsMenu
                ].join(' ')}
              >
                <li>
                  <Search />
                </li>
                {
                  rightMenu.map((item, index) => (
                    <div
                      key={index}
                      className={[
                        styles.flexAllCenter,
                        styles.h100
                      ].join(' ')}
                    >
                      {
                        index !== rightMenu.length - 1
                          ? undefined
                          : (
                            <li
                              className={[
                                styles.flexBetweenCenter,
                                styles.marginSmRight,
                                styles.white,
                                styles.GraphWrapper
                              ].join(' ')}
                            >
                              <Graph
                                progress={this.state.userFilesSize / this.state.userFilesLimit}
                              />
                              <span>
                                {`${bytes2HumanReadableSize(this.state.userFilesSize)} / ${bytes2HumanReadableSize(this.state.userFilesLimit)}`}
                              </span>
                            </li>
                          )
                      }
                      <li className={styles.marginSmRight}>
                        <NavLink
                          to={item.link}
                        >
                          <img src={item.label} alt={item.alt} height={18} />
                        </NavLink>
                      </li>
                    </div>
                  ))
                }
              </ul>
            )
            : undefined
        }
      </div>
    );
  }
}

Header.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

export default Header;
