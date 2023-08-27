import earth from '../../../assets/images/illustrations/earth.svg';
import network from '../../../assets/images/illustrations/network.svg';
import twoDevices from '../../../assets/images/illustrations/two_devices.svg';
import threeDevices from '../../../assets/images/illustrations/three_devices.svg';

import './Home.scss';

const Home = () => {
  return (
    <main className="landing-page">
      <section className="hero full-screen">
        <div className="info">
          <h1 className="title">Share files the modern way</h1>
          <h2 className="subtitle">
            Using just a web browser to any device on the internet!
          </h2>

          <a href="/app" className="btn">
            Start Sharing
          </a>
          <a
            className="ph-mob"
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
        </div>

        <img
          className="network-img"
          src={network}
          alt="Devices connected using blaze"
        />

        <svg
          className="waves"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,160L21.8,160C43.6,160,87,160,131,181.3C174.5,203,218,245,262,234.7C305.5,224,349,160,393,133.3C436.4,107,480,117,524,106.7C567.3,96,611,64,655,80C698.2,96,742,160,785,176C829.1,192,873,160,916,138.7C960,117,1004,107,1047,112C1090.9,117,1135,139,1178,170.7C1221.8,203,1265,245,1309,234.7C1352.7,224,1396,160,1418,128L1440,96L1440"
            strokeDashoffset="1650"
            strokeDasharray="1650"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1650"
              to="0"
              dur="1.8s"
              fill="freeze"
              keySplines=".42,0,.58,1"
              calcMode="spline"
              keyTimes="0; 1"
            />
          </path>
        </svg>
      </section>

      <section className="features">
        <div className="feature">
          <img
            src={twoDevices}
            alt="Laptop and mobile connected together"
            loading="lazy"
            style={{ marginRight: '-60px' }}
          />
          <h2>Easy to use</h2>
          <p>
            OFS is a web app, just open it in your browser, join a room, and
            start sharing. No need to install any specific app, or create an
            account!
          </p>
        </div>

        <div className="feature">
          <img
            src={threeDevices}
            alt="Laptop and two mobiles are connected together"
            loading="lazy"
          />
          <h2>Multi-device</h2>
          <p>
            Traditionally, sharing files to multiple devices has been a hassle.
            With OFS, you can share files across multiple devices with ease.
          </p>
        </div>

        <div className="feature">
          <img
            src={earth}
            alt="Devices in different parts of the world using Blaze to share files"
            loading="lazy"
          />
          <h2>Anywhere</h2>
          <p>
            OFS is built on modern web technologies, allowing it to work on
            devices far away from each other. It just needs to be connected to
            the internet.
          </p>
        </div>
      </section>

      <section className="about">
        <blockquote>
          <span>"</span>I built OFS because I wanted a fast, radically different
          way to transfer files between my laptop and mobile<span>"</span>
        </blockquote>
        <footer>
          <a
            href="https://akashhamirwasia.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://github.com/blenderskool.png?size=100"
              alt="Suraj Salunke"
            />
          </a>
          <cite>Suraj Salunke</cite>
          <cite>Creator of OFS</cite>
        </footer>
      </section>

      <section className="hero final-cta">
        <div>
          <h2 className="title">Let's get sharing!</h2>
          <h3 className="subtitle">
            No registration required, completely free
          </h3>

          <a href="/app" className="btn">
            Start sharing
          </a>
        </div>
      </section>
    </main>
  );
};

export default Home;
