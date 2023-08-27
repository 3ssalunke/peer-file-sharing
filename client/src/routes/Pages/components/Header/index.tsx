import { useState } from 'react';
import { GitHub, Menu, X } from 'react-feather';
import { NavLink } from 'react-router-dom';

import logo from '../../../../assets/images/logo.svg';
import Pill from '../../../../components/Pill';
import pkg from '../../../../../package.json';
import './Header.scss';

const activeClassName = (props: { isActive: boolean; isPending: boolean }) =>
  props.isPending ? '' : props.isActive ? 'active' : '';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="page-header">
      <a href="/" className="brand">
        <img src={logo} alt="OFS" />
        <Pill>v{pkg.version}</Pill>
      </a>

      <button className="btn thin icon mobile-menu" onClick={toggleMenu}>
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <nav style={{ display: isMenuOpen ? 'flex' : 'none' }}>
        <NavLink className={activeClassName} to="/how it works">
          How it works
        </NavLink>
        <a href="https://github.com/3ssalunke/ofs">
          Github&nbsp; <GitHub size={16} style={{ marginBottom: '4px' }} />
        </a>
        <a href="https://github.com/sponsors/3ssalunke" target="_blank">
          Sponsor Me!
        </a>
        <a
          className="ph-desktop"
          href="https://www.producthunt.com/posts/blaze-2?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-blaze-2"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=174403&theme=dark&period=daily"
            alt="OFS - Fast peer to peer file sharing web app ⚡ | Product Hunt Embed"
            style={{ width: '250px', height: '54px' }}
            width="250px"
            height="54px"
          />
        </a>
      </nav>
    </header>
  );
};

export default Header;
